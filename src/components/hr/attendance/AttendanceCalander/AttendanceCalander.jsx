import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig'; // Import your Firebase configuration
import './AttendanceCalander.css'; // Import your CSS
import dayjs from 'dayjs'; // To handle date formatting

const AttendanceCalendar = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [expandedEmployee, setExpandedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Fetch employees with "Onboarded" status
        const employeesQuery = query(
          collection(fireDB, 'employees'),
          where('Status', '==', 'Onboarded')
        );
        const employeeSnapshot = await getDocs(employeesQuery);
        const employeesList = employeeSnapshot.docs.map(doc => ({
          employeeId: doc.id,
          name: `${doc.data().personalInfo.firstName} ${doc.data().personalInfo.lastName}`,
        }));
        setEmployees(employeesList);
      } catch (error) {
        console.error('Error fetching employees: ', error);
      }
    };

    const fetchAttendance = async () => {
      try {
        // Fetch attendance data from "EMP_SIGNIN_SIGNOUT"
        const attendanceCollectionRef = collection(fireDB, 'EMP_SIGNIN_SIGNOUT');
        const snapshot = await getDocs(attendanceCollectionRef);
        const attendanceRecords = {};

        snapshot.forEach(doc => {
          const employeeId = doc.id; // employeeId matches the doc.id in this collection
          const employeeData = doc.data();

          // For each employee's attendance data, check the date fields (e.g., "2024-11-09")
          Object.keys(employeeData).forEach(date => {
            if (date !== 'employeeName' && date !== 'designation') {
              if (!attendanceRecords[employeeId]) {
                attendanceRecords[employeeId] = {};
              }
              attendanceRecords[employeeId][date] = employeeData[date] === 'present' ? 'Present' : 'Absent';
            }
          });
        });

        setAttendanceData(attendanceRecords);
      } catch (error) {
        console.error('Error fetching attendance data: ', error);
      }
    };

    fetchEmployees();
    fetchAttendance();
  }, []);

  const toggleEmployeeDetails = (employeeId) => {
    // Toggle the expanded employee details
    setExpandedEmployee(expandedEmployee === employeeId ? null : employeeId);
  };

  return (
    <div className="attendance-cards main" id='main'>
      <h2>Employee Attendance</h2>
      <div className="employee-cards">
        {employees.map(employee => (
          <div className="employee-card" key={employee.employeeId}>
            <div className="employee-header">
              <div className="employee-info">
                <p className="employee-id">Employee ID: {employee.employeeId}</p>
                <p className="employee-name">{employee.name}</p>
              </div>
              <button className="toggle-button" onClick={() => toggleEmployeeDetails(employee.employeeId)}>
                {expandedEmployee === employee.employeeId ? '▲' : '▼'}
              </button>
            </div>

            {expandedEmployee === employee.employeeId && (
              <div className="attendance-details">
                {Object.keys(attendanceData[employee.employeeId] || {}).map(date => (
                  <div key={date} className="attendance-day">
                    <span>{dayjs(date).format('YYYY-MM-DD')}</span>: 
                    <span className={attendanceData[employee.employeeId][date] === 'Present' ? 'present' : 'absent'}>
                      {attendanceData[employee.employeeId][date]}
                    </span>
                  </div>
                ))}
                {Object.keys(attendanceData[employee.employeeId] || {}).length === 0 && (
                  <p>No attendance data available</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
