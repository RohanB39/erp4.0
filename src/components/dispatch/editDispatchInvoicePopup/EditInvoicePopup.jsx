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
          const invoiceRef = doc(fireDB, 'Dispatch_Invoices', invoice.invoiceNo);
          await updateDoc(invoiceRef, {
              dispatchDetails: updatedData,
              invStatus : 'Dispatched',
          });

          alert('Invoice updated successfully!');
          const finishedGoodsQuery = query(
              collection(fireDB, 'Finished_Goods'),
              where('FGname', '==', fgNames)
          );
          const finishedGoodsSnapshot = await getDocs(finishedGoodsQuery);

          if (!finishedGoodsSnapshot.empty) {
              const finishedGoodsDoc = finishedGoodsSnapshot.docs[0];
              const uniqueID = finishedGoodsDoc.data().uniqueID;
              const productionOrdersQuery = query(
                  collection(fireDB, 'Production_Orders'),
                  where('selectedProductId', '==', uniqueID)
              );
              const productionOrdersSnapshot = await getDocs(productionOrdersQuery);

              if (!productionOrdersSnapshot.empty) {
                  const productionOrderDoc = productionOrdersSnapshot.docs[0];
                  const productionOrderData = productionOrderDoc.data();
                  const productionQuantity = productionOrderData.quantity;
                  if (approvedQuantity < productionQuantity) {
                      const newQuantity = productionQuantity - approvedQuantity;
                      const productionOrderRef = doc(fireDB, 'Production_Orders', productionOrderDoc.id);
                      await updateDoc(productionOrderRef, {
                          quantity: newQuantity,
                      });

                      alert('Production Order quantity updated.');
                  } else {
                      alert('Approved quantity is not less than production quantity. No update needed.');
                  }
              } else {
                  alert('No matching Production Order found for the selected product ID.');
              }
          } else {
              alert('No matching Finished Goods found for the FGName.');
          }

          onClose();
      } catch (error) {
          console.error('Error updating invoice:', error);
      }
  };

  return (
      <div className="popup">
          <h2>Edit Invoice</h2>
          <div>
              <p>Invoice Number: {invoice.invoiceNo}</p>
              <p>FG Name: {fgNames}</p>
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

