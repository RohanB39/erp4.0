import React, { useState, useEffect } from 'react';
import './dispachInvoice.css';

function DispachInvoice() {
    const [customer, setCustomer] = useState('');
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

    useEffect(() => {
        // Calculate Subtotal
        const calculatedSubTotal = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        setSubTotal(calculatedSubTotal.toFixed(2));
    }, [items]);

    useEffect(() => {
        // Calculate Total
        const discountValue = parseFloat(discount) || 0;
        const advanceValue = parseFloat(advance) || 0;
        const discountAmount = (subTotal * (discountValue / 100)).toFixed(2);
        const advanceAmount = (subTotal * (advanceValue / 100)).toFixed(2);
        const calculatedTotal = subTotal - discountAmount - advanceAmount;
        setTotal(calculatedTotal.toFixed(2));
    }, [subTotal, discount, advance]);

    const handleAddItem = () => {
        setItems([...items, { srNo: (items.length + 1).toString().padStart(3, '0'), details: '', quantity: '', rate: '', amount: '' }]);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newItems = items.slice();
        newItems[index][name] = value;

        // Update amount based on quantity and rate
        if (name === 'quantity' || name === 'rate') {
            const quantity = parseFloat(newItems[index].quantity) || 0;
            const rate = parseFloat(newItems[index].rate) || 0;
            newItems[index].amount = (quantity * rate).toFixed(2);
        }

        setItems(newItems);
    };

    const handleSave = () => {
        // Implement save functionality here
        console.log({
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
            advance,
            total,
            subTotal,
            termsAndConditions,
            file
        });
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
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
                            <option value="pk">pk</option>
                            <option value="kd">kd</option>
                        </select>
                        <button onClick={() => {/* Implement search functionality */ }}>search</button>
                    </div>
                </div>
                <div className="middle-section">
                    <div className="bottom-div">
                        <div className='innerDiv'>
                            <label htmlFor="">Invoice No.</label>
                            <input type="text" placeholder='INV-00012' value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
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
                            <select value={terms} onChange={(e) => setTerms(e.target.value)}>
                                <option value="term1">term1</option>
                                <option value="term2">term2</option>
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
                                <select value={salesperson} onChange={(e) => setSalesperson(e.target.value)}>
                                    <option value="first1">first1</option>
                                    <option value="second1">second1</option>
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
                                <p>0</p>
                            </div>
                            <div className='tally-outer-body'>
                                <div className='tally-inner-body advance'>
                                    <input type="text" placeholder='Advance Given' value={advance} onChange={(e) => setAdvance(e.target.value)} />
                                    <input type="text" placeholder='50%' value={advance} onChange={(e) => setAdvance(e.target.value)} />
                                </div>
                                <p>{(subTotal * (advance / 100)).toFixed(2)}</p>
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
