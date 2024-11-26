import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { fireDB } from "../firebase/FirebaseConfig";


import style from './quality.module.css';


import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";

const ExistingMaterialInward = () => {
    const [data, setData] = useState([]);
    const [popupData, setPopupData] = useState(null);
    const [popupStatus, setPopupStatus] = useState('');

    // Fetch data from Firebase where status is "QC Pending"
    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(fireDB, "Purchase_Orders"), where("status", "==", "Inward"));
                const querySnapshot = await getDocs(q);
                const fetchedData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setData(fetchedData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const updateItemStatus = async (id, newStatus) => {
        try {
            const itemRef = doc(fireDB, "Purchase_Orders", id);
            await updateDoc(itemRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    const showApprovalPopup = (item, status) => {
        setPopupData(item);
        setPopupStatus(status);
    };

    const closePopup = () => {
        setPopupData(null);
        setPopupStatus('');
    };

    const columns = useMemo(() => [
        { Header: 'Item Name', accessor: 'materialName' },
        { Header: 'Quantity', accessor: 'quantityReceived' },
        { Header: 'Vendor Id', accessor: 'vendorId' },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => {
                const handleApproveClick = () => {
                    const updatedData = data.map((item, index) => {
                        if (index === row.index) {
                            if (item.status === 'Inward') {
                                item.status = 'QC Approved';
                                updateItemStatus(item.id, 'QC Approved');
                                showApprovalPopup(item, 'QC Approved');
                            }
                        }
                        return item;
                    });
                    setData(updatedData);
                };

                const handleRejectClick = () => {
                    const updatedData = data.map((item, index) => {
                        if (index === row.index) {
                            if (item.status === 'Inward') {
                                item.status = 'QC Rejected';
                                updateItemStatus(item.id, 'QC Rejected');
                                showApprovalPopup(item, 'QC Rejected');
                            }
                        }
                        return item;
                    });
                    setData(updatedData);
                };

                return (
                    <div className={style.materialBtn}>
                        <button onClick={handleApproveClick}><IoCheckmarkOutline className={style.icon} /></button>
                        <button onClick={handleRejectClick}><IoCloseOutline className={style.icon} /></button>
                    </div>
                );
            }
        }
    ], [data]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });
    return (
        <div className={style.qualityTable}>
            <div className={style.tabContent}>
                <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead className={style.qualityTableHeader} >
                        {headerGroups.map((headerGroup, headerGroupIndex) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${headerGroupIndex}`}>
                                {headerGroup.headers.map((column, columnIndex) => (
                                    <th {...column.getHeaderProps()} key={`column-${columnIndex}`}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()} className={style.qualityTableBody}>
                        {rows.map((row, rowIndex) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} key={`row-${rowIndex}`}>
                                    {row.cells.map((cell, cellIndex) => (
                                        <td {...cell.getCellProps()} key={`cell-${rowIndex}-${cellIndex}`}>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>

            {/* Popup component */}
            {popupData && (
                <div className="popup">
                    <span className="animated-tick">
                        {popupStatus === 'QC Approved' ? '✅' : '❌'}
                    </span>
                    <p>{popupStatus}</p>
                    <p><strong>Item ID:</strong> {popupData.id}</p>
                    <p><strong>Item Name:</strong> {popupData.materialName}</p>
                    <button className="close-button" onClick={closePopup}>X</button>
                </div>
            )}
        </div>
    )
}

export default ExistingMaterialInward