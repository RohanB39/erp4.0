import React, { useState, useEffect } from 'react';
import { fireDB, collection, query, where, getDocs } from '../../firebase/FirebaseConfig'; // Import necessary Firestore methods

const Payables = () => {
  const [payablesData, setPayablesData] = useState([]);
  const fetchPayablesData = async () => {
    try {
      const q = query(collection(fireDB, "Purchase_Orders"), where("status", "==", "Stored"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        vendorId: doc.data().vendorId,
        invoice: doc.data().vendorInvoice,
        poDate: doc.data().poDate,
        GrnInvoicePrice: doc.data().GrnInvoicePrice,
        materialName: doc.data().materialName,
      }));
      setPayablesData(data);
    } catch (error) {
      console.error("Error fetching payables data:", error);
    }
  };
  useEffect(() => {
    fetchPayablesData();
  }, []);

  return (
    <div className="main" id='main'>
      <h2>Payables</h2>
      <table>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Material Name</th>
            <th>Vendor ID</th>
            <th>Vendor Invoice</th>
            <th>PO Date</th>
            <th>PO ID</th>
            <th>Amount Paid</th>
          </tr>
        </thead>
        <tbody>
          {payablesData.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.materialName}</td>
              <td>{item.vendorId}</td>
              <td>{item.invoice}</td>
              <td>{item.poDate}</td>
              <td>{item.id}</td>
              <td>{item.GrnInvoicePrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Payables;
