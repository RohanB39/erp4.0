import React, { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import 'jspdf-autotable'; // Table Sathi
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom';

const RawMaterialTable = () => {
    const [purchaseStock, setPurchaseStock] = useState([]);
    const navigate = useNavigate();
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [hold, setHold] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const materialsRef = collection(fireDB, 'Items');
            try {
                const allItemsSnapshot = await getDocs(materialsRef);
                setTotalItemsCount(allItemsSnapshot.size); // Store total count

                const q = query(
                    materialsRef,
                    where('status', 'in', ['Hold', 'Rejected'])
                );

                const holdItems = await getDocs(q);
                setHold(holdItems.size);

                const purchaseQuery = query(
                    materialsRef,
                    where('materialLocation', '!=', null) // Show only items with materialLocation assigned
                );
                const purchaseSnapshot = await getDocs(purchaseQuery);
                const purchaseMaterial = purchaseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPurchaseStock(purchaseMaterial); // Setting data for the table
                setFilteredData(purchaseMaterial);
                const total = purchaseMaterial.reduce((acc, material) => {
                    const amount = parseFloat(material.GrnInvoicePrice);
                    return acc + (isNaN(amount) ? 0 : amount); // Only add if it's a valid number
                }, 0);

                setTotalAmount(total);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter based on vendorName or materialName
        const filtered = purchaseStock.filter(item => {
            const vendorName = item.vendorName?.toLowerCase() || "";
            const materialName = item.materialName?.toLowerCase() || "";
            return vendorName.includes(query) || materialName.includes(query);
        });

        setFilteredData(filtered);
    };

    // Define columns for the table
    const purchasecolumns = useMemo(
        () => [
            { Header: 'Sr/No', Cell: ({ row }) => row.index + 1 },
            { Header: 'MID', accessor: 'materialId' },
            { Header: 'Name', accessor: 'materialName' },
            { Header: 'Invoice Details', accessor: 'vendorInvoice' },
            { Header: 'Vendor & Details', accessor: 'vendorName' },
            { Header: 'Amount', accessor: 'GrnInvoicePrice' },
        ],
        []
    );

    // Setup React Table hooks for pagination and rendering
    const {
        getTableProps: getPurchaseTableProps,
        getTableBodyProps: getPurchaseTableBodyProps,
        headerGroups: purchaseHeaderGroups,
        page: purchasePage,
        prepareRow: preparePurchaseRow,
        canPreviousPage: canPreviousWarehousePage,
        canNextPage: canNextPurchasePage,
        pageOptions: purchasePageOptions,
        pageCount: purchasePageCount,
        nextPage: nextpurchasePage,
        previousPage: previouspurchasePage,
        setPageSize: setPurchasePageSize,
        state: { pageIndex: purchasePageIndex, pageSize: purchasePageSize },
    } = useTable(
        {
            columns: purchasecolumns,
            data: filteredData,
            initialState: { pageIndex: 0 },
        },
        usePagination
    );

    return (
        <div className='main'>
            <div style={{
                display: 'flex',
            }}>
                <div style={{
                    padding: '20px',
                    margin: '20px 0px',
                    marginRight: '10px',
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#333',
                    width: '30%',
                }}>
                    Total Items Present : {totalItemsCount}
                </div>

                <div style={{
                    padding: '20px',
                    margin: '20px 0',
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#333',
                    width: '35%',
                }}>
                    Raw Material Expenses : {totalAmount.toFixed(2)} Rs
                </div>

                <div style={{
                    margin: '20px 10px',
                    width: '25%',
                }}>
                    <input
                        type='text'
                        placeholder='Search By Vendor & Material'
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{
                            width: '100%',
                            height: '70%',
                        }}
                    />
                </div>
            </div>
            <div className="process-item-list">
                <table {...getPurchaseTableProps()}>
                    <thead>
                        {purchaseHeaderGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getPurchaseTableBodyProps()}>
                        {purchasePage.map(row => {
                            preparePurchaseRow(row);
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
                <div className="pagination">
                    <button onClick={() => previouspurchasePage()} disabled={!canPreviousWarehousePage}>
                        {'<'}
                    </button>
                    <span>
                        Showing {purchasePageIndex + 1} of {purchasePageOptions.length}
                    </span>
                    <button onClick={() => nextpurchasePage()} disabled={!canNextPurchasePage}>
                        {'>'}
                    </button>
                </div>
                <div>
                    <select
                        value={purchasePageSize}
                        onChange={e => {
                            setPurchasePageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default RawMaterialTable;
