import React from 'react';

function DisplayData({ formData }) {
    return (
        <div>
            <h2>Form Data</h2>
            <table className="table">
                <tbody>
                    <tr>
                        <td><strong>Leave Type</strong></td>
                        <td>{formData.leaveType}</td>
                    </tr>
                    <tr>
                        <td><strong>From Date</strong></td>
                        <td>{formData.fromDate.toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Sessions (From)</strong></td>
                        <td>{formData.fromSession}</td>
                    </tr>
                    <tr>
                        <td><strong>To Date</strong></td>
                        <td>{formData.toDate.toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Sessions (To)</strong></td>
                        <td>{formData.toSession}</td>
                    </tr>
                    <tr>
                        <td><strong>Contact Details</strong></td>
                        <td>{formData.contactDetails}</td>
                    </tr>
                    <tr>
                        <td><strong>Reason</strong></td>
                        <td>{formData.reason}</td>
                    </tr>
                    <tr>
                        <td><strong>Attachment</strong></td>
                        <td>{formData.file ? formData.file.name : 'No file attached'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default DisplayData;
