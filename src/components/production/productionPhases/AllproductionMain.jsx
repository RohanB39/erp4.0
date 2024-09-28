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
    {Header: 'Required Time',accessor: 'requiredTime',},
    {Header: 'Action', Cell: ({ row }) => {
            return (
                <div>
                    <div className="button-group">
                        <button onClick={() => handleStart(row.original)}>Start</button>
                        <button onClick={() => handleStop(row.original)}>Stop</button>
                    </div>
                </div>
            );
        },}
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


const handleStop = (rowData) => {
    console.log('Stop action for:', rowData);
};
const assemblyColumns = [
    { Header: 'Machine Name', accessor: 'machineName' },
    { Header: 'Machine Process', accessor: 'machineProcess' },
    { Header: 'Machine Cycle Time', accessor: 'machineCycleTime' },
];

const packingColumns = [
    { Header: 'Sr No', accessor: 'srNo' },
    { Header: 'Machine Name', accessor: 'machineName' },
    {
        Header: 'Process of Packing',
        accessor: 'packingProcess',
        Cell: ({ value, row, column, updateData }) => (
            <select
                value={value}
                onChange={(e) => updateData(row.index, column.id, e.target.value)}
            >
                <option value="Wrapping">Wrapping</option>
                <option value="Boxing">Boxing</option>
                <option value="Other">Other</option>
            </select>
        )
    },
];

function AllproductionMain() {
    const [machineNames, setMachineNames] = useState([]);
    const [productionData, setProductionData] = useState([]);
    const [cycleInput, setCycleInput] = useState({});
    const [perHrQtyInput, setPerHrQtyInput] = useState({});
    const [perDayQtyInput, setPerDayQtyInput] = useState({});
    const [activePhase, setActivePhase] = useState('production');

    const [inputValues, setInputValues] = useState({});

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

    useEffect(() => {
        if (activePhase === 'production') {
            fetchProductionData();
        }
    }, [activePhase]);

    const handleInputChange = (index, field, value) => {
        const updatedData = productionData.map((item, i) => {
            if (i === index) {
                let newValue = { ...item, [field]: value };
                
                // If the cycle input is changed, calculate the Per Hr Qty and Per Day Qty
                if (field === 'cycle' && value) {
                    const cycleInSeconds = parseFloat(value);
                    if (!isNaN(cycleInSeconds) && cycleInSeconds > 0) {
                        const perHrQty = Math.round(3600 / cycleInSeconds); 
                        const perDayQty = Math.round(perHrQty * 12);
    
                        // Get planned quantity from the state
                        const pq = item.plannedQty; // Use item.plannedQty for the current row
                        let requiredTime;
    
                        // Calculate required time
                        const requiredHours = pq / perHrQty;
                        if (requiredHours > 12) {
                            // Convert to days
                            requiredTime = Math.round(requiredHours / 12) + ' days';
                        } else {
                            requiredTime = Math.ceil(requiredHours) + ' hours';
                        }
    
                        newValue = {
                            ...newValue,
                            perHrQty,
                            perDayQty,
                            requiredTime, // Store the required time
                        };
                    }
                }
                return newValue;
            }
            return item;
        });
        setProductionData(updatedData);  // Update the entire production data state
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
                <h5
                    className={activePhase === 'packing' ? 'active' : ''}
                    onClick={() => handlePhaseClick('packing')}
                >
                    Packing Phase
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
                    {/* {activePhase === 'assembly' && (
                        <>
                            <div className="machineOne">
                                <div className="machineHead">
                                    <h4>Machine One</h4>
                                </div>
                                <div className="machineBody">
                                    <table {...assemblyTableInstanceMachineOne.getTableProps()}>
                                        <thead>
                                            {assemblyTableInstanceMachineOne.headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...assemblyTableInstanceMachineOne.getTableBodyProps()}>
                                            {assemblyTableInstanceMachineOne.rows.map(row => {
                                                assemblyTableInstanceMachineOne.prepareRow(row);
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
                            <div className="machineTwo">
                                <div className="machineHead">
                                    <h4>Machine Two</h4>
                                </div>
                                <div className="machineBody">
                                    <table {...assemblyTableInstanceMachineTwo.getTableProps()}>
                                        <thead>
                                            {assemblyTableInstanceMachineTwo.headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...assemblyTableInstanceMachineTwo.getTableBodyProps()}>
                                            {assemblyTableInstanceMachineTwo.rows.map(row => {
                                                assemblyTableInstanceMachineTwo.prepareRow(row);
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
                        </>
                    )}
                    {activePhase === 'packing' && (
                        <>
                            <div className="machineOne">
                                <div className="machineHead">
                                    <h4>Machine One</h4>
                                </div>
                                <div className="machineBody">
                                    <table {...packingTableInstanceMachineOne.getTableProps()}>
                                        <thead>
                                            {packingTableInstanceMachineOne.headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...packingTableInstanceMachineOne.getTableBodyProps()}>
                                            {packingTableInstanceMachineOne.rows.map(row => {
                                                packingTableInstanceMachineOne.prepareRow(row);
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
                            <div className="machineTwo">
                                <div className="machineHead">
                                    <h4>Machine Two</h4>
                                </div>
                                <div className="machineBody">
                                    <table {...packingTableInstanceMachineTwo.getTableProps()}>
                                        <thead>
                                            {packingTableInstanceMachineTwo.headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...packingTableInstanceMachineTwo.getTableBodyProps()}>
                                            {packingTableInstanceMachineTwo.rows.map(row => {
                                                packingTableInstanceMachineTwo.prepareRow(row);
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
                        </>
                    )} */}
                </div>
            </div>
        </div>
    );
}

export default AllproductionMain;
