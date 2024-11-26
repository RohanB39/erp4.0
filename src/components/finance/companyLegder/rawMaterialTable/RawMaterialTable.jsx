import React, { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table'; // Added useSortBy for sorting
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom';

import style from './rawMaterial.module.css';

import { PiArchiveThin } from "react-icons/pi";
import { ImCogs } from "react-icons/im";
import { PiCurrencyInrThin } from "react-icons/pi";

const RawMaterialTable = () => {
    const [purchaseStock, setPurchaseStock] = useState([]);
    const navigate = useNavigate();
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [hold, setHold] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedRow, setExpandedRow] = useState(null);

    // Fetch data and calculate totals
    useEffect(() => {
        const fetchData = async () => {
            const materialsRef = collection(fireDB, 'Items');
            try {
                const allItemsSnapshot = await getDocs(materialsRef);
                setTotalItemsCount(allItemsSnapshot.size);

                const q = query(
                    materialsRef,
                    where('status', 'in', ['Hold', 'Rejected'])
                );
                const holdItems = await getDocs(q);
                setHold(holdItems.size);

                const purchaseQuery = query(
                    materialsRef,
                    where('materialLocation', '!=', null)
                );
                const purchaseSnapshot = await getDocs(purchaseQuery);
                const purchaseMaterial = purchaseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPurchaseStock(purchaseMaterial);
                setFilteredData(purchaseMaterial);
                const total = purchaseMaterial.reduce((acc, material) => {
                    const amount = parseFloat(material.GrnInvoicePrice);
                    return acc + (isNaN(amount) ? 0 : amount);
                }, 0);
                setTotalAmount(total);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    // Search functionality
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = purchaseStock.filter(item => {
            const vendorName = item.vendorName?.toLowerCase() || "";
            const materialName = item.materialName?.toLowerCase() || "";
            return vendorName.includes(query) || materialName.includes(query);
        });
        setFilteredData(filtered);
    };

    // Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { html: '#materialTable' }); // Capture table by ID
        doc.save('raw_materials.pdf');
    };

    // Define columns with sorting
    const purchasecolumns = useMemo(
        () => [
            { Header: 'Sr/No', Cell: ({ row }) => row.index + 1 },
            { Header: 'MID', accessor: 'materialId' },
            { Header: 'Name', accessor: 'materialName' },
            { Header: 'Invoice Details', accessor: 'vendorInvoice' },
            { Header: 'Vendor & Details', accessor: 'vendorName' },
            { Header: 'Amount', accessor: 'GrnInvoicePrice' },
            { Header: 'Status', accessor: 'status' }, // New status column
        ],
        []
    );

    // Setup React Table hooks
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns: purchasecolumns,
            data: filteredData,
            initialState: { pageIndex: 0 },
        },
        useSortBy, // Enables sorting
        usePagination
    );

    // Toggle row expansion
    const toggleRowExpansion = (rowId) => {
        setExpandedRow(rowId === expandedRow ? null : rowId);
    };


    return (
        <div className={style.rawMaterialWrapper}>
            {/* KPI Cards */}
            <div className={style.analyticsPanel}>
                <div className={style.kpiCard}>
                    <span>{totalItemsCount}</span>
                    <p>Total Items</p>
                </div>
                <div className={style.kpiCard}>
                    <span>{totalAmount.toFixed(2)}</span>
                    <p>Total Expense</p>
                </div>
            </div>

            {/* Export & Search Panel */}
            <div className={style.rawMaterialSearch}>
                <button onClick={exportToPDF}>Export to PDF</button>
                <input
                    type='text'
                    placeholder='Search By Vendor & Material'
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {/* Material Table */}
            <div className={style.processItemList}>
                <table {...getTableProps()} className={style.Table} id="materialTable">
                    <thead className={style.TableHeader}>
                        {headerGroups.map((headerGroup, headerGroupIndex) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${headerGroupIndex}`}>
                                {headerGroup.headers.map((column, columnIndex) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())} key={`column-${columnIndex}`}>
                                        {column.render('Header')}
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()} className={style.TableBody}>
                        {page.map((row, rowIndex) => {
                            prepareRow(row);
                            return (
                                <>
                                    <tr {...row.getRowProps()} key={`row-${rowIndex}`} onClick={() => toggleRowExpansion(row.id)} >
                                        {row.cells.map((cell, cellIndex) => (
                                            <td {...cell.getCellProps()} key={`cell-${rowIndex}-${cellIndex}`}>
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                    {expandedRow === row.id && (
                                        <tr>
                                            <td colSpan={6}>Expanded Details Here</td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className={style.Pagination}>
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button>
                    <span>{pageIndex + 1} of {pageOptions.length}</span>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button>
                </div>
            </div>
        </div>
    );
};

export default RawMaterialTable;
