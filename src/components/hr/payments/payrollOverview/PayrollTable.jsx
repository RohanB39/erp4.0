import React, { useState, useEffect } from 'react';
import './payrollTable.css';

function PayrollTable() {
    const [earnings, setEarnings] = useState([
        { name: 'Basic pay (Fix)', amount: 5000 },
        { name: 'House Rent Allowance (Fix)', amount: 0 },
        { name: 'Special Allowance (deletable)', amount: 600 }
    ]);

    const [deductions, setDeductions] = useState([
        { name: 'Professional Tax (PT)', amount: 200 },
        { name: 'EPF', amount: 1800 }
    ]);

    const [totalEarnings, setTotalEarnings] = useState(0);
    const [totalDeductions, setTotalDeductions] = useState(0);
    const [inhandAmount, setInhandAmount] = useState(0);

    useEffect(() => {
        const earningsSum = earnings.reduce((total, item) => total + item.amount, 0);
        const deductionsSum = deductions.reduce((total, item) => total + item.amount, 0);
        setTotalEarnings(earningsSum);
        setTotalDeductions(deductionsSum);
        setInhandAmount(earningsSum - deductionsSum);
    }, [earnings, deductions]);

    const handleSave = () => {
        alert('Data Saved!');
        // Add logic to save the data
    };

    return (
        <div className='payroll-table main' id='main'>
            <h2>Payroll Table</h2>
            <table>
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Earnings</th>
                        <th>Currency</th>
                        <th>Deductions</th>
                        <th>Currency</th>
                    </tr>
                </thead>
                <tbody>
                    {earnings.map((earning, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{earning.name}</td>
                            <td>{earning.amount}</td>
                            <td>{deductions[index]?.name || ''}</td>
                            <td>{deductions[index]?.amount || ''}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="5"><hr /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Total</td>
                        <td>{totalEarnings}</td>
                        <td>Total</td>
                        <td>{totalDeductions}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Inhand Amount</td>
                        <td>{inhandAmount}</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <button onClick={handleSave}>Save</button>
        </div>
    );
}

export default PayrollTable;
