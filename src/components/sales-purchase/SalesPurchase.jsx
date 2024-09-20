import React, { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import { MdOutlineFileDownload } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import './salesPurchase.css';
import InvoicePopup from './InvoicePopup';
import 'jspdf-autotable'; // Table Sathi
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fireDB } from '../FirebaseConfig';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import logo from '../../assets/Tectigon_logo.png';

function SalesPurchase() {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [data, setData] = useState([]);
    const [purchaseStock, setPurchaseStock] = useState([]);
    const navigate = useNavigate();

    const handleCreatePurchaseOrder = () => {
        navigate('/purchase-order');
    };

    // Fetch data from Items and Purchase_Orders collection and match materialId
    useEffect(() => {
        const fetchData = async () => {
            const materialsRef = collection(fireDB, 'Items');
            try {
                const purchaseQuery = query(
                    materialsRef, 
                    // where('status', '==', 'QC Approved'),
                    where('materialLocation', '!=', null) 
                );
                const purchaseSnapshot = await getDocs(purchaseQuery);
                const purchaseMaterial = purchaseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPurchaseStock(purchaseMaterial);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        return data.filter(item =>
            item.vendorInvoice && item.vendorInvoice.toLowerCase().includes(searchInput.toLowerCase())
        );
    }, [searchInput, data]);

    const purchasecolumns = useMemo(
        () => [
            { Header: 'Sr/No', Cell: ({ row }) => row.index + 1 },
            { Header: 'MID', accessor: 'materialId' },
            { Header: 'Name', accessor: 'materialName'},
            { Header: 'Invoice Details', accessor: 'vendorInvoice' },
            { Header: 'Status', accessor: 'status' },
            { Header: 'Vendor & Details', accessor: 'vendorName' },
            { Header: 'Amount', accessor: 'price' },
        ],
        []
    );

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.addImage(logo, 'PNG', 10, 10, 50, 20);
        doc.setFontSize(14);
        doc.text('Tectigon IT Solutions Pvt Ltd', 15, 35);
        doc.setFontSize(11);
        doc.text('Pune Maharashtra 411021', 20, 40);
        doc.text('The Kode, 6th Floor, Baner Pashan Link Road', 10, 45);
        const itemHeaders = ['#', 'Invoice Details', 'Status', 'Vendor', 'Amount'];
        const itemRows = filteredData.map((item, index) => [
            `${index + 1}`,
            `${item.vendorInvoice}`,
            `${item.status}`,
            `${item.vendorName}`,
            `${item.price}`
        ]);
        doc.autoTable({
            startY: 50,
            head: [itemHeaders],
            body: itemRows,
            theme: 'grid',
            styles: { halign: 'center' },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 80, halign: 'left' },
                2: { cellWidth: 20 },
                3: { cellWidth: 30 },
                4: { cellWidth: 30 }
            }
        });
    
        const finalY = doc.lastAutoTable.finalY;
        doc.setFontSize(12);
        doc.text('Bank Details:', 10, finalY + 40);
        doc.setFontSize(11);
        doc.text('Account Holder Name: Tectigon IT Solutions Pvt Ltd', 10, finalY + 45);
        doc.text('Account Number: 259890368180 IFSC INDB0000269', 10, finalY + 50);
        doc.text('Bank: IndusInd Bank', 10, finalY + 55);
        doc.text('Notes:', 10, finalY + 70);
        doc.setFontSize(10);
        doc.text('Thanks for your business.', 10, finalY + 75);
    
        doc.text('Terms & Conditions:', 10, finalY + 85);
        doc.text('Please do the payment within 14 days. After 14 days, 14% will be charged.', 10, finalY + 90);
        doc.setFontSize(12);
        doc.text('Tectigon IT Solutions Pvt Ltd', 140, finalY + 70);
        doc.text('Sangita Kulkarni', 140, finalY + 80);
        doc.text('Authorized Signature', 140, finalY + 85);
        doc.save('all_data.pdf');
    };

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
            data: purchaseStock,
            initialState: { pageIndex: 0 },
        },
        usePagination
    );

    return (
        <>
            <div className={`sales-purchase-container ${isPopupOpen ? 'blur' : ''}`}>
                <div className='main purchase-box' id='main'>
                    <div className="purchase-header">
                        <div className="purchase-title">
                            <h3>Purchase Invoice</h3>
                        </div>
                        <div className="purchase-process">
                            <button onClick={exportToPDF}> <MdOutlineFileDownload className='icon' />Export</button>
                            <button className='invoice' onClick={() => setPopupOpen(true)}> <IoAdd className='icon' />Add Invoice</button>
                            <button onClick={handleCreatePurchaseOrder}> <IoAdd className='icon' />Create Purchase Order</button>
                        </div>
                    </div>
                    <hr />
                    <div className="purchase-serch-filter">
                        <div className='purchase-tabs'>
                            <div
                                className={filterStatus === 'All' ? 'active' : ''}
                                onClick={() => setFilterStatus('All')}
                            >
                                <h3>All Purchase</h3>
                                <p className={filterStatus === 'Stores Rack1' ? 'active' : ''}>{data.length}</p>
                            </div>

                            <div
                                className={filterStatus === 'Approved' ? 'active' : ''}
                                onClick={() => setFilterStatus('Approved')}
                            >
                                <h3>Approved</h3>
                                <p>{data.filter(item => item.status === 'Approved').length}</p>
                            </div>
                            <div
                                className={filterStatus === 'Rejected' ? 'active' : ''}
                                onClick={() => setFilterStatus('Rejected')}
                            >
                                <h3>Rejected</h3>
                                <p>{data.filter(item => item.status === 'Rejected').length}</p>
                            </div>
                        </div>
                        <div className='serch'>
                            <input
                                type="text"
                                placeholder='Search by invoice'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
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
                            <button onClick={() => previousPage()} disabled={!canPreviousWarehousePage}>
                                {'<'}
                            </button>
                            <span>
                                Showing{' '}
                                {purchasePageIndex + 1} of {purchasePageOptions.length}
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
            </div>
            <InvoicePopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} />
        </>
    );
}

export default SalesPurchase;
