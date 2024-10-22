import React, { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import 'jspdf-autotable'; // Table Sathi
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom';

const RawMaterialTable = () => {
    const [data, setData] = useState([]);
    const [purchaseStock, setPurchaseStock] = useState([]); // Corrected variable name
    const navigate = useNavigate();
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [hold, setHold] = useState(0);

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
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    // Define columns for the table
    const purchasecolumns = useMemo(
        () => [
            { Header: 'Sr/No', Cell: ({ row }) => row.index + 1 },
            { Header: 'MID', accessor: 'materialId' },
            { Header: 'Name', accessor: 'materialName' },
            { Header: 'Invoice Details', accessor: 'vendorInvoice' },
            { Header: 'Status', accessor: 'status' },
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
            data: purchaseStock, // Corrected data source
            initialState: { pageIndex: 0 },
        },
        usePagination
    );

    return (
        <div className='main'>
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
