import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

const UpdateExistingPaymentPopup = ({ rowData, onClose }) => {
    const [paymentStatus, setPaymentStatus] = useState(rowData.paymentStatus || ''); 
    const handlePaymentStatusChange = (e) => {
        setPaymentStatus(e.target.value);
    };

    console.log("Hello");

    const handleSave = async () => {
        const documentRef = doc(fireDB, 'Payable_Ledger', rowData.vendorInvoice);
        try {
            await setDoc(documentRef, {
                materialId: rowData.materialId,
                materialName: rowData.materialName,
                vendorInvoice: rowData.vendorInvoice,
                GRNDate: rowData.GRNDate,
                GrnInvoicePrice: rowData.GrnInvoicePrice,
                quantityReceived: rowData.quantityReceived,
                unit: rowData.unit,
                paymentStatus,
                payableLedgerstatus: 'Payment Done',
            });
            console.log("Payment status saved successfully.");
        } catch (error) {
            console.error("Error saving payment status: ", error);
        }

        onClose();
    };

    return (
        <div>
            <div>
                <h2>Update Payment Status</h2>

                <p><strong>ID:</strong> {rowData.materialId}</p>
                <p><strong>Product Name:</strong> {rowData.materialName}</p>
                <p><strong>Vendor Invoice:</strong> {rowData.vendorInvoice}</p>
                <p><strong>Arrival Date:</strong> {rowData.GRNDate}</p>
                <p><strong>Amount:</strong> {rowData.GrnInvoicePrice}</p>
                <p><strong>Quantity:</strong> {rowData.quantityReceived} {rowData.unit}</p>
                
                <label>
                    <strong>Payment Status:</strong>
                    <select value={paymentStatus} onChange={handlePaymentStatusChange}>
                        <option value="">Select Payment Status</option>
                        <option value="Cash">Cash</option>
                        <option value="Online Banking">Online Banking</option>
                        <option value="UPI">UPI</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                    </select>
                </label>
                
                <div>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateExistingPaymentPopup;
