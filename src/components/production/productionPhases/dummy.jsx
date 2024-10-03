import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { fireDB } from '../../firebase/FirebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import './productionPhases.css';
import AssemblyPopup from './AssemblyPopup/AssemblyPopup';


function AllproductionMain() {
    const [machineNames, setMachineNames] = useState([]);
    const [productionData, setProductionData] = useState([]);
    const [cycleInput, setCycleInput] = useState({});
    const [perHrQtyInput, setPerHrQtyInput] = useState({});
    const [perDayQtyInput, setPerDayQtyInput] = useState({});
    const [activePhase, setActivePhase] = useState('production');
    const [inputValues, setInputValues] = useState({});
    const [machineData, setMachineData] = useState([]);
    const [assemblyData, setAssemblyData] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    
    const fetchAssemblyData = async () => {
        try {
            const q = query(
                collection(fireDB, 'Production_Orders'),
                where('progressStatus', '==', 'In Process Quality Approved'),
                where('productionStatus', '==', 'Production Phase 1 complete')
            );
            const querySnapshot = await getDocs(q);
            const assemblyOrders = querySnapshot.docs.map((doc, index) => {
                const data = doc.data();
                const approvalTimestamp = data.InProcessQualityApprovalDate;
                let approvalDate = 'N/A';
                if (approvalTimestamp && approvalTimestamp.toDate) {
                    const dateObj = approvalTimestamp.toDate();
                    approvalDate = dateObj.toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        timeZone: 'Asia/Kolkata'
                    });
                }

                return {
                    srNo: index + 1,
                    machineName: data.selectedMachine,
                    fgId: data.selectedProductId,
                    plannedQty: data.quantity,
                    poid: data.productionOrderId,
                    productionQuantity: data.productionQuantity,
                    approvalDate,
                };
            });
            setAssemblyData(assemblyOrders);
        } catch (error) {
            console.error('Error fetching assembly data: ', error);
        }
    };
    useEffect(() => {
        fetchAssemblyData();
    }, []);

    const assemblyColumns = [
        { Header: 'Sr/No', accessor: 'srNo' },
        { Header: 'Production Order ID', accessor: 'poid' },
        { Header: 'Machine Name', accessor: 'machineName' },
        { Header: 'FG ID', accessor: 'fgId' },
        { Header: 'Planned Quantity', accessor: 'plannedQty' },
        { Header: 'Production Quantity', accessor: 'productionQuantity' },
        { Header: 'Approval Date & Time', accessor: 'approvalDate' },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
                <button
                    onClick={() => handleAssemblyStart(row.original)}
                    className="start-button"
                >
                    Start
                </button>
            )
        }
    ];
    
    const handleAssemblyStart = (rowData) => {
        setSelectedRowData(rowData);
        setIsPopupOpen(true);
    };
    
    const closePopup = () => {
        setIsPopupOpen(false);
    };    

    const assemblyTableInstance = useTable({
        columns: assemblyColumns,
        data: assemblyData,
    });

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
                        <div className="machineBody">
                            <table {...assemblyTableInstance.getTableProps()}>
                                <thead>
                                    {assemblyTableInstance.headerGroups.map((headerGroup) => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...assemblyTableInstance.getTableBodyProps()}>
                                    {assemblyTableInstance.rows.map((row) => {
                                        assemblyTableInstance.prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()}>
                                                {row.cells.map((cell) => (
                                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
    );
}

export default AllproductionMain;
