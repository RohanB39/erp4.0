import React, { useState } from 'react';
import { fireDB, updateDoc, doc } from '../../firebase/FirebaseConfig';
import { setDoc } from 'firebase/firestore';

const PaymentUpdatePopup = ({ rowData, onClose }) => {
  const [paymentStatus, setPaymentStatus] = useState('');

  const handleSave = async () => {
    const invoiceId = rowData.invoiceNo;

    try {
      // 1. Add record to "Receivable_Ledger" collection with invoiceNo as the document ID
      const receivableLedgerRef = doc(fireDB, 'Receivable_Ledger', invoiceId);
      await setDoc(receivableLedgerRef, {
        invoiceNo: rowData.invoiceNo,
        customer: rowData.customer,
        dispatchDate: rowData.dispatchDetails?.dispatchDate,
        amount: rowData.total,
        timeOfDispatch: rowData.dispatchDetails?.dispatchTime,
        dispatchVehicle: rowData.dispatchDetails?.dispatchVehicle,
        receiptNumber: rowData.dispatchDetails?.receiptNumber,
        paymentStatus: paymentStatus,
        receivableLedgerstatus : 'Payment Done',
      });

      // 2. Update the invStatus field in the "Dispatch_Invoices" collection
      const dispatchInvoiceRef = doc(fireDB, 'Dispatch_Invoices', invoiceId);
      await updateDoc(dispatchInvoiceRef, {
        invStatus: 'Payment successful',
      });
      alert('Payment status updated');
      onClose();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Update Payment Status</h2>
        <p><strong>Invoice No:</strong> {rowData.invoiceNo}</p>
        <p><strong>Customer:</strong> {rowData.customer}</p>
        <p><strong>Date of Dispatch:</strong> {rowData.dispatchDetails?.dispatchDate}</p>
        <p><strong>Amount:</strong> {rowData.total}</p>

        {/* Dropdown for Payment Status */}
        <div>
          <label htmlFor="paymentStatus">Payment Status:</label>
          <select
            id="paymentStatus"
            className="custom-dropdown"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="" disabled>Select Payment Status</option>
            <option value="cash">Cash</option>
            <option value="onlineBanking">Online Banking</option>
            <option value="upi">UPI</option>
            <option value="debitCard">Debit Card</option>
            <option value="creditCard">Credit Card</option>
          </select>
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PaymentUpdatePopup;
