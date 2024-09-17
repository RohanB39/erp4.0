import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import './LeaveOverview.css';

// Register the required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const LeaveOverview = () => {
  const [leaveData, setLeaveData] = useState([]);

  useEffect(() => {
    axios.get('/api/leaves') // Update this URL to your actual API endpoint
      .then(response => {
        setLeaveData(response.data);
      })
      .catch(error => {
        console.error('Error fetching leave data:', error);
      });
  }, []);

  const pieData = {
    labels: leaveData.map(item => item.leaveType),
    datasets: [
      {
        data: leaveData.map(item => item.days),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Leave Overview',
      },
    },
  };

  return (
    <div className="leave-overview">
      <h1>Leave Overview</h1>
      <div className="chart-container">
        <Pie data={pieData} options={options} />
      </div>
    </div>
  );
};

export default LeaveOverview;
