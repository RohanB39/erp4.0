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
    const fgNames = invoice.FGItem ? invoice.FGItem.map(item => item.FGName).join(', ') : 'N/A';
    const fgID = invoice.FGItem ? invoice.FGItem.map(item => item.FGID).join(', ') : 'N/A';
    const approvedQuantity = invoice.FGItem ? invoice.FGItem.map(item => item.approvedQty).reduce((sum, qty) => sum + qty, 0) : 0;
  
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
        // Step 1: Check Production Orders for FG ID
        const productionOrdersRef = collection(fireDB, 'Production_Orders');
        const productionQuery = query(productionOrdersRef, where('selectedProductId', '==', fgID));
        const productionSnapshot = await getDocs(productionQuery);
    
        if (!productionSnapshot.empty) {
          let successFlag = false; // To trigger the alert only once
    
          productionSnapshot.forEach(async (docSnap) => {
            const productionData = docSnap.data();
            const currentQuantity = parseFloat(productionData.FGQuantity) || 0; // Ensure this is a number
    
            // Step 2: Check if approvedQuantity is greater than available quantity
            if (approvedQuantity > currentQuantity) {
              alert('Stock not available: Approved quantity exceeds available stock.');
              return; // Skip the update if stock is not available
            }
    
            // Step 3: If stock is available, calculate the updated quantity
            const updatedQuantity = currentQuantity - approvedQuantity;
            console.log('Updated Quantity:', updatedQuantity);
    
            // Step 4: Update the quantity in the production order
            let updatedFields = {
              FGQuantity: updatedQuantity,
              progressStatus: 'PO Close', // Default to "PO Close" unless remaining quantity is non-zero
            };
    
            // Step 5: Only update productionStatus to "PO Close" if the remaining quantity is 0
            if (updatedQuantity === 0) {
              updatedFields.productionStatus = 'PO Close';
            }
    
            // Step 6: Update the production order if stock is available
            await updateDoc(doc(fireDB, 'Production_Orders', docSnap.id), updatedFields);
    
            // Step 7: After updating the production order, update the dispatch invoice
            const invoiceRef = doc(fireDB, 'Dispatch_Invoices', invoice.invoiceNo);
            await updateDoc(invoiceRef, {
              dispatchDetails: updatedData,
              invStatus: 'Dispatched',
            });
    
            successFlag = true; // Mark the update as successful
          });
    
          // Step 8: Trigger the alert once, after all production orders are updated
          if (successFlag) {
            alert('Invoice and Production Order updated successfully!');
            onClose(); // Close the popup after saving
          }
        } else {
          console.log('No matching production order found for FG ID:', fgID);
        }
      } catch (error) {
        console.error('Error updating invoice or production order:', error);
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