import React, { useState } from 'react';
import { fireDB, collection, query, where, getDocs, doc, updateDoc } from '../../firebase/FirebaseConfig';

const EditInvoicePopup = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const [asnNumber, setAsnNumber] = useState(invoice.asnNumber || '');
  const [ewayBillNumber, setEwayBillNumber] = useState(invoice.ewayBillNumber || '');
  const [dispatchDate, setDispatchDate] = useState(invoice.dispatchDate || '');
  const [dispatchTime, setDispatchTime] = useState(invoice.dispatchTime || '');
  const [receiptNumber, setReceiptNumber] = useState(invoice.receiptNumber || '');
  const [dispatchVehicle, setDispatchVehicle] = useState(invoice.dispatchVehicle || '');
  const fgNames = invoice.FGItem ? invoice.FGItem.map(item => item.FGName).join(', ') : 'N/A';
  const fgID = invoice.FGItem ? invoice.FGItem.map(item => item.FGID).join(', ') : 'N/A';
  const approvedQuantity = invoice.FGItem ? invoice.FGItem.map(item => Number(item.approvedQty)).reduce((sum, qty) => sum + qty, 0) : 0;

  const handleSave = async () => {
    const updatedData = {
      asnNumber,
      ewayBillNumber,
      dispatchDate,
      dispatchTime,
      receiptNumber,
      dispatchVehicle,
    };

    try {
      const productionOrdersRef = collection(fireDB, 'Production_Orders');
      const productionQuery = query(productionOrdersRef, where('selectedProductId', '==', fgID));
      const productionSnapshot = await getDocs(productionQuery);

      const dispatchInvoicesRef = collection(fireDB, 'Dispatch_Invoices');
      const dispatchQuery = query(dispatchInvoicesRef, where('invoiceNo', '==', invoice.invoiceNo));
      const dispatchSnapshot = await getDocs(dispatchQuery);

      if (!productionSnapshot.empty) {
        // Step 1: Sort the documents by FGQuantity in descending order
        const productionDocs = productionSnapshot.docs
          .map(docSnap => ({
            id: docSnap.id,
            data: docSnap.data(),
            FGQuantity: parseFloat(docSnap.data().FGQuantity) || 0
          }))
          .filter(doc => doc.data.productionStatus === "Packaging done, added to inventory")
          .sort((a, b) => b.FGQuantity - a.FGQuantity);
          console.log('Filtered and Sorted Production Docs:', productionDocs);


        const firstDoc = productionDocs[0];  // Get the first document (highest FGQuantity)
        const currentQuantity = firstDoc.FGQuantity;

        // Step 2: Check if approvedQuantity is greater than currentQuantity
        if (approvedQuantity > currentQuantity) {
          alert("Stock not available: Approved quantity exceeds available stock.");
          return; // Stop further execution
        }

        // Step 3: Calculate the updated quantity
        const updatedQuantity = currentQuantity - approvedQuantity;

        // Step 4: Prepare the fields for the update
        let updatedFields = {
          FGQuantity: updatedQuantity,
          progressStatus: 'PO Close',
        };

        // Step 5: Update productionStatus only if updatedQuantity is 0
        if (updatedQuantity === 0) {
          updatedFields.productionStatus = 'PO Close'; // Set PO Close if quantity is 0
        }

        // Step 6: Perform the update in Firestore
        await updateDoc(doc(fireDB, 'Production_Orders', firstDoc.id), updatedFields);
        alert(`Document ID: ${firstDoc.id} successfully updated with new qty: ${updatedQuantity}`);

        // step 7: Update invoice
        if (!dispatchSnapshot.empty) {
          const dispatchDoc = dispatchSnapshot.docs[0];

          // Prepare the updated fields
          const updatedFields = {
            dispatchDetails: updatedData,
            invStatus: "Dispatched",
          };

          // Step 8: Update the document in Dispatch_Invoices collection
          await updateDoc(doc(fireDB, 'Dispatch_Invoices', dispatchDoc.id), updatedFields);

          alert(`Invoice ${invoice.invoiceNo} has been dispatched successfully.`);
        } else {
          alert(`No matching invoice found with Invoice Number: ${invoice.invoiceNo}`);
        }
      } else {
        alert('No matching production order found for FG ID:', fgID);
      }
    } catch (error) {
      console.error('Error updating invoice or production order:', error);
    }
  };

  return (
    <div className="popup">
      <h2>Edit Invoice</h2>
      <div>
        <p>Invoice Number: {invoice.invoiceNo}</p>
        <p>FG Name: {fgNames}</p>
        <p>FG ID: {fgID}</p>
        <p>Quantity: {approvedQuantity}</p>
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

export default EditInvoicePopup;
