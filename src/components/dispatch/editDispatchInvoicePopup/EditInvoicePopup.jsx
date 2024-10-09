import React, { useState } from 'react';

const EditInvoicePopup = ({ invoice, onClose }) => {
  if (!invoice) return null;

  // State for ASN, E-way bill numbers, dispatch details, receipt number, and dispatch vehicle
  const [asnNumber, setAsnNumber] = useState(invoice.asnNumber || ''); // Initialize with existing ASN number
  const [ewayBillNumber, setEwayBillNumber] = useState(invoice.ewayBillNumber || ''); // Initialize with existing E-way bill number
  const [dispatchDate, setDispatchDate] = useState(invoice.dispatchDate || ''); // Initialize with existing dispatch date
  const [dispatchTime, setDispatchTime] = useState(invoice.dispatchTime || ''); // Initialize with existing dispatch time
  const [receiptNumber, setReceiptNumber] = useState(invoice.receiptNumber || ''); // Initialize with existing receipt number
  const [dispatchVehicle, setDispatchVehicle] = useState(invoice.dispatchVehicle || ''); // Initialize with existing dispatch vehicle

  const handleSave = () => {
    // Implement your save logic here
    const updatedInvoice = {
      ...invoice,
      asnNumber,
      ewayBillNumber,
      dispatchDate,
      dispatchTime,
      receiptNumber, // Add receipt number to the updated invoice
      dispatchVehicle, // Add dispatch vehicle to the updated invoice
    };

    console.log("Updated Invoice:", updatedInvoice); // For debugging purposes
    // Call a function to save the updated invoice data to the database here

    onClose(); // Close the popup
  };

  return (
    <div className="popup">
      <h2>Edit Invoice</h2>
      <div>
        <p>Invoice Number: {invoice.invoiceNo}</p>
        {/* ASN Number Input */}
        <label>
          ASN Number:
          <input 
            type="text" 
            value={asnNumber} 
            onChange={(e) => setAsnNumber(e.target.value)} 
          />
        </label>
        <br />
        {/* E-way Bill Number Input */}
        <label>
          E-way Bill Number:
          <input 
            type="text" 
            value={ewayBillNumber} 
            onChange={(e) => setEwayBillNumber(e.target.value)} 
          />
        </label>
        <br />
        {/* Date of Dispatch Input */}
        <label>
          Date of Dispatch:
          <input 
            type="date" 
            value={dispatchDate} 
            onChange={(e) => setDispatchDate(e.target.value)} 
          />
        </label>
        <br />
        {/* Time of Dispatch Input */}
        <label>
          Time of Dispatch:
          <input 
            type="time" 
            value={dispatchTime} 
            onChange={(e) => setDispatchTime(e.target.value)} 
          />
        </label>
        <br />
        {/* Receipt Number Input */}
        <label>
          Receipt Number:
          <input 
            type="text" 
            value={receiptNumber} 
            onChange={(e) => setReceiptNumber(e.target.value)} 
          />
        </label>
        <br />
        {/* Dispatch Vehicle Input */}
        <label>
          Dispatch Vehicle:
          <input 
            type="text" 
            value={dispatchVehicle} 
            onChange={(e) => setDispatchVehicle(e.target.value)} 
          />
        </label>
      </div>
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default EditInvoicePopup;
