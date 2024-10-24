import React, { useEffect, useState } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
    <div>
            <h2>Payable</h2>
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
                color: 'red',
            }}>
                Total Debit : {totalAmount.toFixed(2)} Rs
            </div>
            <table>
                <thead>
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
                <tbody>
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