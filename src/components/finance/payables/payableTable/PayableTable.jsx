import React, { useEffect, useState } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PayableTable = () => {
  const [receivables, setReceivables] = useState([]);
    const [loading, setLoading] = useState(true);

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