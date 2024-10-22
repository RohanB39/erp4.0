import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from '../../firebase/FirebaseConfig';
import { fireDB } from '../../firebase/FirebaseConfig';

const Receivables = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const q = query(
          collection(fireDB, "Dispatch_Invoices"), 
          where("invStatus", "==", "Dispatched")
        );
        const querySnapshot = await getDocs(q);
        const invoicesData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const FGItems = data.FGItem || [];
          const invoiceInfo = {
            customer: data.customer,
            invoiceNo: data.invoiceNo,
            orderNo: data.orderNo,
            invoiceDate: data.invoiceDate,
            total: data.total,
            fgNames: FGItems.map(item => item.FGName),
          };
          invoicesData.push(invoiceInfo);
        });

        setInvoices(invoicesData);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className='main' id='main'>
      <h1>Receivables</h1>
      <table>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>FG Name</th>
            <th>Customer Name</th>
            <th>Invoice No</th>
            <th>Order No</th>
            <th>Invoice Date</th>
            <th>Amount Recived</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <ul>
                    {invoice.fgNames.map((name, i) => (
                      <li key={i}>{name}</li>
                    ))}
                  </ul>
                </td>
                <td>{invoice.customer}</td>
                <td>{invoice.invoiceNo}</td>
                <td>{invoice.orderNo}</td>
                <td>{invoice.invoiceDate}</td>
                <td>Rs. {invoice.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No dispatched invoices found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Receivables;
