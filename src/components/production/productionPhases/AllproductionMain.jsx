import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { fireDB } from '../../firebase/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './productionPhases.css';


const productionColumns = [
    { Header: 'Sr No', accessor: 'srNo' },
    { Header: 'Machine Name', accessor: 'machineName' },
    { Header: 'Production Order ID', accessor: 'poid' },
    { Header: 'FG ID', accessor: 'fgId' },
    { Header: 'Planned Qty', accessor: 'plannedQty' },
    { Header: 'Cycle', accessor: 'cycle' },
    { Header: 'Per Hr Qty', accessor: 'perHrQty' },
    { Header: 'Per Day Qty', accessor: 'perDayQty' },
];

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
    const [activePhase, setActivePhase] = useState('production');
    const [machineNames, setMachineNames] = useState([]);
    const [productionData, setProductionData] = useState([]);
    const [cycleInput, setCycleInput] = useState({});
    const [perHrQtyInput, setPerHrQtyInput] = useState({});
    const [perDayQtyInput, setPerDayQtyInput] = useState({});

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
        setInputValues((prevState) => ({
            ...prevState,
            [index]: {
                ...prevState[index],
                [field]: value,
            },
        }));
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
                            {activePhase === 'production' && (
                                <div className="phaseMachines">
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
                                                        {cell.column.id === 'cycle' ||
                                                        cell.column.id === 'perHrQty' ||
                                                        cell.column.id === 'perDayQty' ? (
                                                            <input
                                                                type="text"
                                                                value={cell.value}
                                                                onChange={(e) =>
                                                                    handleInputChange(i, cell.column.id, e.target.value)
                                                                }
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
                                </div>
                            )}
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
