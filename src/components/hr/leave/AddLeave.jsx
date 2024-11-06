import React, { useEffect, useState } from 'react';
import { fireDB } from '../../firebase/FirebaseConfig'; // Adjust the import path based on your Firebase configuration file
import { collection, query, where, getDocs } from 'firebase/firestore';
import './AddLeave.css';

function AddLeave() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeId, setEmployeeId] = useState(''); // Store the employeeId
  const [leaveType, setLeaveType] = useState(''); // Store the selected leave type
  const [leaveFrequency, setLeaveFrequency] = useState(''); // Store the selected leave frequency (Monthly or Yearly)
  const [leaveDays, setLeaveDays] = useState(''); // Store the number of leave days
  const [leaveData, setLeaveData] = useState([]); // Store the entered leave data for the table

  // Fetch employees with status 'Onboarded' from Firestore
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesQuery = query(
          collection(fireDB, 'employees'),
          where('Status', '==', 'Onboarded')
        );
        const querySnapshot = await getDocs(employeesQuery);
        
        const employeeList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const firstName = data.personalInfo.firstName;
          const lastName = data.personalInfo.lastName;
          const fullName = `${firstName} ${lastName}`;
          return { id: doc.id, fullName, employeeId: data.employeeId };
        });

        setEmployees(employeeList);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Handle employee selection
  const handleEmployeeChange = (event) => {
    const selectedEmployeeId = event.target.value;
    setSelectedEmployee(selectedEmployeeId);
    
    const selectedEmployeeData = employees.find(
      (employee) => employee.id === selectedEmployeeId
    );
    if (selectedEmployeeData) {
      setEmployeeId(selectedEmployeeData.employeeId);
    }
  };

  // Handle leave type selection
  const handleLeaveTypeChange = (event) => {
    setLeaveType(event.target.value);
  };

  // Handle leave frequency (Monthly or Yearly) selection
  const handleLeaveFrequencyChange = (event) => {
    setLeaveFrequency(event.target.value);
  };

  // Handle leave days input
  const handleLeaveDaysChange = (event) => {
    setLeaveDays(event.target.value);
  };

  // Handle form submission to update leave data for the employee
  const handleAddLeaveData = () => {
    if (selectedEmployee && leaveType && leaveDays) {
      // Find the employee's name based on the selected employee ID
      const selectedEmployeeData = employees.find(
        (employee) => employee.id === selectedEmployee
      );
      const employeeName = selectedEmployeeData ? selectedEmployeeData.fullName : '';

      // Check if the employee already exists in the leave data array
      const existingLeaveData = leaveData.find((data) => data.employeeId === employeeId);

      if (existingLeaveData) {
        // If the employee already exists, update the leave type column
        const updatedLeaveData = leaveData.map((data) => {
          if (data.employeeId === employeeId) {
            return {
              ...data,
              [leaveType.toLowerCase().replace(' ', '')]: leaveDays // Update the correct leave type column
            };
          }
          return data;
        });
        setLeaveData(updatedLeaveData);
      } else {
        // If the employee doesn't exist, add new data with the leave type
        const newLeaveData = {
          employeeName,
          employeeId,
          casualLeave: leaveType === 'Casual Leave' ? leaveDays : '',
          earnLeave: leaveType === 'Earn Leave' ? leaveDays : '',
          hplLeave: leaveType === 'HPL Leave' ? leaveDays : ''
        };

        setLeaveData((prevData) => [...prevData, newLeaveData]);
      }

      // Clear the form fields after adding/updating the data
      setSelectedEmployee('');
      setEmployeeId('');
      setLeaveType('');
      setLeaveFrequency('');
      setLeaveDays('');
    }
  };

  return (
    <div className="empp main" id="main">
      <h2>Assign Leave</h2>

      {/* Employee Dropdown */}
      <div className="form-group">
        <label htmlFor="employee">Select Employee</label>
        <select
          id="employee"
          value={selectedEmployee}
          onChange={handleEmployeeChange}
        >
          <option value="" disabled>Select an Employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Show employeeId in read-only input after selecting an employee */}
      {employeeId && (
        <div className="form-group">
          <label htmlFor="employeeId">Employee ID</label>
          <input
            type="text"
            id="employeeId"
            value={employeeId}
            readOnly
            className="readonly-input"
          />
        </div>
      )}

      {/* Leave Type Dropdown */}
      <div className="form-group">
        <label htmlFor="leaveType">Select Leave Type</label>
        <select
          id="leaveType"
          value={leaveType}
          onChange={handleLeaveTypeChange}
        >
          <option value="" disabled>Select Leave Type</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Earn Leave">Earn Leave</option>
          <option value="HPL Leave">HPL Leave</option>
        </select>
      </div>

      {/* Leave Frequency Dropdown (Monthly or Yearly) */}
      <div className="form-group">
        <label htmlFor="leaveFrequency">Select Leave Frequency</label>
        <select
          id="leaveFrequency"
          value={leaveFrequency}
          onChange={handleLeaveFrequencyChange}
        >
          <option value="" disabled>Select Leave Frequency</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>

      {/* Input for Leave Days */}
      <div className="form-group">
        <label htmlFor="leaveDays">Enter Number of Leave Days</label>
        <input
          type="number"
          id="leaveDays"
          value={leaveDays}
          onChange={handleLeaveDaysChange}
          min="1"
          placeholder="Enter number of days"
        />
      </div>

      {/* Button to add/update leave data */}
      <button className="btn" onClick={handleAddLeaveData}>
        Add/Update Leave Data
      </button>

      {/* Table to display entered leave data */}
      {leaveData.length > 0 && (
        <div className="leave-table">
          <h3>Leave Data</h3>
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Casual Leave</th>
                <th>Earn Leave</th>
                <th>HPL Leave</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.map((data, index) => (
                <tr key={index}>
                  <td>{data.employeeName}</td>
                  <td>{data.employeeId}</td>
                  <td>{data.casualLeave}</td>
                  <td>{data.earnLeave}</td>
                  <td>{data.hplLeave}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AddLeave;
