import React, { useState, useEffect } from 'react';
import { fireDB, collection, query, where, getDocs } from '../../firebase/FirebaseConfig'; // Import necessary Firestore methods


import style from './payables.module.css';
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
    <div className={style.payablewrapper}>
      <div className={style.title}>
        <div>
          <i class="ri-bank-line"></i>
          <h4>Payables</h4>
        </div>
        <p>View and manage pending payments for all dispatched orders here. </p>


      </div>
      <hr className='hr' />
      <table className={style.payableTable}>
        <thead className={style.payableTableHeader}>
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
        <tbody className={style.payableTableBody}>
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
