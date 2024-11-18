import React, { useState } from 'react';
import { fireDB, collection, query, where, getDocs, doc, updateDoc } from '../../firebase/FirebaseConfig';

const EditDirectdispatchPopup = ({ invoice, onClose }) => {
  if (!invoice) return null;
  const [asnNumber, setAsnNumber] = useState(invoice.asnNumber || '');
  const [ewayBillNumber, setEwayBillNumber] = useState(invoice.ewayBillNumber || '');
  const [dispatchDate, setDispatchDate] = useState(invoice.dispatchDate || '');
  const [dispatchTime, setDispatchTime] = useState(invoice.dispatchTime || '');
  const [receiptNumber, setReceiptNumber] = useState(invoice.receiptNumber || '');
  const [dispatchVehicle, setDispatchVehicle] = useState(invoice.dispatchVehicle || '');
  const fgID = invoice.selectedProductId;
  const invoiceNumber = invoice.dispatchInvoiceNo;
  const productionOrderId = invoice.productionOrderId;

  const handleSave = async () => {
    const updatedData = {
      fgID,
      asnNumber,
      ewayBillNumber,
      dispatchDate,
      dispatchTime,
      receiptNumber,
      dispatchVehicle,
    };
  
    try {
      // Update Production_Orders collection
      const productionOrdersRef = collection(fireDB, 'Production_Orders');
      const productionOrderQuery = query(productionOrdersRef, where('__name__', '==', productionOrderId)); // __name__ refers to the document ID
      const productionOrderSnapshot = await getDocs(productionOrderQuery);
  
      if (!productionOrderSnapshot.empty) {
        const productionOrderDoc = productionOrderSnapshot.docs[0];
        const productionOrderDocRef = doc(fireDB, 'Production_Orders', productionOrderDoc.id);
  
        await updateDoc(productionOrderDocRef, {
          productionStatus: 'PO Close',
          progressStatus: 'PO Close',
        });
      }
  
      // Update Dispatch_Invoices collection
      const dispatchInvoicesRef = collection(fireDB, 'Dispatch_Invoices');
      const invoiceQuery = query(dispatchInvoicesRef, where('__name__', '==', invoiceNumber)); // __name__ refers to the document ID
      const invoiceSnapshot = await getDocs(invoiceQuery);
  
      if (!invoiceSnapshot.empty) {
        const invoiceDoc = invoiceSnapshot.docs[0];
        const invoiceDocRef = doc(fireDB, 'Dispatch_Invoices', invoiceDoc.id);
  
        await updateDoc(invoiceDocRef, {
          dispatchDetails: updatedData, // Save the updated data as an object
          invStatus: 'Dispatched', // Update the invStatus field
        });
      }
  
      alert('Dispatch details saved successfully!');
      onClose(); // Close the popup after saving
    } catch (error) {
      console.error('Error updating documents:', error);
      alert('An error occurred while saving dispatch details.');
    }
  };
  

  return (
    <div className="popup">
      <h2>Edit Dispatch Orders</h2>
      <div>
        <p>Invoice Number: {invoice.dispatchInvoiceNo}</p>
        <p>FG ID: {invoice.selectedProductId}</p>
        <p>Quantity: {invoice.quantity}</p>
        <label>
          ASN Number:
          <input
            type="text"
            value={asnNumber}
            onChange={(e) => setAsnNumber(e.target.value)}
          />
        </label>
        <br />
        <label>
          E-way Bill Number:
          <input
            type="text"
            value={ewayBillNumber}
            onChange={(e) => setEwayBillNumber(e.target.value)}
          />
        </label>
        <br />
        <label>
          Date of Dispatch:
          <input
            type="date"
            value={dispatchDate}
            onChange={(e) => setDispatchDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Time of Dispatch:
          <input
            type="time"
            value={dispatchTime}
            onChange={(e) => setDispatchTime(e.target.value)}
          />
        </label>
        <br />
        <label>
          Receipt Number:
          <input
            type="text"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
          />
        </label>
        <br />
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


export default EditDirectdispatchPopup