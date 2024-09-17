import React from 'react';
import { useLocation } from 'react-router-dom';
import './UpdateLeave.css';

function UpdateLeave() {
    const location = useLocation();
    const { formData } = location.state || {};

    return (
        <div className='empp main' id='main'>
            <h2>Update Leave Request</h2>
            {formData ? (
                <div>
                    <table className="table">
                        <tbody>
                            <tr>
                                <th>Leave Type</th>
                                <td>{formData.leaveType}</td>
                            </tr>
                            <tr>
                                <th>From Date</th>
                                <td>{formData.fromDate.toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <th>From Session</th>
                                <td>{formData.fromSession}</td>
                            </tr>
                            <tr>
                                <th>To Date</th>
                                <td>{formData.toDate.toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <th>To Session</th>
                                <td>{formData.toSession}</td>
                            </tr>
                            <tr>
                                <th>Contact Details</th>
                                <td>{formData.contactDetails}</td>
                            </tr>
                            <tr>
                                <th>Reason</th>
                                <td>{formData.reason}</td>
                            </tr>
                            <tr>
                                <th>File</th>
                                <td>{formData.file ? formData.file.name : 'No file attached'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No data to display</p>
            )}
        </div>
    );
}

export default UpdateLeave;
