import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { fireDB } from '../../firebase/FirebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import './productionPhases.css';

const assemblyColumns = [
    { Header: 'Machine Name', accessor: 'machineName' },
    { Header: 'Machine Process', accessor: 'machineProcess' },
    { Header: 'Machine Cycle Time', accessor: 'machineCycleTime' },
];

function AllproductionMain() {
    return (
        <div className="productionPhases">
            <div className="phases">
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
                </div>
            </div>
        </div>
    );
}

export default AllproductionMain;