import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './point.css';

const PointScoredChart = () => {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Points Scored',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                backgroundColor: 'rgba(55,55,55,0.2)',
                borderColor: 'rgba(55,55,55,1)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Month',
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Points',
                },
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default PointScoredChart;
