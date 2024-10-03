import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { fireDB } from '../../firebase/FirebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import './productionPhases.css';

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