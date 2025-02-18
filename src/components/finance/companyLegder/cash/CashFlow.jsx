import React, { useEffect, useState } from 'react';
import { fireDB, query, where, collection, getDocs } from '../../../firebase/FirebaseConfig';
import style from './cash.module.css';

const CashFlow = () => {
    const [cashFlowData, setCashFlowData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5);
    const [totalAmount, setTotalAmount] = useState(0);

    const [cashPaidData, setCashPaidData] = useState([]);
    const [currentCashPaidPage, setCurrentCashPaidPage] = useState(1);
    const rowsPerCashPaidPage = 5;
    const [totalCashPaidAmount, setTotalCashPaidAmount] = useState(0);

    const [assetsData, setAssetsData] = useState([]);
    const [currentAssetsDataPage, setCurrentAssetsDataPage] = useState(1);
    const rowsPerAssetsDataPage = 5;
    const [totalAssetsDataAmount, setTotalAssetsDataAmount] = useState(0);

    useEffect(() => {
        // Fetching data from Firestore
        const fetchCashFlowData = async () => {
            try {
                const receivableLedgerRef = collection(fireDB, 'Receivable_Ledger');
                const q = query(
                    receivableLedgerRef,
                    where('receivableLedgerstatus', '==', 'Payment Done'),
                    where('paymentStatus', '==', 'cash')
                );
                const querySnapshot = await getDocs(q);
                const ledgerData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    customer: doc.data().customer,
                    invoiceNo: doc.data().invoiceNo,
                    dispatchDate: doc.data().dispatchDate,
                    amount: doc.data().amount,
                }));
                setCashFlowData(ledgerData);
                const total = ledgerData.reduce((acc, receivable) => {
                    // Parse amount as a float and handle cases where amount might not be a number
                    const amount = parseFloat(receivable.amount);
                    return acc + (isNaN(amount) ? 0 : amount); // Only add if it's a valid number
                }, 0);

                setTotalAmount(total);
            } catch (error) {
                console.error('Error fetching cash flow data: ', error);
            }
        };

        fetchCashFlowData();
    }, []);

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = cashFlowData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(cashFlowData.length / rowsPerPage);
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Fetch Cash Paid Data
    useEffect(() => {
        const fetchCashPaidData = async () => {
            try {
                const payableLedgerRef = collection(fireDB, 'Payable_Ledger');
                const q = query(
                    payableLedgerRef,
                    where('payableLedgerstatus', '==', 'Payment Done'),
                    where('paymentStatus', '==', 'Cash')
                );
                const querySnapshot = await getDocs(q);
                const ledgerData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    vendorInv: doc.data().vendorInvoice,
                    materialName: doc.data().materialName,
                    materialArrived: doc.data().GRNDate,
                    amount: parseFloat(doc.data().GrnInvoicePrice),
                }));
                setCashPaidData(ledgerData);
                const total = ledgerData.reduce((acc, payable) => acc + (payable.amount || 0), 0);
                setTotalCashPaidAmount(total);
            } catch (error) {
                console.error('Error fetching cash paid data: ', error);
            }
        };

        fetchCashPaidData();
    }, []);

    // Pagination logic for Cash Paid
    const indexOfLastPaidRow = currentCashPaidPage * rowsPerCashPaidPage;
    const indexOfFirstPaidRow = indexOfLastPaidRow - rowsPerCashPaidPage;
    const currentCashPaidRows = cashPaidData.slice(indexOfFirstPaidRow, indexOfLastPaidRow);
    const totalCashPaidPages = Math.ceil(cashPaidData.length / rowsPerCashPaidPage);

    const handleNextPaidPage = () => currentCashPaidPage < totalCashPaidPages && setCurrentCashPaidPage(currentCashPaidPage + 1);
    const handlePreviousPaidPage = () => currentCashPaidPage > 1 && setCurrentCashPaidPage(currentCashPaidPage - 1);


    useEffect(() => {
        const fetchassetsData = async () => {
            try {
                const payableLedgerRef = collection(fireDB, 'Machines');
                const q = query(
                    payableLedgerRef,
                    where('machineStatus', '==', 'Active'),
                    where('paymentStatus', '==', 'cash')
                );
                const querySnapshot = await getDocs(q);
                const ledgerData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    manifacturingCompany: doc.data().manifacturarname,
                    invoice: doc.data().vendorInvoice,
                    machinename: doc.data().machineName,
                    modelnumber: doc.data().modelNumber,
                    purchaseDate: doc.data().purchaseDate,
                    amount: parseFloat(doc.data().machinePrice),
                }));
                setAssetsData(ledgerData);
                const total = ledgerData.reduce((acc, payable) => acc + (payable.machinePrice || 0), 0);
                setTotalAssetsDataAmount(total);
            } catch (error) {
                console.error('Error fetching cash paid data: ', error);
            }
        };

        fetchassetsData();
    }, []);

    // Pagination logic for Assets
    const indexOfLastAssetsRow = currentAssetsDataPage * rowsPerAssetsDataPage;
    const indexOfFirstAssetsRow = indexOfLastAssetsRow - rowsPerAssetsDataPage;
    const currentAssetsRows = assetsData.slice(indexOfFirstAssetsRow, indexOfLastAssetsRow);
    const totalAssetsPages = Math.ceil(assetsData.length / rowsPerAssetsDataPage);

    const handleNextAssetPage = () => currentAssetsDataPage < totalAssetsPages && setCurrentAssetsDataPage(currentAssetsDataPage + 1);
    const handlePreviousAssetsPage = () => currentAssetsDataPage > 1 && setCurrentAssetsDataPage(currentAssetsDataPage - 1);


    return (
        <div className={style.Wrapper}>
            <div className={style.header}>

                <div className={style.title}>

                    <i className="ri-cash-line"></i>
                    <h4>Cash Received</h4>
                </div>
                <div className={style.cash}>
                    <div>
                        {totalAmount.toFixed(2)} RS
                    </div>

                    <span>  Total Cash Recived</span>

                </div>
            </div>
            <hr className='hr' />
            <table className={style.table}>
                <thead className={style.tableHeader}>
                    <tr>
                        <th>Customer</th>
                        <th>Invoice No</th>
                        <th>Dispatch Date</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody className={style.tableBody}>
                    {currentRows.length > 0 ? (
                        currentRows.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.customer}</td>
                                <td>{entry.invoiceNo}</td>
                                <td>{entry.dispatchDate}</td> {/* Displaying date directly */}
                                <td>{entry.amount}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination controls */}
            <div className={style.pagination}>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    {'<'}
                </button>
                <span> {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    {'>'}
                </button>
            </div>

            <hr />

            {/* Cash Paid Section */}
            <div className={style.header}>
                <div className={style.title}>

                    <i className="ri-cash-line"></i>

                    <h4>Cash Paid</h4>
                </div>
                <div className={style.cash}>
                    <div>
                        {totalCashPaidAmount.toFixed(2)} Rs
                    </div>
                    <span>  Total Cash Paid </span>

                </div>
            </div>
            <hr className='hr' />
            <table className={style.table}>
                <thead className={style.tableHeader}>
                    <tr>
                        <th>Vendor Invoice</th>
                        <th>Material Name</th>
                        <th>Material Arrived</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody className={style.tableBody}>
                    {currentCashPaidRows.length > 0 ? (
                        currentCashPaidRows.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.vendorInv}</td>
                                <td>{entry.materialName}</td>
                                <td>{entry.materialArrived}</td>
                                <td>{entry.amount}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className={style.pagination}>
                <button onClick={handlePreviousPaidPage} disabled={currentCashPaidPage === 1}>   {'<'}</button>
                <span> {currentCashPaidPage} of {totalCashPaidPages}</span>
                <button onClick={handleNextPaidPage} disabled={currentCashPaidPage === totalCashPaidPages}>   {'>'}</button>
            </div>

            <hr />

            {/* Cash Paid Section */}
            <div className={style.header}>
                <div className={style.title}>

                    <i className="ri-cash-line"></i>
                    <h4>Cash Paid On Assets</h4>

                </div>
                <div className={style.cash}>
                    <div>
                        {totalAssetsDataAmount.toFixed(2)} Rs
                    </div>
                    <span>   Total Cash Paid  </span>
                </div>
            </div>
            <hr className='hr' />
            <table className={style.table}>
                <thead className={style.tableHeader}>
                    <tr>
                        <th>Vendor Invoice</th>
                        <th>Manifacturing Company</th>
                        <th>Machine Name</th>
                        <th>Model Number</th>
                        <th>Purchase Date</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody className={style.tableBody}>
                    {currentAssetsRows.length > 0 ? (
                        currentAssetsRows.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.invoice}</td>
                                <td>{entry.manifacturingCompany}</td>
                                <td>{entry.machinename}</td>
                                <td>{entry.modelnumber}</td>
                                <td>{entry.purchaseDate}</td>
                                <td>{entry.amount}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className={style.pagination}>
                <button onClick={handlePreviousAssetsPage} disabled={currentAssetsDataPage === 1}>   {'<'}</button>
                <span>Page {currentAssetsDataPage} of {totalAssetsPages}</span>
                <button onClick={handleNextAssetPage} disabled={currentAssetsDataPage === totalAssetsPages}>  {'>'}</button>
            </div>
        </div>
    );
};

export default CashFlow;
