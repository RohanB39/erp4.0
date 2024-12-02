// import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fireDB, storage } from '../../firebase/FirebaseConfig';
import { collection, getDocs, getDoc, doc, setDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import InvoicePreview from './InvoicePreview';
import style from './dispachInvoice.module.css';


import { RiArrowGoBackFill } from "react-icons/ri";

function NewInvoice() {
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
    const [vatChecked, setVatChecked] = useState(false);
    const [vatValue, setVatValue] = useState('');
    const [isIgstChecked, setIsIgstChecked] = useState(false);
    const [isCgstChecked, setIsCgstChecked] = useState(false);
    const [isSgstChecked, setIsSgstChecked] = useState(false);
    const [cgstValue, setCgstValue] = useState('');
    const [sgstValue, setSgstValue] = useState('');
    const [igstValue, setIgstValue] = useState('');
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
        const vatAmount = vatChecked ? ((subTotal / 100) * parseFloat(vatValue || 0)).toFixed(2) : 0;
        const igstAmount = isIgstChecked ? (subTotal * 0.28).toFixed(2) : 0; // Calculate IGST based on subtotal
        const cgstAmount = isCgstChecked ? ((subTotal / 100) * parseFloat(cgstValue || 0)).toFixed(2) : 0; // Calculate CGST
        const sgstAmount = isSgstChecked ? ((subTotal / 100) * parseFloat(sgstValue || 0)).toFixed(2) : 0;
        // Calculate total, including all components
        const calculatedTotal = (subTotal
            - discountAmount
            + parseFloat(vatAmount)
            + parseFloat(igstAmount)
            + parseFloat(cgstAmount)
            + parseFloat(sgstAmount)
            - advanceValue
        ).toFixed(2);

        setTotal(calculatedTotal);
    }, [subTotal, discount, advance, vatChecked, vatValue, isIgstChecked, cgstValue, isCgstChecked, sgstValue, isSgstChecked]);

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
                const invoicesRef = collection(fireDB, 'Dispatch_Invoices');
                const invoiceSnapshot = await getDocs(invoicesRef);
                const invoiceList = invoiceSnapshot.docs.map(doc => doc.id);
                // Sorting the invoice numbers and getting the latest one
                if (invoiceList.length > 0) {
                    const latestInvoiceNo = invoiceList.sort().pop();
                    const newInvoiceNo = generateInvoiceNumber(latestInvoiceNo);
                    setInvoiceNo(newInvoiceNo);
                } else {
                    console.log("No invoices found, starting with INV-00001");
                    setInvoiceNo('INV-00001');
                }
            } catch (error) {
                console.error("Error fetching invoice numbers: ", error);
            }
        };

        fetchLatestInvoiceNo();
    }, []);

    const handleQuantityChange = (index, newQuantity) => {
        setItems(prevItems => {
            return prevItems.map((item, i) => {
                if (i === index) {
                    // Update the quantity and recalculate the amount
                    const updatedQuantity = Number(newQuantity);
                    const updatedAmount = updatedQuantity * item.rate;

                    return {
                        ...item,
                        quantity: updatedQuantity,
                        amount: updatedAmount,
                    };
                }
                return item;
            });
        });
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
                vatValue,
                cgstValue,
                sgstValue,
                igstValue,
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

    const handleVatChange = (e) => {
        setVatChecked(e.target.checked);
    };

    const handleVatValueChange = (e) => {
        setVatValue(e.target.value);
    };

    const handleIgstChange = (event) => {
        const checked = event.target.checked;
        setIsIgstChecked(checked);
        // The total will automatically update due to the effect above
    };


    const handleCgstChange = (event) => {
        setIsCgstChecked(event.target.checked);
    };

    const handleCgstInputChange = (event) => {
        setCgstValue(event.target.value);
    };

    const handleSgstChange = (event) => {
        setIsSgstChecked(event.target.checked);
    };

    const handleSgstInputChange = (event) => {
        setSgstValue(event.target.value);
    };

    return (
        <div className={style.invoiceContainer}>
            <div className={style.invoiceForm}>
                <div className={style.invoiceFormHeader}>
                    <Link to={'/Dispach'}><RiArrowGoBackFill className={style.returnIcon} /></Link>
                    <div>

                        <h3>New Invoice</h3>
                        <p>Create and manage your invoice details below</p>
                    </div>
                </div>
                <div className={style.invoiceFormBody}>


                    <label htmlFor="">Create Customer</label>

                    <select value={customerID} onChange={handleCustomerChange}>
                        <option value="">Select Customer</option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>




                    <label htmlFor="">Invoice No.</label>
                    <input
                        type="text"
                        placeholder="INV-00012"
                        value={invoiceNo}
                        onChange={(e) => setInvoiceNo(e.target.value)}
                    />


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



                    <label htmlFor="">Invoice Date</label>
                    <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />


                    <label htmlFor="">Terms</label>
                    <select value={terms} onChange={handleTermChange}>
                        <option value="">Select Terms</option>
                        <option value="term1">Term 1</option>
                        <option value="term2">Term 2</option>
                    </select>

                </div>
                <hr className='hr' />

                <div className={style.formBottomBody}>

                    <label htmlFor="">Due date</label>
                    <input className='smallInput' type="text" readOnly value={dueDate} />


                    <label htmlFor="">Salesperson</label>

                    <select value={salesperson} onChange={handleSalespersonChange}>
                        <option value="EMP1">EMP1</option>
                        <option value="EMP2">EMP2</option>
                    </select>


                </div>

                <div className={style.formBottomBody}>
                    <label htmlFor="">subject</label>
                    <input type="text" placeholder='Subject here' value={subject} onChange={(e) => setSubject(e.target.value)} />

                </div>


                <hr className='hr' />
                <div className={style.invoiceDataHeader}>
                    <h3>Item Table</h3>
                </div>
                <table className={style.invoiceItemTable}>
                    <thead className={style.invoiceItemTableHeader}>
                        <tr>
                            <th>Sr/No</th>
                            <th>Item Details</th>
                            <th>Item ID</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody className={style.invoiceItemTableBody}>
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
                <hr />
                <div className={style.invoiceDetails}>

                    <div className={style.invoiceDetailUpperSide}>

                        <div className={style.invoiceDetailsHeader}>
                            <h3>Sub Total</h3>
                            <p>{subTotal}</p>
                        </div>
                        <div className={style.tallyBody}>


                            <h3>Discount</h3>
                            <div>
                                <input type="text" placeholder='0%' value={discount} onChange={(e) => setDiscount(e.target.value)} />

                                <p>{(subTotal * (discount / 100)).toFixed(2)}</p>

                            </div>


                        </div>


                        <div className={style.checkboxes}>
                            <div>


                                <div className={style.checkboxGroup}>
                                    <input type="checkbox" id="vat" onChange={handleVatChange} />
                                    <label htmlFor="vat">VAT</label>
                                </div>
                                <div className={style.checkboxGroup}>
                                    <input type="checkbox" id="IGST" checked={isIgstChecked} onChange={handleIgstChange} />
                                    <label htmlFor="IGST">IGST (28%)</label>
                                </div>
                                <div className={style.checkboxGroup}>
                                    <input type="checkbox" id="CGST" checked={isCgstChecked} onChange={handleCgstChange} disabled={isIgstChecked} />
                                    <label htmlFor="CGST">CGST</label>
                                </div>
                                <div className={style.checkboxGroup}>
                                    <input type="checkbox" id="SGST" checked={isSgstChecked} onChange={handleSgstChange} disabled={isIgstChecked} />
                                    <label htmlFor="SGST">SGST</label>
                                </div>


                            </div>
                            <div className={style.checkedInput}>


                                {isSgstChecked && (
                                    <input type="number" placeholder=" SGST" value={sgstValue} onChange={handleSgstInputChange} className={style.checkedInput} />
                                )}
                                {isCgstChecked && (
                                    <input type="number" placeholder=" CGST " value={cgstValue} onChange={handleCgstInputChange} className={style.checkedInput} />
                                )}
                                {vatChecked && (
                                    <input type="number" placeholder=" VAT %" value={vatValue} onChange={handleVatValueChange}
                                        className={style.checkedInput}
                                    />
                                )}
                            </div>
                        </div>
                        <div className={style.advance}>

                            <label htmlFor="advance">Advance Given</label>
                            <div>

                                <input type="text" placeholder='5000Rs' value={advance} onChange={(e) => setAdvance(e.target.value)} />

                                <p>{(total - advance)}</p>
                            </div>
                        </div>

                        <div className={style.invoiceTotal}>
                            <h4>Total (Rs)</h4>
                            <p>{total}</p>
                        </div>
                    </div >

                    <div className={style.invoiceBottomInfo}>
                        <div>
                            <h4>Terms & Conditions</h4>
                            <textarea value={termsAndConditions} onChange={(e) => setTermsAndConditions(e.target.value)}></textarea>
                        </div>
                        <div>
                            <h4>Attach file to invoice</h4>
                            <input type="file" onChange={handleFileChange} />
                        </div>
                    </div>
                </div >
                <div className={style.invoiceBtns}>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div >
            <InvoicePreview
                customer={customer}
                invoiceNo={invoiceNo}
                orderNo={orderNo}
                invoiceDate={invoiceDate}
                dueDate={dueDate}
                salesperson={salesperson}
                subject={subject}
                items={items}
                discount={discount}
                vatChecked={vatChecked}
                vatValue={vatValue}
                isIgstChecked={isIgstChecked}
                igstValue={igstValue}
                isCgstChecked={isCgstChecked}
                cgstValue={cgstValue}
                isSgstChecked={isSgstChecked}
                sgstValue={sgstValue}
                advance={advance}
                subTotal={subTotal}
                total={total}
                termsAndConditions={termsAndConditions}
                className={style.invoicePreview}
            />
        </div >
    );
}

export default NewInvoice;
