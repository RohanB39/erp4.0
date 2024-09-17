import React, { useState } from 'react';
import ShiftForm from './ShiftForm';
import './ShiftRosterPage.css';

const ShiftRosterPage = () => {
  const initialShiftRoster = [
    { id: 1, employee: 'John Doe', department: 'Sales', shift: 'Morning', date: '27 Feb 2023' },
    { id: 2, employee: 'Jane Smith', department: 'Marketing', shift: 'Evening', date: '27 Feb 2023' },
    { id: 3, employee: 'Bob Johnson', department: 'IT', shift: 'Night', date: '27 Feb 2023' },
  ];

  const [shiftRoster, setShiftRoster] = useState(initialShiftRoster);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');

  const handleAddShift = (newShift) => {
    setShiftRoster([...shiftRoster, { ...newShift, id: shiftRoster.length + 1 }]);
  };

  const handleSearch = () => {
    const filteredRoster = initialShiftRoster.filter(
      (shift) =>
        shift.employee.toLowerCase().includes(searchEmployee.toLowerCase()) &&
        shift.department.toLowerCase().includes(searchDepartment.toLowerCase())
    );
    setShiftRoster(filteredRoster);
  };

  const handleReset = () => {
    setSearchEmployee('');
    setSearchDepartment('');
    setShiftRoster(initialShiftRoster);
  };

  return (
    <div className="shift-roster-page main" id='main'>
      <h2>Shift Roster</h2>
      <div className="search-form">
        <label>
          Search Employee:
          <input
            type="text"
            value={searchEmployee}
            onChange={(e) => setSearchEmployee(e.target.value)}
          />
        </label>
        <label>
          Search Department:
          <input
            type="text"
            value={searchDepartment}
            onChange={(e) => setSearchDepartment(e.target.value)}
          />
        </label>
        <button onClick={handleSearch} className='search'>Search</button>
        <button onClick={handleReset} className='search'>Reset</button>
      </div>
      <ShiftForm onAddShift={handleAddShift} />
      <ShiftRoster roster={shiftRoster} />
    </div>
  );
};

const ShiftRoster = ({ roster }) => {
  return (
    <div className="shift-roster main" id='main'>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Shift</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {roster.map((shift) => (
            <tr key={shift.id}>
              <td>{shift.employee}</td>
              <td>{shift.department}</td>
              <td>{shift.shift}</td>
              <td>{shift.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftRosterPage;
