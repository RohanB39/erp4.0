import React, { useEffect, useState } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

import style from './sales.module.css';


import { PiCurrencyInr } from "react-icons/pi";

const SaleTable = () => {
    const [receivables, setReceivables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const receivablesCollection = collection(fireDB, 'Receivable_Ledger');
                const q = query(receivablesCollection, where('receivableLedgerstatus', '==', 'Payment Done'));
                const querySnapshot = await getDocs(q);

                const receivablesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setReceivables(receivablesData);
                const total = receivablesData.reduce((acc, receivable) => {
                    // Parse amount as a float and handle cases where amount might not be a number
                    const amount = parseFloat(receivable.amount);
                    return acc + (isNaN(amount) ? 0 : amount); // Only add if it's a valid number
                }, 0);

                setTotalAmount(total);
            } catch (error) {
                console.error("Error fetching receivables: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={style.Saleswrapper}>
            <div className={style.salesHeader}>
                <div className={style.title}>
                    <h2>Total Sales</h2>
                    <p>Overview of total sales data</p>

                </div>
                <div className={style.salesTotalCredit}>
                    <span><PiCurrencyInr className={style.icon} /> {totalAmount.toFixed(2)} </span>
                    Total Credit
                </div>
            </div>
            <table className={style.salesTable}>
                <thead className={style.salesTableHeader}>
                    <tr>
                        <th>SR/No</th>
                        <th>Invoice No</th>
                        <th>Customer</th>
                        <th>Dispatch Date</th>
                        <th>Dispatch Vehicle</th>
                        <th>Receipt Number</th>
                        <th>Time of Dispatch</th>
                        <th>Payment Mode</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody className={style.salesTableBody}>
                    {receivables.map((receivable, index) => (
                        <tr key={receivable.id}>
                            <td>{index + 1}</td>
                            <td>{receivable.invoiceNo}</td>
                            <td>{receivable.customer}</td>
                            <td>{receivable.dispatchDate}</td>
                            <td>{receivable.dispatchVehicle}</td>
                            <td>{receivable.receiptNumber}</td>
                            <td>{receivable.timeOfDispatch}</td>
                            <td>{receivable.paymentStatus}</td>
                            <td>{receivable.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SaleTable