// InvoicePreview.js
import React from 'react';
import style from './InvoicePreview.module.css';

function InvoicePreview({
    customer,
    invoiceNo,
    orderNo,
    invoiceDate,
    dueDate,
    salesperson,
    subject,
    items,
    discount,
    vatChecked,
    vatValue,
    isIgstChecked,
    igstValue,
    isCgstChecked,
    cgstValue,
    isSgstChecked,
    sgstValue,
    advance,
    subTotal,
    total,
    termsAndConditions,
}) {
    return (
        <div className={style.invoicePreview}>
            <div className={style.logo}>
                <div>
                    <h4>IF</h4>
                </div>
                <div className={style.orderNo}>
                    <p> <span>{invoiceNo}</span></p>
                    <p> {orderNo}</p>
                </div>

            </div>
            <div className={style.previewHeader}>
                <div>
                    <div>

                        <p>Subject :<span>{subject}</span> </p>
                    </div>
                    <div className={style.end}>

                        <p>Date :<span>{invoiceDate}</span> </p>
                        <p>Due Date :<span>{dueDate}</span> </p>
                    </div>
                </div>
                <div>
                    <div>
                        <p>From :</p>
                        <p> {salesperson}</p>
                    </div>
                    <div className={style.end}>
                        <p>to :</p>
                        <span>{customer}</span>
                    </div>
                </div>
            </div>
            <table className={style.invoiceTable}>
                <thead className={style.invoiceTableHeader}>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody className={style.invoiceTableBody}>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.details}</td>
                            <td>{item.quantity}</td>
                            <td>{item.rate}</td>
                            <td>{item.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={style.previewSummary}>
                <div className={style.summaryRow}>
                    <p>Sub Total: {subTotal}</p>
                    <p>Discount: {(subTotal * (discount / 100)).toFixed(2)}</p>
                </div>
                {vatChecked && <p>VAT: {vatValue}%</p>}
                {isCgstChecked && <p>CGST: {cgstValue}%</p>}
                {isSgstChecked && <p>SGST: {sgstValue}%</p>}
                {isIgstChecked && <p>IGST: {igstValue}%</p>}
                <div className={style.advance}>
                    <p>Advance: {advance}</p>
                    <p>Total: {total}</p>
                </div>
            </div>

            <div className={style.previewTerms}>
                <h4>Terms & Conditions</h4>
                <p>{termsAndConditions}</p>
            </div>
        </div>
    );
}

export default InvoicePreview;
