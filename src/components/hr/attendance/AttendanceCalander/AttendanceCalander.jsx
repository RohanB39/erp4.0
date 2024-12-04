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

    function convertTo24Hour(time) {
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes, seconds] = timePart.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    const fetchAttendance = async () => {
      try {
        const attendanceCollectionRef = collection(fireDB, 'EMP_SIGNIN_SIGNOUT');
        const snapshot = await getDocs(attendanceCollectionRef);
        const attendanceRecords = {};
        const currentDate = new Date();
        const currentMonthYear = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
        snapshot.forEach(doc => {
          const employeeId = doc.id;
          const employeeData = doc.data();
          Object.keys(employeeData).forEach(date => {
            const dateMonthYear = date.slice(0, 7);
            if (dateMonthYear === currentMonthYear) {
              const dailyAttendance = employeeData[date];
              if (dailyAttendance.signInTime && dailyAttendance.signOutTime) {
                const entry = employeeData[date];
                const signInTime = entry?.signInTime || "00:00:00 AM";
                const signOutTime = entry?.signOutTime || "00:00:00 PM";
                const signInDate = new Date(`1970-01-01T${convertTo24Hour(signInTime)}Z`);
                const signOutDate = new Date(`1970-01-01T${convertTo24Hour(signOutTime)}Z`);
                const timeDiffMs = signOutDate - signInDate;
                const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
                let status = 'Absent';
                if (timeDiffHours >= 8) {
                  status = 'Present';
                } else if (timeDiffHours >= 5) {
                  status = 'Half Day';
                }
                if (!attendanceRecords[employeeId]) {
                  attendanceRecords[employeeId] = {};
                }
                attendanceRecords[employeeId][date] = status;
              } else {
                if (!attendanceRecords[employeeId]) {
                  attendanceRecords[employeeId] = {};
                }
                attendanceRecords[employeeId][date] = 'Absent';
              }
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
                    <span className='dd'>{dayjs(date).format('YYYY-MM-DD')}</span>:
                    <span className='dd'>
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
