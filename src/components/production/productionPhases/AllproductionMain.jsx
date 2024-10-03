import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { fireDB } from '../../firebase/FirebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import './productionPhases.css';


const productionColumns = [
    { Header: 'Sr No', accessor: 'srNo' },
    { Header: 'Machine Name', accessor: 'machineName' },
    { Header: 'Production Order ID', accessor: 'poid' },
    { Header: 'FG ID', accessor: 'fgId' },
    { Header: 'Planned Qty', accessor: 'plannedQty' },
    { Header: 'Cycle (sec)', accessor: 'cycle' },
    { Header: 'Per Hr Qty', accessor: 'perHrQty' },
    { Header: 'Per Day Qty', accessor: 'perDayQty' },
    { Header: 'Required Time', accessor: 'requiredTime', },
    {
        Header: 'Action', Cell: ({ row }) => {
            return (
                <div>
                    <div className="button-group">
                        <button onClick={() => handleStart(row.original)}>Start</button>
                    </div>
                </div>
            );
        },
    }
];

const handleStart = async (rowData) => {
    try {
        const docRef = doc(fireDB, 'Production_Orders', rowData.poid);
        await updateDoc(docRef, {
            progressStatus: "Production Started",
            productionStatus: "Production phase started",
            cycle: rowData.cycle,
            perHrQty: rowData.perHrQty,
            perDayQty: rowData.perDayQty,
            requiredTime: rowData.requiredTime,
            startTime: serverTimestamp()
        });

        alert('Production started', rowData.poid);
    } catch (error) {
        alert('Error updating document: ', error);
    }
};

const assemblyColumns = [
    { Header: 'Sr/No', accessor: 'srNo' },
    { Header: 'Machine Name', accessor: 'selectedMachine' }
];

