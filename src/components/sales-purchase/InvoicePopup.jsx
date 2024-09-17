import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { fireDB } from '../FirebaseConfig'; 
import './invoicepopup.css';
import { IoCloseSharp } from "react-icons/io5";

function InvoicePopup({ isOpen, onClose }) {
  const [invoiceDetails, setInvoiceDetails] = useState('');
  const [status, setStatus] = useState('');
  const [vendorDetails, setVendorDetails] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare invoice data
    const newInvoice = {
      invoiceDetails,
      status,
      vendorDetails,
      amount,
    };

    try {
      // Add the new invoice to Firestore
      await addDoc(collection(fireDB, "invoices"), newInvoice);
      console.log("Invoice added successfully!");
      onClose(); // Close the popup after submission
    } catch (error) {
      console.error("Error adding invoice: ", error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className='invoice-header'>
          <h3>Add New Invoice</h3>
          <button type="button" onClick={onClose}><IoCloseSharp /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Invoice Details:</label>
            <input
              type="text"
              value={invoiceDetails}
              onChange={(e) => setInvoiceDetails(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Status:</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Vendor & Details:</label>
            <input
              type="text"
              value={vendorDetails}
              onChange={(e) => setVendorDetails(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Amount:</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default InvoicePopup;
