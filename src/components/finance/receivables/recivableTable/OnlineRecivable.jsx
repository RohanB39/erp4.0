import React, { useEffect, useState } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const OnlineRecivable = () => {
    const [receivables, setReceivables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const receivablesCollection = collection(fireDB, 'Receivable_Ledger');
                // Create a query to filter based on paymentStatus
                const q = query(receivablesCollection, where('receivableLedgerstatus', '==', 'Payment Done'));
                const querySnapshot = await getDocs(q);

                // Filter the data to include only the specified payment statuses
                const receivablesData = querySnapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .filter((receivable) => 
                        ['onlineBanking', 'upi', 'debitCard', 'creditCard'].includes(receivable.paymentStatus)
                    );

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
        <div>
            <h2>Online Payment</h2>
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
                width: '30%',
            }}>
                Total Credit : {totalAmount.toFixed(2)} Rs
            </div>
            <table>
                <thead>
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
                <tbody>
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

export default OnlineRecivable;
