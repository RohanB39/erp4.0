import React, { useEffect, useState } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';


import style from './payable.module.css';

import { PiCurrencyInr } from "react-icons/pi";


const PayableTable = () => {
    const [receivables, setReceivables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const receivablesCollection = collection(fireDB, 'Payable_Ledger');
                const q = query(receivablesCollection, where('payableLedgerstatus', '==', 'Payment Done'));
                const querySnapshot = await getDocs(q);

                const receivablesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setReceivables(receivablesData);
                const total = receivablesData.reduce((acc, receivable) => {
                    // Parse amount as a float and handle cases where amount might not be a number
                    const amount = parseFloat(receivable.GrnInvoicePrice);
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
        <div className={style.recivableWrapper} >
            <div className={style.Header}>
                <div className={style.title}>

                    <h2>Payable</h2>
                    <p>Lorem ipsum dolor sit amet consectetur.</p>

                </div>
                <div className={style.credits}>
                    <span><PiCurrencyInr className={style.icon} />{totalAmount.toFixed(2)}</span>
                    Total Debit
                </div>
            </div>
            <table className={style.table}>
                <thead className={style.tableHeader}>
                    <tr>
                        <th>SR/No</th>
                        <th>Vendor Invoice</th>
                        <th>Material Name</th>
                        <th>Material Id</th>
                        <th>Quantity</th>
                        <th>Date Of Arrival</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody className={style.tableBody}>
                    {receivables.map((receivable, index) => (
                        <tr key={receivable.id}>
                            <td>{index + 1}</td>
                            <td>{receivable.vendorInvoice}</td>
                            <td>{receivable.materialName}</td>
                            <td>{receivable.materialId}</td>
                            <td>{receivable.quantityReceived} {receivable.unit}</td>
                            <td>{receivable.GRNDate}</td>
                            <td>{receivable.GrnInvoicePrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    )
}

export default PayableTable