function AllproductionMain() {
    const [machineNames, setMachineNames] = useState([]);
    const [productionData, setProductionData] = useState([]);
    const [cycleInput, setCycleInput] = useState({});
    const [perHrQtyInput, setPerHrQtyInput] = useState({});
    const [perDayQtyInput, setPerDayQtyInput] = useState({});
    const [activePhase, setActivePhase] = useState('production');
    const [inputValues, setInputValues] = useState({});
    const [machineData, setMachineData] = useState([]);

    const handlePhaseClick = (phase) => {
        setActivePhase(phase);
    };

    // Function to fetch data from Firestore
    const fetchProductionData = async () => {
        try {
            const q = query(
                collection(fireDB, 'Production_Orders'),
                where('progressStatus', '==', 'Material Allocated')
            );
            const querySnapshot = await getDocs(q);
            const productionOrders = querySnapshot.docs.map((doc, index) => ({
                srNo: index + 1,
                machineName: doc.data().selectedMachine,
                fgId: doc.data().selectedProductId,
                plannedQty: doc.data().quantity,
                poid: doc.data().productionOrderId,
                cycle: cycleInput[index] || '',
                perHrQty: perHrQtyInput[index] || '',
                perDayQty: perDayQtyInput[index] || '',
            }));
            setProductionData(productionOrders);
        } catch (error) {
            console.error('Error fetching production data: ', error);
        }
    };

    const fetchAssemblyData = async () => {
        try {
            const q = query(
                collection(fireDB, 'Production_Orders'),
                where('progressStatus', '==', 'In Process Quality Approved'),
                where('productionStatus', '==', 'Production Phase 1 complete')
            );
    
            const querySnapshot = await getDocs(q);
    
            const fetchedData = querySnapshot.docs.map((doc, index) => {
                const data = doc.data();
                return {
                    srNo: index + 1,
                    selectedMachine: data.selectedMachine || 'N/A',
                    ...data
                };
            });
    
            setMachineData(fetchedData); // Directly update state with fetched data
        } catch (error) {
            console.error('Error fetching assembly data: ', error);
        }
    };    

    // Component logic and table rendering
    useEffect(() => {
        fetchAssemblyData();
    }, []);

    const tableInstance = useTable({ columns: assemblyColumns, data: machineData });

    useEffect(() => {
        if (activePhase === 'production') {
            fetchProductionData();
        }
    }, [activePhase]);

    const handleInputChange = (index, field, value) => {
        const updatedData = productionData.map((item, i) => {
            if (i === index) {
                let newValue = { ...item, [field]: value };
                if (field === 'cycle' && value) {
                    const cycleInSeconds = parseFloat(value);
                    if (!isNaN(cycleInSeconds) && cycleInSeconds > 0) {
                        const perHrQty = Math.round(3600 / cycleInSeconds);
                        const perDayQty = Math.round(perHrQty * 12);
                        const pq = item.plannedQty;
                        let requiredTime;
                        const requiredHours = pq / perHrQty;
                        if (requiredHours > 12) {
                            requiredTime = Math.round(requiredHours / 12) + ' days';
                        } else {
                            requiredTime = Math.ceil(requiredHours) + ' hours';
                        }

                        newValue = {
                            ...newValue,
                            perHrQty,
                            perDayQty,
                            requiredTime,
                        };
                    }
                }
                return newValue;
            }
            return item;
        });
        setProductionData(updatedData);
    };


    const productionTableInstance = useTable({
        columns: productionColumns,
        data: productionData,
    });

    return (
        <div className="productionPhases">
            <div className="phases">
                <h5
                    className={activePhase === 'production' ? 'active' : ''}
                    onClick={() => handlePhaseClick('production')}
                >
                    Production Phase
                </h5>
                <h5
                    className={activePhase === 'assembly' ? 'active' : ''}
                    onClick={() => handlePhaseClick('assembly')}
                >
                    Assembly Phase
                </h5>
            </div>
            <div className="singlePhase">
                <div className="phase-title">
                    <h3>{activePhase.charAt(0).toUpperCase() + activePhase.slice(1)} Phase</h3>
                </div>
                <div className="phaseMachines">
                    {activePhase === 'production' && (
                        <>
                            <div className="machineBody">
                                <table {...productionTableInstance.getTableProps()}>
                                    <thead>
                                        {productionTableInstance.headerGroups.map((headerGroup) => (
                                            <tr {...headerGroup.getHeaderGroupProps()}>
                                                {headerGroup.headers.map((column) => (
                                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody {...productionTableInstance.getTableBodyProps()}>
                                        {productionTableInstance.rows.map((row, i) => {
                                            productionTableInstance.prepareRow(row);
                                            return (
                                                <tr {...row.getRowProps()}>
                                                    {row.cells.map((cell) => (
                                                        <td {...cell.getCellProps()}>
                                                            {['cycle', 'perHrQty', 'perDayQty'].includes(cell.column.id) ? (
                                                                <input
                                                                    type="text"
                                                                    value={cell.value}
                                                                    onChange={(e) =>
                                                                        handleInputChange(i, cell.column.id, e.target.value)
                                                                    }
                                                                    readOnly={cell.column.id !== 'cycle'} // Only 'cycle' is editable
                                                                />
                                                            ) : (
                                                                cell.render('Cell')
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    {activePhase === 'assembly' && machineData.length > 0 && (
                        <>
                            {machineData.map((machine, index) => (
                                <div key={index} className="machine">
                                    <div className="machineBody">
                                        <table {...tableInstance.getTableProps()}>
                                            <thead>
                                                {tableInstance.headerGroups.map(headerGroup => (
                                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                                        {headerGroup.headers.map(column => (
                                                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody {...tableInstance.getTableBodyProps()}>
                                                {tableInstance.rows.map(row => {
                                                    tableInstance.prepareRow(row);
                                                    return (
                                                        <tr {...row.getRowProps()}>
                                                            {row.cells.map(cell => (
                                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                            ))}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AllproductionMain;
