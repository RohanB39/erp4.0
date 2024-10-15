import React, { useEffect, useState } from 'react';
import { collection, getDocs, getDoc, query, where, doc, updateDoc, setDoc } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig';
import './dispatchPopup.css';

const DispatchPopup = ({ product, onClose }) => {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [purchaseOrders, setPurchaseOrders] = useState([]); // To store Purchase Order IDs
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState('');


  // Fetch customer data and purchase orders
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const finishedGoodsRef = collection(fireDB, 'Finished_Goods');
        const finishedGoodsDoc = await getDocs(finishedGoodsRef);

        const matchedProduct = finishedGoodsDoc.docs.find(doc => doc.id === product.selectedProductId);

        if (matchedProduct) {
          const customerID = matchedProduct.data().customerID;
          setCustomerId(customerID);

          const customersQuery = query(
            collection(fireDB, 'customers'),
            where('uniqueID', '==', customerID)
          );

          const customerSnapshot = await getDocs(customersQuery);

          if (!customerSnapshot.empty) {
            const customerDoc = customerSnapshot.docs[0];
            setCustomerName(customerDoc.data().name);
          } else {
            setCustomerName('No customer found');
          }

          const purchaseOrdersQuery = query(
            collection(fireDB, 'Customer_Purchase_Orders'),
            where('customerID', '==', customerID),
            where('status', '==', 'Open')
          );

          const purchaseOrdersSnapshot = await getDocs(purchaseOrdersQuery);

          if (!purchaseOrdersSnapshot.empty) {
            const orders = purchaseOrdersSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setPurchaseOrders(orders); // Set purchase orders as an array
          } else {
            setPurchaseOrders([]); // Ensure it's set as an empty array if no orders are found
          }

          // Fetch invoices based on customerName
          const invoicesQuery = query(
            collection(fireDB, 'Dispatch_Invoices'),
            where('customer', '==', customerName),
            where('invStatus', '==', 'Active')
          );

          const invoicesSnapshot = await getDocs(invoicesQuery);

          if (!invoicesSnapshot.empty) {
            const invoiceList = invoicesSnapshot.docs.map(doc => ({
              id: doc.id,
              invoiceNo: doc.data().invoiceNo
            }));
            setInvoices(invoiceList); // Set invoices as an array
          } else {
            setInvoices([]); // Ensure it's set as an empty array if no invoices are found
          }
        } else {
          setCustomerId('Not Found');
          setCustomerName('No customer found');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [product.selectedProductId, customerName]);

  // Function to handle save button click
  const handleSave = async () => {
    try {
      const productionOrderId = product.selectedProductionId; // Production Order ID
      const productionOrdersRef = collection(fireDB, 'Production_Orders');
      const productionOrderDocRef = doc(fireDB, 'Production_Orders', productionOrderId);

      // Check if document with the Production Order ID exists
      const productionOrderDoc = await getDoc(productionOrderDocRef);

      
      const dispatchData = {
        productionOrderId: productionOrderId || '', // Default empty string if undefined
        productId: product.selectedProductId || '', // Default empty string if undefined
        machine: product.selectedMachine || '', // Default empty string if undefined
        quantity: product.quantity || 0, // Default to 0 if undefined
        packagingType: product.packagingType || '', // Default empty string if undefined
        dispatchType: product.dispatchOrInventory || '', // Default empty string if undefined
        customerId: customerId || '', // Default empty string if undefined
        customerName: customerName || '', // Default empty string if undefined
        invoiceNo: selectedInvoice || '', // Use the selected invoice number
      };

      // Check if the Production Order document exists
      if (productionOrderDoc.exists()) {
        // If the Production Order already exists, update the document with the new data
        const existingData = productionOrderDoc.data().dispatchData || []; // Get existing dispatchData or an empty array
        await updateDoc(productionOrderDocRef, {
          dispatchData: [...existingData, dispatchData],
          productionStatus: 'Production Completed',
          progressStatus: 'Ready To Dispatch',
          dispatchOrInventory: 'Dispatch',
        });
        alert('Data added to existing production order.');
      } else {
        // If the Production Order doesn't exist, create a new document
        await setDoc(productionOrderDocRef, {
          dispatchData: [dispatchData], // Create a new array for dispatch data
          productionStatus: 'Production Completed',
          progressStatus: 'Ready To Dispatch',
          dispatchOrInventory: 'Dispatch',
        });
        alert('New Production Order created.');
      }

      onClose(); // Close the popup after saving
    } catch (error) {
      console.error('Error saving data:', error);
      alert('An error occurred while saving data.');
    }
  };

  const handleInvoiceChange = (event) => {
    setSelectedInvoice(event.target.value);
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dispatch-popup">
      <div className="popup-content">
        <h2>Dispatch Popup</h2>
        <p><strong>Production Order ID:</strong> {product.selectedProductionId}</p>
        <p><strong>Product ID:</strong> {product.selectedProductId}</p>
        <p><strong>Machine:</strong> {product.selectedMachine}</p>
        <p><strong>Quantity:</strong> {product.quantity}</p>
        <p><strong>Packaging Type:</strong> {product.packagingType}</p>
        <p><strong>Dispatch Type:</strong> {product.dispatchOrInventory}</p>

        {/* Read-only Customer Input */}
        <div className="inp">
          <label>Customer ID:</label>
          <input
            type="text"
            value={customerId}
            readOnly
          />
        </div>

        <div className="inp">
          <label>Customer Name:</label>
          <input
            type="text"
            value={customerName}
            readOnly
          />
        </div>

        {/* Dropdown for Invoices */}
        <div className="inp">
          <label>Invoices:</label>
          <select value={selectedInvoice} onChange={handleInvoiceChange}>
            <option value="">Select Invoice</option>
            {invoices.length > 0 ? (
              invoices.map(invoice => (
                <option key={invoice.id} value={invoice.invoiceNo}>
                  {invoice.invoiceNo}
                </option>
              ))
            ) : (
              <option value="">No Active Invoices found</option>
            )}
          </select>
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DispatchPopup;
