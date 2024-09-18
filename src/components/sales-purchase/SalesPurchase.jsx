import React, { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import { MdOutlineFileDownload } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import './salesPurchase.css';
import InvoicePopup from './InvoicePopup';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Table Sathi
import { collection, getDocs } from 'firebase/firestore';
import { fireDB } from '../FirebaseConfig';
import logo from '../../assets/Tectigon_logo.png';
import PurchaseOrderPopup from './PurchaseOrderPopup';

function SalesPurchase() {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [data, setData] = useState([]);
    const [isPurchaseOrderPopupOpen, setPurchaseOrderPopupOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(fireDB, "invoices"));
                const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(invoices);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        return data.filter(item =>
            item.invoiceDetails && item.invoiceDetails.toLowerCase().includes(searchInput.toLowerCase())
        );
    }, [searchInput, data]);

    const columns = useMemo(
        () => [
            { Header: 'Sr/no', accessor: 'id' },
            { Header: 'Invoice Details', accessor: 'invoiceDetails' },
            { Header: 'Status', accessor: 'status' },
            { Header: 'Vendor & Details', accessor: 'vendorDetails' },
            { Header: 'Amount', accessor: 'amount' },
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
            `${item.invoiceDetails}`,
            `${item.status}`,
            `${item.vendorDetails}`,
            `${item.amount}`
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
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: filteredData,
            initialState: { pageIndex: 0, pageSize: 10 },
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
                            <button className='invoice' onClick={() => setPurchaseOrderPopupOpen(true)}> <IoAdd className='icon' />Create Purchase Order</button> 
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
                                <p className={filterStatus === 'All' ? 'active' : ''}>{data.length}</p>
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
                        <table {...getTableProps()}>
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column, index) => (
                                            <th {...column.getHeaderProps()}>
                                                {index === 0 ? 'Sr/No' : column.render('Header')} 
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {page.map((row, rowIndex) => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                        {/* <td>{rowIndex + 1 + pageIndex * pageSize}</td> */}
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
                            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                                {'<'}
                            </button>
                            <span>
                                Showing{' '}
                                {pageIndex + 1} of {pageOptions.length}
                            </span>
                            <button onClick={() => nextPage()} disabled={!canNextPage}>
                                {'>'}
                            </button>
                            <div className="puchase-pagination"></div>
                        </div>
                    </div>
                </div>
            </div>
            <InvoicePopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} />
            <PurchaseOrderPopup isOpen={isPurchaseOrderPopupOpen} onClose={() => setPurchaseOrderPopupOpen(false)} />
        </>
    );
}

export default SalesPurchase;
