import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './LeaveCalendar.css';

const LeaveCalendar = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    console.log('Fetching leave data...');
    axios.get('/api/leaves') // Update this URL to your actual API endpoint
      .then(response => {
        console.log('Leave data fetched:', response.data);
        setLeaveData(response.data);
      })
      .catch(error => {
        console.error('Error fetching leave data:', error);
      });
  }, []);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const leaveForDate = leaveData.find(leave => leave.date === dateString);
      if (leaveForDate) {
        return <p className="leave-day">{leaveForDate.employeeName}: {leaveForDate.leaveType}</p>;
      }
    }
    return null;
  };

  return (
    <div className="leave-calendar">
      <h1>Leave Calendar</h1>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent}
      />
    </div>
  );
};

export default LeaveCalendar;
