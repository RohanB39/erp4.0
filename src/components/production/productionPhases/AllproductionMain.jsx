import React, { useState } from 'react';
import { useTable } from 'react-table';
import './productionPhases.css';

// Define columns and data for each phase
const productionColumns = [
    { Header: 'Sr No', accessor: 'srNo' },
    { Header: 'Machine Name', accessor: 'machineName' },
    { Header: 'Machine Type', accessor: 'machineType' },
    { Header: 'Cycle', accessor: 'cycle' },
    { Header: 'Machine Time', accessor: 'machineTime' },
    { Header: 'Raw Material', accessor: 'rawMaterial' },
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

// Example data for each phase
const productionData = [
    { srNo: 1, machineName: 'Machine A', machineType: 'Type 1', cycle: 'Cycle A', machineTime: 'Time A', rawMaterial: 'Material A' },
    { srNo: 2, machineName: 'Machine B', machineType: 'Type 2', cycle: 'Cycle B', machineTime: 'Time B', rawMaterial: 'Material B' },
];

const assemblyDataMachineOne = [
    { machineName: 'Machine X1', machineProcess: 'Process X1', machineCycleTime: 'Cycle Time X1' },
    { machineName: 'Machine X2', machineProcess: 'Process X2', machineCycleTime: 'Cycle Time X2' },
];

const assemblyDataMachineTwo = [
    { machineName: 'Machine Y1', machineProcess: 'Process Y1', machineCycleTime: 'Cycle Time Y1' },
    { machineName: 'Machine Y2', machineProcess: 'Process Y2', machineCycleTime: 'Cycle Time Y2' },
];

const packingDataMachineOne = [
    { srNo: 1, machineName: 'Machine X1', packingProcess: 'Wrapping' },
    { srNo: 2, machineName: 'Machine X2', packingProcess: 'Boxing' },
];

const packingDataMachineTwo = [
    { srNo: 1, machineName: 'Machine Y1', packingProcess: 'Other' },
    { srNo: 2, machineName: 'Machine Y2', packingProcess: 'Wrapping' },
];

function AllproductionMain() {
    const [activePhase, setActivePhase] = useState('production');

    const handlePhaseClick = (phase) => {
        setActivePhase(phase);
    };

    // Create table instances using React Table
    const productionTableInstance = useTable({ columns: productionColumns, data: productionData });
    const assemblyTableInstanceMachineOne = useTable({ columns: assemblyColumns, data: assemblyDataMachineOne });
    const assemblyTableInstanceMachineTwo = useTable({ columns: assemblyColumns, data: assemblyDataMachineTwo });
    const packingTableInstanceMachineOne = useTable({ columns: packingColumns, data: packingDataMachineOne, updateData: () => { } });
    const packingTableInstanceMachineTwo = useTable({ columns: packingColumns, data: packingDataMachineTwo, updateData: () => { } });

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
                    <h3>{activePhase.charAt(0).toUpperCase() + activePhase.slice(1)} Process</h3>
                </div>
                <div className="phaseMachines">
                    {activePhase === 'production' && (
                        <>
                            <div className="machineOne">
                                <div className="machineHead">
                                    <h4>Machine One</h4>
                                </div>
                                <div className="machineBody">
                                    <table {...productionTableInstance.getTableProps()}>
                                        <thead>
                                            {productionTableInstance.headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...productionTableInstance.getTableBodyProps()}>
                                            {productionTableInstance.rows.map(row => {
                                                productionTableInstance.prepareRow(row);
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
                                    <table {...productionTableInstance.getTableProps()}>
                                        <thead>
                                            {productionTableInstance.headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...productionTableInstance.getTableBodyProps()}>
                                            {productionTableInstance.rows.map(row => {
                                                productionTableInstance.prepareRow(row);
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
                    {activePhase === 'assembly' && (
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
                    )}
                </div>
            </div>
        </div>
    );7
}

export default AllproductionMain;
