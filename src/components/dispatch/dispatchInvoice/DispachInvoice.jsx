import React, { useState, useEffect } from 'react';
import { fireDB, storage } from '../../firebase/FirebaseConfig';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './dispachInvoice.css';
// Dispatch_Invoices

function DispachInvoice() {
    const [customer, setCustomer] = useState('');
    const [customers, setCustomers] = useState([]);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [orderNo, setOrderNo] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [terms, setTerms] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [salesperson, setSalesperson] = useState('');
    const [subject, setSubject] = useState('');
    const [items, setItems] = useState([
        { srNo: '001', details: 'Item 1', quantity: '1.00', rate: '0.00', amount: '0.00' },
        { srNo: '002', details: 'Item 2', quantity: '1.00', rate: '0.00', amount: '0.00' }
    ]);
    const [discount, setDiscount] = useState('0');
    const [advance, setAdvance] = useState('0');
    const [subTotal, setSubTotal] = useState('0');
    const [total, setTotal] = useState('0');
    const [termsAndConditions, setTermsAndConditions] = useState('');
    const [file, setFile] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState('');


    useEffect(() => {
        const fetchCustomers = async () => {
            const customersCollection = collection(fireDB, 'customers');
            const customerDocs = await getDocs(customersCollection);
            const customerNames = customerDocs.docs.map(doc => doc.data().name);
            setCustomers(customerNames);
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


    const generateInvoiceNumber = () => {
        const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
        const formattedNumber = String(Date.now()).slice(-4); // Unique number
        return `INV-${randomChars}-${formattedNumber}`;
    };

    useEffect(() => {
        const newInvoiceNumber = generateInvoiceNumber();
        setInvoiceNo(newInvoiceNumber); // Set the generated invoice number
    }, []);


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
