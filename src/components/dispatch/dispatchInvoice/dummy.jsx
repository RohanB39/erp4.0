import React, { useState, useEffect } from 'react';
import { fireDB, storage } from '../../firebase/FirebaseConfig';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './dispachInvoice.css';

function DispachInvoice() {
    const [customer, setCustomer] = useState('');
    const [customers, setCustomers] = useState([]);
    const [items, setItems] = useState([
        { srNo: '001', details: 'Item 1', quantity: '1.00', rate: '0.00', amount: '0.00' },
        { srNo: '002', details: 'Item 2', quantity: '1.00', rate: '0.00', amount: '0.00' }
    ]);

    useEffect(() => {
        const fetchCustomers = async () => {
            const customersCollection = collection(fireDB, 'customers');
            const customerDocs = await getDocs(customersCollection);
            const customerNames = customerDocs.docs.map(doc => doc.data().name);
            setCustomers(customerNames);
        };

        fetchCustomers();
    }, []);

    const handleCustomerChange = (e) => {
        const selectedCustomerID = e.target.value;
        const selectedCustomer = customers.find(c => c.id === selectedCustomerID);
        setCustomer(selectedCustomer ? selectedCustomer.name : '');
        setCustomerID(selectedCustomerID); 
        fetchCustomerOrders(selectedCustomerID);
    };

    const fetchCustomerOrders = async (selectedCustomerID) => {
        const ordersCollection = collection(fireDB, 'Customer_Purchase_Orders');
        const q = query(ordersCollection, where('customerID', '==', selectedCustomerID));
        const orderDocs = await getDocs(q);
        const orderData = orderDocs.docs.map(doc => doc.id);
        setOrders(orderData);
    };


    return (
        <div className="invoice-container main" id='main'>
            <div className="invoice-header">
                <h3>New Invoice</h3>
            </div>
            <div className="invoice-body">
                <div className="top-section">
                    <label htmlFor="">Create Customer</label>
                    <div>
                        <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
                            <option value="">Select Customer</option>
                            {customers.map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="middle-section">
                    <div className="bottom-div">
                        <div className='innerDiv'>
                            <label htmlFor="">Invoice No.</label>
                            <input
                                type="text"
                                placeholder='INV-00012'
                                value={invoiceNo}
                                readOnly
                            />
                        </div>
                        <div className='innerDiv'>
                            <label htmlFor="">Order No.</label>
                            <input type="tel" placeholder='12121' value={orderNo} onChange={(e) => setOrderNo(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="invoice-calci">
                <div className="invoice-calci-header">
                    <h3>Item Table</h3>
                    <button onClick={handleAddItem}>Add new Item</button>
                </div>
                <hr />
                <table>
                    <thead>
                        <tr>
                            <th>Sr/No</th>
                            <th>Item Details</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.srNo}>
                                <td>{item.srNo}</td>
                                <td>
                                    <input
                                        type="text"
                                        name="details"
                                        value={item.details}
                                        onChange={(e) => handleInputChange(index, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="quantity"
                                        value={item.quantity}
                                        onChange={(e) => handleInputChange(index, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="rate"
                                        value={item.rate}
                                        onChange={(e) => handleInputChange(index, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="amount"
                                        value={item.amount}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
}

export default DispachInvoice;
