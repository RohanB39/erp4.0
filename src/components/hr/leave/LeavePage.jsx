import React, { useState, useEffect } from 'react';
import './LeavePage.css';
import { MdOutlineDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

const LeavePage = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  useEffect(() => {
    const fetchLeaveRecords = async () => {
      const records = [];
      try {
        const employeesSnapshot = await getDocs(collection(fireDB, 'employees'));
        employeesSnapshot.forEach(async (docSnapshot) => {
          const employeeData = docSnapshot.data();
          const leaveApplications = employeeData?.LeaveApplications || {};
          for (const leaveId in leaveApplications) {
            const leave = leaveApplications[leaveId];
            if (leave.status === 'Approved') {
              const firstName = employeeData?.personalInfo?.firstName || '';
              const lastName = employeeData?.personalInfo?.lastName || '';
              const fullName = `${firstName} ${lastName}`;
              records.push({
                name: fullName,
                from: leave.fromDate,
                to: leave.toDate,
                daysRequested: leave.daysRequested,
                reason: leave.reason,
                status: leave.status
              });
            }
          }
        });
        setLeaveRecords(records);
      } catch (error) {
        console.error('Error fetching leave records:', error);
      }
    };
    fetchLeaveRecords();
  }, []);
  
  return (
    <div className="leave-page">
      <LeaveStats />
      <LeaveRecords records={leaveRecords} />
    </div>
  );
};

const LeaveStats = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  const handleAssignLeave = () => {
    navigate('/addLeave');
  };

  const handleApproveLeave = () => {
    navigate('/approveLeave');
  };

  const fetchPendingLeaves = async () => {
    const employeesCollection = collection(fireDB, 'employees');
    const employeeDocs = await getDocs(employeesCollection);
    let pendingCount = 0;

    employeeDocs.forEach((doc) => {
      const data = doc.data();
      if (data.LeaveApplications) {
        Object.values(data.LeaveApplications).forEach((leaveApplication) => {
          if (leaveApplication.status === 'Pending') {
            pendingCount += 1;
          }
        });
      }
    });

    setNotificationCount(pendingCount);
  };

  useEffect(() => {
    fetchPendingLeaves();
  }, []);


  return (
    <div className="leave-stats main" id='main'>
      <h2>Leave Statistics</h2>
      <div className="stats-cards">
        <button className="LeaveAssign" onClick={handleAssignLeave}>
          Assign Leave
        </button>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button className="LeaveAssign" onClick={handleApproveLeave}>
            Approve Leave
          </button>
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};


const LeaveRecords = ({ records }) => {
  return (
    <div className="leave-list main" id='main'>
      <h3>Leave Records</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>From</th>
            <th>To</th>
            <th>No Of Days</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr><td colSpan="7">No approved leaves found.</td></tr>
          ) : (
            records.map((record, index) => (
              <tr key={index}>
                <td>{record.name}</td>
                <td>{record.from}</td>
                <td>{record.to}</td>
                <td>{record.daysRequested}</td>
                <td>{record.reason}</td>
                <td>{record.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeavePage;
