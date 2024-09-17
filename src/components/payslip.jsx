import React from 'react';
import './payslip.css';

function PaySlip() {
    return (
        <div className="payslip-container main" id='main'>
            <div className="headerrr">
                <h5>PAYSLIP FOR THE MONTH OF FEB 2019</h5>
               
                
            </div>
            <table className="payslip-table">
                <tbody>
                    <tr>
                        <td>PAYSLIP #49029</td>
                        <td>Salary Month: March, 2019</td>
                    </tr>
                    <tr>
                        <td>John Doe</td>
                        <td>Web Designer</td>
                    </tr>
                    <tr>
                        <td>Employee ID: FT-0009</td>
                        <td>Joining Date: 1 Jan 2023</td>
                    </tr>
                </tbody>
            </table>
            <table className="payslip-table">
                <thead>
                    <tr>
                        <th>Earnings</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Basic Salary</td>
                        <td>$6500</td>
                    </tr>
                    <tr>
                        <td>House Rent Allowance (H.R.A.)</td>
                        <td>$55</td>
                    </tr>
                    <tr>
                        <td>Conveyance</td>
                        <td>$55</td>
                    </tr>
                    <tr>
                        <td>Other Allowance</td>
                        <td>$55</td>
                    </tr>
                    <tr>
                        <td>Total Earnings</td>
                        <td>$6665</td>
                    </tr>
                </tbody>
            </table>
            <table className="payslip-table">
                <thead>
                    <tr>
                        <th>Deductions</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tax Deducted at Source (T.D.S.)</td>
                        <td>$0</td>
                    </tr>
                    <tr>
                        <td>Provident Fund</td>
                        <td>$0</td>
                    </tr>
                    <tr>
                        <td>ESI</td>
                        <td>$0</td>
                    </tr>
                    <tr>
                        <td>Loan</td>
                        <td>$300</td>
                    </tr>
                    <tr>
                        <td>Total Deductions</td>
                        <td>$300</td>
                    </tr>
                </tbody>
            </table>
            <table className="payslip-table">
                <tbody>
                    <tr>
                        <td>Net Salary</td>
                        <td>$6365</td>
                    </tr>
                    <tr>
                        <td colSpan="2">(Six thousand three hundred and sixty-five only.)</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default PaySlip;
