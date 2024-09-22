import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ShiftOverrideForm.css';

const ShiftOverrideForm = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeName: '',
    dateFrom: '',
    dateTo: '',
    shiftType: 'single',
    effectiveFrom: '',
    shiftQuarter: '',
  });

  useEffect(() => {
    axios.get('/api/employees') // Update this URL to your actual API endpoint
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Here you would typically send formData to your API endpoint
  };

  return (
    <div className="shift-override-form main" id='main'>
      <h1>Shift Override</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group main" id='main'>
          <label htmlFor="employeeName">Employee Name</label>
          <select 
            id="employeeName" 
            name="employeeName" 
            value={formData.employeeName} 
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.name}>{emp.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group main" id='main'>
          <label htmlFor="dateFrom">Effective From</label>
          <input 
            type="date" 
            id="dateFrom" 
            name="dateFrom" 
            value={formData.dateFrom} 
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateTo">To</label>
          <input 
            type="date" 
            id="dateTo" 
            name="dateTo" 
            value={formData.dateTo} 
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shiftType">Shift Type</label>
          <div className="form-check">
            <input 
              type="radio" 
              id="singleShift" 
              name="shiftType" 
              value="single" 
              checked={formData.shiftType === 'single'} 
              onChange={handleChange}
              className="form-check-input"
            />
            <label htmlFor="singleShift" className="form-check-label">Single Shift</label>
          </div>
          <div className="form-check main" id='main'>
            <input 
              type="radio" 
              id="multipleShifts" 
              name="shiftType" 
              value="multiple" 
              checked={formData.shiftType === 'multiple'} 
              onChange={handleChange}
              className="form-check-input"
            />
            <label htmlFor="multipleShifts" className="form-check-label">Multiple Shifts</label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="effectiveFrom">Effective From</label>
          <input 
            type="date" 
            id="effectiveFrom" 
            name="effectiveFrom" 
            value={formData.effectiveFrom} 
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shiftQuarter">Shift Quarter</label>
          <input 
            type="text" 
            id="shiftQuarter" 
            name="shiftQuarter" 
            value={formData.shiftQuarter} 
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default ShiftOverrideForm;
