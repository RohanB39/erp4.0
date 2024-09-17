import React, { useState } from 'react';
import './ShiftRosterPage.css';

const ShiftForm = ({ onAddShift }) => {
  const [employee, setEmployee] = useState('');
  const [department, setDepartment] = useState('');
  const [shift, setShift] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (employee && department && shift && date) {
      onAddShift({ employee, department, shift, date });
      setEmployee('');
      setDepartment('');
      setShift('');
      setDate('');
    }
  };

  return (
    <div className="shift-form">
      <h3>Add Shift</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Employee:
          <input type="text" value={employee} onChange={(e) => setEmployee(e.target.value)} />
        </label>
        <br />
        <label>
          Department:
          <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
        </label>
        <br />
        <label>
          Shift:
          <input type="text" value={shift} onChange={(e) => setShift(e.target.value)} />
        </label>
        <br />
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <br />
        <button type="submit" className='search'>Add Shift</button>
      </form>
    </div>
  );
};

export default ShiftForm;
