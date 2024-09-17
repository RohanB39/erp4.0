import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddLeave.css';

function AddLeave() {
    const initialFormState = {
        leaveType: '',
        fromDate: new Date(),
        fromSession: '',
        toDate: new Date(),
        toSession: '',
        applyingFor: '',
        applyingTo: '',
        ccTo: '',
        contactDetails: '',
        reason: '',
        file: null
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleFromDateChange = (date) => {
        setFormData({ ...formData, fromDate: date });
    };

    const handleToDateChange = (date) => {
        setFormData({ ...formData, toDate: date });
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
       
        setFormData(initialFormState); 
    };

    const handleReset = () => {
        setFormData(initialFormState);
    };

    return (
        <div className='empp main' id='main'>
            <h2>Applying for Leave</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Leave type:</label>
                    <select 
                        name="leaveType" 
                        value={formData.leaveType} 
                        onChange={handleChange} 
                        className="form-control" 
                        required 
                    >
                        <option value="">Select Leave Type</option>
                        <option value="Earned Leave">Earned Leave</option>
                        <option value="Maternity Leave">Maternity Leave</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>From date:</label>
                    <DatePicker 
                        selected={formData.fromDate} 
                        onChange={handleFromDateChange} 
                        className="form-control" 
                    />
                </div>
                <div className="form-group">
                    <label>Sessions:</label>
                    <input 
                        type="text" 
                        name="fromSession" 
                        value={formData.fromSession} 
                        onChange={handleChange} 
                        className="form-control" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>To date:</label>
                    <DatePicker 
                        selected={formData.toDate} 
                        onChange={handleToDateChange} 
                        className="form-control" 
                    />
                </div>
                <div className="form-group">
                    <label>Sessions:</label>
                    <input 
                        type="text" 
                        name="toSession" 
                        value={formData.toSession} 
                        onChange={handleChange} 
                        className="form-control" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Contact details:</label>
                    <input 
                        type="text" 
                        name="contactDetails" 
                        value={formData.contactDetails} 
                        onChange={handleChange} 
                        className="form-control" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Reason:</label>
                    <textarea 
                        name="reason" 
                        value={formData.reason} 
                        onChange={handleChange} 
                        className="form-control" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Attach File:</label>
                    <input 
                        type="file" 
                        name="file" 
                        onChange={handleChange} 
                        className="form-control-file" 
                    />
                    <small>File Types: pdf, xls, xlsx, doc, docx, txt, ppt, pptx, gif, jpg, jpeg, png</small>
                </div>
                
                    <button type="submit" className="btn1">Submit</button>
                    <button type="button" className="btn1" onClick={handleReset}>Reset</button>
               
            </form>
        </div>
    );
}

export default AddLeave;
