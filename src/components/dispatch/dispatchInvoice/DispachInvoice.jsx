import React, { useState, useEffect } from 'react';
import { fireDB, storage } from '../../firebase/FirebaseConfig';
import { collection, getDocs, getDoc, doc, setDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './dispachInvoice.css';
// Dispatch_Invoices

function DispachInvoice() {
    const [customer, setCustomer] = useState('');
    const [customers, setCustomers] = useState([]);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [orderNo, setOrderNo] = useState('');
    const [orders, setOrders] = useState([]);
    const [invoiceDate, setInvoiceDate] = useState('');
    const [terms, setTerms] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [salesperson, setSalesperson] = useState('');
    const [subject, setSubject] = useState('');
    const [items, setItems] = useState([]);
    const [discount, setDiscount] = useState('0');
    const [advance, setAdvance] = useState('0');
    const [subTotal, setSubTotal] = useState('0');
    const [total, setTotal] = useState('0');
    const [termsAndConditions, setTermsAndConditions] = useState('');
    const [file, setFile] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [customerID, setCustomerID] = useState('');


    useEffect(() => {
        const fetchCustomers = async () => {
            const customersCollection = collection(fireDB, 'customers');
            const customerDocs = await getDocs(customersCollection);
            const customerData = customerDocs.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name
            }));
            setCustomers(customerData);
        };

        fetchCustomers();
    }, []);

    useEffect(() => {
        const calculatedSubTotal = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        setSubTotal(calculatedSubTotal.toFixed(2));
    }, [items]);

    useEffect(() => {
        const discountValue = parseFloat(discount) || 0;
        const advanceValue = parseFloat(advance) || 0;
        const discountAmount = (subTotal * (discountValue / 100)).toFixed(2);
        const calculatedTotal = subTotal - discountAmount - advanceValue;
        setTotal(calculatedTotal.toFixed(2));
    }, [subTotal, discount, advance]);

    const fetchOrderItems = async (selectedOrderID) => {
        const orderDocRef = doc(fireDB, 'Customer_Purchase_Orders', selectedOrderID);
        const orderDoc = await getDoc(orderDocRef);
        
        if (orderDoc.exists()) {
            const finishedGoods = orderDoc.data().finishedGood; // Array of items in finishedGood field
            setItems(finishedGoods); // Populate the table with fetched items
        } else {
            console.log("No matching documents found");
            setItems([]);
        }
    };

    const handleOrderChange = (e) => {
        const selectedOrderID = e.target.value;
        setOrderNo(selectedOrderID);

        // Fetch finished goods for the selected order
        fetchOrderItems(selectedOrderID);
    };

    const handleAddItem = () => {
        setItems([...items, { srNo: (items.length + 1).toString().padStart(3, '0'), details: '', quantity: '', rate: '', amount: '' }]);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newItems = items.slice();
        newItems[index][name] = value;
        if (name === 'quantity' || name === 'rate') {
            const quantity = parseFloat(newItems[index].quantity) || 0;
            const rate = parseFloat(newItems[index].rate) || 0;
            newItems[index].amount = (quantity * rate).toFixed(2);
        }

        setItems(newItems);
    };

    const handleSave = async () => {
        try {
            const invoiceData = {
                customer,
                invoiceNo,
                orderNo,
                invoiceDate,
                terms,
                dueDate,
                salesperson,
                subject,
                items,
                discount,
                advance: advance || '0',
                total,
                subTotal,
                termsAndConditions,
                file: null,
            };

            if (file) {
                const storageRef = ref(storage, `invoices/${file.name}`);
                await uploadBytes(storageRef, file);
                const fileURL = await getDownloadURL(storageRef);
                invoiceData.file = fileURL;
            }

            const dispatchInvoicesDocRef = doc(fireDB, 'Dispatch_Invoices', invoiceNo);
            await setDoc(dispatchInvoicesDocRef, invoiceData);
            console.log('Invoice saved successfully:', invoiceData);
        } catch (error) {
            console.error('Error saving invoice:', error);
        }
    };

    const handleSalespersonChange = (e) => {
        console.log("Selected salesperson:", e.target.value);
        setSalesperson(e.target.value);
    };






    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };


    const termsData = [
        { value: 'term1', label: 'Term 1', rules: 'Term 1 rules' },
        { value: 'term2', label: 'Term 2', rules: 'Term 2 rules' },
    ];

    useEffect(() => {
        if (invoiceDate) {
            const invoiceDateObj = new Date(invoiceDate);
            const dueDateObj = new Date(invoiceDateObj);
            dueDateObj.setDate(invoiceDateObj.getDate() + 15);
            setDueDate(dueDateObj.toISOString().split('T')[0]);
        } else {
            setDueDate('');
        }
    }, [invoiceDate]);

    const termsMap = {
        term1: 'Term 1 rules go here.',
        term2: 'Term 2 rules go here.',
    };

    const handleTermChange = (e) => {
        const selectedTerm = e.target.value;
        setTerms(selectedTerm);
        setTermsAndConditions(termsMap[selectedTerm] || '');
    };

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

    const generateInvoiceNumber = (currentInvoiceNo) => {
        // Extract numeric part from the current invoice number
        const numericPart = parseInt(currentInvoiceNo.replace('INV-', ''), 10);
        // Increment the number
        const nextNumber = numericPart + 1;
        // Pad the number with leading zeros to maintain 5 digits
        const paddedNumber = String(nextNumber).padStart(5, '0');
        // Return the new invoice number with 'INV-' prefix
        return `INV-${paddedNumber}`;
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
                        <select value={customerID} onChange={handleCustomerChange}>
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
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
                            {/* Order No. dropdown populated with orders related to selected customer */}
                            <select value={orderNo} onChange={handleOrderChange}>
                                <option value="">Select Order No</option>
                                {orders.map((orderID) => (
                                    <option key={orderID} value={orderID}>
                                        {orderID}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='bottom-div'>
                        <div className='innerDiv'>
                            <label htmlFor="">Invoice Date</label>
                            <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                        </div>
                        <div className='innerDiv'>
                            <label htmlFor="">Terms</label>
                            <select value={terms} onChange={handleTermChange}>
                                <option value="">Select Terms</option>
                                <option value="term1">Term 1</option>
                                <option value="term2">Term 2</option>
                            </select>
                        </div>
                    </div>
                    <hr />
                    <div className="bottom-div">
                        <div className='innerDiv'>
                            <label htmlFor="">Due date</label>
                            <input className='smallInput' type="text" readOnly value={dueDate} />
                        </div>
                        <div className='innerDiv'>
                            <label htmlFor="">Salesperson</label>
                            <div>
                                <select value={salesperson} onChange={handleSalespersonChange}>
                                    <option value="EMP1">EMP1</option>
                                    <option value="EMP2">EMP2</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className='innerDiv'>
                        <label htmlFor="">subject</label>
                        <input type="text" placeholder='Subject here' value={subject} onChange={(e) => setSubject(e.target.value)} />
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
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.details}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.rate}</td>
                                    <td>{item.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>
            <div className="invoice-detail">
                <div className="left-side">
                    <div>
                        <h3>Terms & Conditions</h3>
                        <textarea value={termsAndConditions} onChange={(e) => setTermsAndConditions(e.target.value)}></textarea>
                    </div>
                    <div>
                        <h3>Attach file to invoice</h3>
                        <input type="file" onChange={handleFileChange} />
                    </div>
                </div>
                <div className="right-side">
                    <div className="invoice-tally">
                        <div className="tally-head">
                            <h3>Sub Total</h3>
                            <p>{subTotal}</p>
                        </div>
                        <div className="tally-body">
                            <div className='tally-outer-body'>
                                <div className='tally-inner-body'>
                                    <p>Discount</p>
                                    <input type="text" placeholder='0%' value={discount} onChange={(e) => setDiscount(e.target.value)} />
                                </div>
                                <p>{(subTotal * (discount / 100)).toFixed(2)}</p>
                            </div>
                            <div className='tally-outer-body'>
                                <div className='tally-inner-body'>
                                    <div className='check'>
                                        <span>
                                            <input type="checkbox" />
                                            TDS
                                        </span>
                                        <span>
                                            <input type="checkbox" />
                                            TCS
                                        </span>
                                    </div>
                                    <div>
                                        <select>
                                            <option value="old one">old one</option>
                                            <option value="new one">new one</option>
                                        </select>
                                    </div>
                                </div>

                            </div>
                            <div className='tally-outer-body'>
                                <div className='tally-inner-body advance'>
                                    <input type="text" placeholder='Advance Given' readOnly />
                                    <input type="text" placeholder='5000Rs' value={advance} onChange={(e) => setAdvance(e.target.value)} />
                                </div>
                                <p>{(total - advance)}</p>
                            </div>
                            <hr />
                            <div className="tally-footer">
                                <h3>Total (Rs)</h3>
                                <p>{total}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="data-save-btn">
                <button onClick={handleSave}>Save</button>
                <button>Cancel</button>
            </div>
        </div>
    );
}

export default DispachInvoice;
