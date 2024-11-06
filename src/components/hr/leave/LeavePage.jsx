import React, { useState } from 'react';
import './LeavePage.css';
import { MdOutlineDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import LeaveOverview from './LeaveOverview';
import { useNavigate } from 'react-router-dom';

const LeavePage = () => {
  const [leaveStats, setLeaveStats] = useState({
    annualLeave: 12,
    medicalLeave: 3,
    otherLeave: 4,
    remainingLeave: 5,
  });

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
      <LeaveStats stats={leaveStats} />
      <LeaveRecords records={leaveRecords} />
    </div>
  );
};

const LeaveStats = ({ stats }) => {
  const navigate = useNavigate(); // Initialize the navigate function
  const handleAssignLeave = () => {
    navigate('/add-leave'); // Navigate to the AddLeave page when button is clicked
  };
  return (
    <div className="leave-stats main" id='main'>
      <h2>Leave Statistics</h2>
      <div className="stats-cards " id=''>
        <button className='LeaveAssign' onClick={handleAssignLeave}>
          Assign Leave
        </button>
        <div className="card" id=''>
          <h3>Annual Leave</h3>
          <p>{stats.annualLeave}</p>
        </div>
        <div className="card" id=''>
          <h3>Medical Leave</h3>
          <p>{stats.medicalLeave}</p>
        </div>
        <div className="card " id=''>
          <h3>Other Leave</h3>
          <p>{stats.otherLeave}</p>
        </div>
        <div className="card " id=''>
          <h3>Remaining Leave</h3>
          <p>{stats.remainingLeave}</p>
        </div>
      </div>
    </div>
  );
};

const AssignLeaveButton = () => {
  return (
    <div className="assign-leave-btn-container">
      <button className="assign-leave-btn">Assign Leaves For Employees</button>
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

const EmployeeLeaveSection = ({ stats, records }) => {
  return (
    <div>
      <LeaveStats stats={stats} />
      <AssignLeaveButton />
      <LeaveRecords records={records} />
    </div>
  );
};

export default LeavePage;
