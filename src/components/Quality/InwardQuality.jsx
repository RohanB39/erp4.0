import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { fireDB } from "../firebase/FirebaseConfig";
import './quality.css';

function InwardQuality() {
    const [data, setData] = useState([]);
    const [popupData, setPopupData] = useState(null);
    const [popupStatus, setPopupStatus] = useState('');

    // Fetch data from Firebase where status is "QC Pending"
    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(fireDB, "Items"), where("status", "==", "GRN Approved, QC Pending"));
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

    // Update Firestore document with the new status
    const updateItemStatus = async (id, newStatus) => {
        try {
            const itemRef = doc(fireDB, "Items", id);
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
        { Header: 'Batch Number', accessor: 'batchNumber' },
        { Header: 'Vendor Name', accessor: 'vendorName' },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => {
                const handleApproveClick = () => {
                    const updatedData = data.map((item, index) => {
                        if (index === row.index) {
                            if (item.status === 'GRN Approved, QC Pending') {
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
                            if (item.status === 'GRN Approved, QC Pending') {
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
                    <div>
                        <button onClick={handleApproveClick}>Approve</button>
                        <button onClick={handleRejectClick}>Reject</button>
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
        <div className='qualityTable'>
            <div className='tab-content'>
                <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>
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
    );
}

export default InwardQuality;
