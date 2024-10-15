import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fireDB, storage } from '../../firebase/FirebaseConfig';
import { collection, getDocs, getDoc, doc, setDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './dispachInvoice.css';

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
    const [customerID, setCustomerID] = useState('');
    const navigate = useNavigate();
    const [tdsChecked, setTdsChecked] = useState(false);
    const [vatChecked, setVatChecked] = useState(false);
    const [tdsValue, setTdsValue] = useState('');
    const [vatValue, setVatValue] = useState('');

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
        const tdsAmount = tdsChecked ? (subTotal * (parseFloat(tdsValue) / 100)).toFixed(2) : 0;
        const vatAmount = vatChecked ? (subTotal * (parseFloat(vatValue) / 100)).toFixed(2) : 0;
        const calculatedTotal = subTotal - discountAmount + parseFloat(vatAmount) + parseFloat(tdsAmount) - advanceValue;
        setTotal(calculatedTotal.toFixed(2));
    }, [subTotal, discount, advance, tdsChecked, vatChecked, tdsValue, vatValue]);

    const fetchOrderItems = async (selectedOrderID) => {
        const orderDocRef = doc(fireDB, 'Customer_Purchase_Orders', selectedOrderID);
        const orderDoc = await getDoc(orderDocRef);

        if (orderDoc.exists()) {
            const orderData = orderDoc.data();
            const itemDetails = [{
                details: orderData.finishedGood,
                quantity: orderData.quantity,
                rate: orderData.price,
                amount: orderData.grandTotal,
                id: orderDocRef.id,
                fgID: orderData.finishedGoodId,
            }];
            setItems(itemDetails);
        } else {
            console.log("No matching documents found");
            setItems([]);
        }
    };

    const handleOrderChange = (e) => {
        const selectedOrderID = e.target.value;
        setOrderNo(selectedOrderID);
        fetchOrderItems(selectedOrderID);
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
        const q = query(
            ordersCollection,
            where('customerID', '==', selectedCustomerID),
            where('status', '==', 'Open')
        );
        const orderDocs = await getDocs(q);
        const orderData = orderDocs.docs.map(doc => doc.id);
        setOrders(orderData);
    };

    const generateInvoiceNumber = (currentInvoiceNo) => {
        const numericPart = parseInt(currentInvoiceNo.replace('INV-', ''), 10);
        const nextNumber = numericPart + 1;
        const paddedNumber = String(nextNumber).padStart(5, '0');
        return `INV-${paddedNumber}`;
    };

    useEffect(() => {
        const fetchLatestInvoiceNo = async () => {
            try {
                // Fetching the invoices collection
                const invoicesRef = collection(fireDB, 'Dispatch_Invoices'); // Your Firestore collection name
                const invoiceSnapshot = await getDocs(invoicesRef);
                const invoiceList = invoiceSnapshot.docs.map(doc => doc.id); // Assuming doc.id is the invoice number

                console.log("Fetched Invoice IDs:", invoiceList); // Debugging: Check if the invoice IDs are being fetched

                // Sorting the invoice numbers and getting the latest one
                if (invoiceList.length > 0) {
                    const latestInvoiceNo = invoiceList.sort().pop(); // Sorts and picks the last one
                    console.log("Latest Invoice Number:", latestInvoiceNo); // Debugging: Check the latest invoice number

                    const newInvoiceNo = generateInvoiceNumber(latestInvoiceNo);
                    console.log("Generated New Invoice Number:", newInvoiceNo); // Debugging: Check the generated invoice number
                    setInvoiceNo(newInvoiceNo); // Setting the new invoice number
                } else {
                    // If no invoices are found, start with "INV-00001"
                    console.log("No invoices found, starting with INV-00001"); // Debugging: Case when no invoices exist
                    setInvoiceNo('INV-00001');
                }
            } catch (error) {
                console.error("Error fetching invoice numbers: ", error);
            }
        };

        fetchLatestInvoiceNo(); // Call the function to fetch and set the new invoice number
    }, []);

    const handleQuantityChange = async (index, newQuantity) => {
        const updatedItems = [...items];
        const id = updatedItems[index].id;

        try {
            const orderDocRef = doc(fireDB, 'Customer_Purchase_Orders', id);
            const orderDoc = await getDoc(orderDocRef);

            if (orderDoc.exists()) {
                const grandTotal = orderDoc.data().grandTotal;
                const originalQty = orderDoc.data().quantity;
                const initialAmount = grandTotal / originalQty;
                const newAmount = initialAmount * newQuantity;
                updatedItems[index].amount = newAmount;
                const approvedQuantities = items.map(item => item.quantity);
                console.log(approvedQuantities);
            } else {
                console.log("No matching document found for ID:", id);
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }
        updatedItems[index].quantity = newQuantity;
        setItems(updatedItems);
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
                FGItem: items.map(item => ({
                    FGName: item.details,
                    FGID: item.fgID,
                    approvedQty: item.quantity,
                    rate: item.rate,
                    amount: item.amount,
                })),
                discount,
                tdsValue,
                vatValue,
                advance: advance || '0',
                total,
                subTotal,
                termsAndConditions,
                file: null,
                invStatus: 'Active',
            };

            if (file) {
                const storageRef = ref(storage, `invoices/${file.name}`);
                await uploadBytes(storageRef, file);
                const fileURL = await getDownloadURL(storageRef);
                invoiceData.file = fileURL;
            }

            const dispatchInvoicesDocRef = doc(fireDB, 'Dispatch_Invoices', invoiceNo);
            await setDoc(dispatchInvoicesDocRef, invoiceData);
            alert('Invoice saved successfully');

            const orderDocRef = doc(fireDB, 'Customer_Purchase_Orders', orderNo);
            await setDoc(orderDocRef, { status: 'Closed' }, { merge: true });
            alert('Order status updated to Closed');

        } catch (error) {
            console.error('Error saving invoice:', error);
        }
    };

    const handleCancel = () => {
        navigate('/Dispach');
    };

    const handleTdsChange = (e) => {
        setTdsChecked(e.target.checked);
        setVatChecked(false); // Uncheck VAT and disable it when TDS is checked
    };

    const handleVatChange = (e) => {
        setVatChecked(e.target.checked);
        setTdsChecked(false); // Uncheck TDS and disable it when VAT is checked
    };

    const handleTdsValueChange = (e) => {
        setTdsValue(e.target.value);
    };

    const handleVatValueChange = (e) => {
        setVatValue(e.target.value);
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
                                placeholder="INV-00012"
                                value={invoiceNo}
                                onChange={(e) => setInvoiceNo(e.target.value)} 
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
                </div>
                <hr />
                <table>
                    <thead>
                        <tr>
                            <th>Sr/No</th>
                            <th>Item Details</th>
                            <th>Item ID</th>
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
                                <td>{item.fgID}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    />

                                </td>
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
                                            <input
                                                type="checkbox"
                                                checked={tdsChecked}
                                                onChange={handleTdsChange}
                                                disabled={vatChecked} // Disable TDS checkbox if VAT is checked
                                            />
                                            TDS
                                        </span>
                                        <span>
                                            <input
                                                type="checkbox"
                                                checked={vatChecked}
                                                onChange={handleVatChange}
                                                disabled={tdsChecked} // Disable VAT checkbox if TDS is checked
                                            />
                                            VAT
                                        </span>
                                    </div>
                                    {tdsChecked && (
                                        <input
                                            type="number"
                                            value={tdsValue}
                                            onChange={handleTdsValueChange}
                                            placeholder="Enter TDS value"
                                        />
                                    )}
                                    {vatChecked && (
                                        <input
                                            type="number"
                                            value={vatValue}
                                            onChange={handleVatValueChange}
                                            placeholder="Enter VAT value"
                                        />
                                    )}
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
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    );
}

export default DispachInvoice;
