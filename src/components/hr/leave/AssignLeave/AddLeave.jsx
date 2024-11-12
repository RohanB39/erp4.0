import React, { useEffect, useState } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import './AddLeave.css';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

function AddLeave() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [leaveFrequency, setLeaveFrequency] = useState('');
  const [leaveDays, setLeaveDays] = useState('');
  const [leaveData, setLeaveData] = useState([]);

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

  const leaveTypeMapping = {
    "Casual Leave": "casualLeave",
    "Earn Leave": "earnLeave",
    "HPL Leave": "hplLeave"
  };

  const handleAddLeaveData = () => {
    if (selectedEmployee && leaveType && leaveDays) {
      // Find the employee's name based on the selected employee ID
      const selectedEmployeeData = employees.find(
        (employee) => employee.id === selectedEmployee
      );
      const employeeName = selectedEmployeeData ? selectedEmployeeData.fullName : '';

      // Get the correct leave type key from the mapping
      const leaveKey = leaveTypeMapping[leaveType];

      // Check if the employee already exists in the leave data array
      const existingLeaveDataIndex = leaveData.findIndex((data) => data.employeeId === employeeId);

      if (existingLeaveDataIndex !== -1) {
        const updatedLeaveData = [...leaveData];
        updatedLeaveData[existingLeaveDataIndex] = {
          ...updatedLeaveData[existingLeaveDataIndex],
          [leaveKey]: leaveDays
        };

        setLeaveData(updatedLeaveData);
      } else {
        const newLeaveData = {
          employeeName,
          employeeId,
          leaveFrequency,
          casualLeave: leaveType === 'Casual Leave' ? leaveDays : '',
          earnLeave: leaveType === 'Earn Leave' ? leaveDays : '',
          hplLeave: leaveType === 'HPL Leave' ? leaveDays : ''
        };

        setLeaveData((prevData) => [...prevData, newLeaveData]);
      }
    }
  };

  const handleSubmitLeave = async (employeeId) => {
    try {
      const employeeDocRef = doc(fireDB, 'employees', employeeId);
      const employeeLeaveData = leaveData.find((data) => data.employeeId === employeeId);
  
      if (employeeLeaveData) {
        const startDate = dayjs().format('DD-MM-YYYY');
        let endDate;
        if (employeeLeaveData.leaveFrequency === 'Monthly') {
          endDate = dayjs().add(1, 'month').format('DD-MM-YYYY');
        } else if (employeeLeaveData.leaveFrequency === 'Yearly') {
          endDate = dayjs().add(1, 'year').format('DD-MM-YYYY');
        } else {
          endDate = dayjs().format('DD-MM-YYYY');
        }
        const leaveInfo = {
          leaveFrequency: employeeLeaveData.leaveFrequency,
          casualLeave: employeeLeaveData.casualLeave,
          earnLeave: employeeLeaveData.earnLeave,
          hplLeave: employeeLeaveData.hplLeave,
          StartDate: startDate,
          EndDate: endDate,
          LeaveStatus: 'Not Used',
        };
        await updateDoc(employeeDocRef, { leaveInfo });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Leave data has been successfully saved!',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      } else {
        console.log("Employee leave data not found.");
      }
    } catch (error) {
      console.error("Error updating leave data in Firestore:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error saving the leave data. Please try again.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Close',
      });
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
        Add
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
                <th>Leave Frequency</th>
                <th>Casual Leave</th>
                <th>Earn Leave</th>
                <th>HPL Leave</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.map((data, index) => (
                <tr key={index}>
                  <td>{data.employeeName}</td>
                  <td>{data.employeeId}</td>
                  <td>{data.leaveFrequency}</td>
                  <td>{data.casualLeave}</td>
                  <td>{data.earnLeave}</td>
                  <td>{data.hplLeave}</td>
                  <td>
                    <button onClick={() => handleSubmitLeave(data.employeeId)}>Submit</button>
                  </td>
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
