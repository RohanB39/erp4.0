import React, { useState, useEffect } from 'react';
import './LeavePage.css';
import { MdOutlineDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

const LeavePage = () => {

  const [leaveRecords, setLeaveRecords] = useState([
    { type: 'Medical Leave', from: '27 Feb 2023', to: '27 Feb 2023', days: '1 day', reason: 'Going to Hospital' },
    { type: 'Hospitalisation', from: '15 Jan 2023', to: '25 Jan 2023', days: '10 days', reason: 'Going to Hospital' },
    { type: 'Maternity Leave', from: '5 Jan 2023', to: '15 Jan 2023', days: '10 days', reason: 'Going to Hospital' },
    { type: 'Casual Leave', from: '10 Jan 2023', to: '11 Jan 2023', days: '2 days', reason: 'Going to Hospital' },
    { type: 'Casual Leave', from: '9 Jan 2023', to: '10 Jan 2023', days: '2 days', reason: 'Going to Hospital' },
    { type: 'LOP', from: '24 Feb 2023', to: '25 Feb 2023', days: '2 days', reason: 'Personal' },
    { type: 'Casual Leave', from: '13 Jan 2023', to: '14 Jan 2023', days: '2 days', reason: 'Going to Hospital' },
    { type: 'Paternity Leave', from: '13 Feb 2023', to: '17 Feb 2023', days: '5 days', reason: 'Going to Hospital' },
    { type: 'Casual Leave', from: '8 Mar 2023', to: '9 Mar 2023', days: '2 days', reason: 'Going to Hospital' },
    { type: 'Casual Leave', from: '30 Jan 2023', to: '31 Jan 2023', days: '2 days', reason: 'Personal' },
  ]);

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
    navigate('/add-leave');
  };

  const handleApproveLeave = () => {
    navigate('/approve-leave');
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
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>No Of Days</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.type}</td>
              <td>{record.from}</td>
              <td>{record.to}</td>
              <td>{record.days}</td>
              <td>{record.reason}</td>
              <td>Approved</td>
              <td>
                <div className='leave-btns'>

                  <button className='Btn'><CiEdit /></button>

                  <button className='Btn'><MdOutlineDelete /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeavePage;
