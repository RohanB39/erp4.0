import React, { useState } from 'react';
import './financePage.css';


import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { GiReceiveMoney } from "react-icons/gi";
import { BsCurrencyRupee } from "react-icons/bs";
import { FaMoneyBillAlt } from "react-icons/fa";
import { AiOutlineCalendar } from 'react-icons/ai';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';



// Sample data for the charts
const dataIncome = [
    { name: 'Jan', income: 4000 },
    { name: 'Feb', income: 3000 },
    { name: 'Mar', income: 2000 },
    { name: 'Apr', income: 2780 },
    { name: 'May', income: 1890 },
    { name: 'Jun', income: 2390 },
    { name: 'Jul', income: 3490 },
];

const dataExpend = [
    { name: 'Jan', expend: 2000 },
    { name: 'Feb', expend: 2500 },
    { name: 'Mar', expend: 1800 },
    { name: 'Apr', expend: 1900 },
    { name: 'May', expend: 2100 },
    { name: 'Jun', expend: 1700 },
    { name: 'Jul', expend: 2200 },
];

const dataSavings = [
    { name: 'Jan', savings: 1000 },
    { name: 'Feb', savings: 1500 },
    { name: 'Mar', savings: 1200 },
    { name: 'Apr', savings: 1400 },
    { name: 'May', savings: 1100 },
    { name: 'Jun', savings: 1300 },
    { name: 'Jul', savings: 1600 },
];

const dataInvestment = [
    { name: 'Jan', investment: 3000 },
    { name: 'Feb', investment: 3200 },
    { name: 'Mar', investment: 2800 },
    { name: 'Apr', investment: 3100 },
    { name: 'May', investment: 2900 },
    { name: 'Jun', investment: 3300 },
    { name: 'Jul', investment: 3700 },
];

const dataMoneyFlow = [
    { name: 'Jan', Internet: 164, Health: 128, Food: 210, Shopping: 180, Vacation: 300 },
    { name: 'Feb', Internet: 200, Health: 150, Food: 220, Shopping: 190, Vacation: 320 },
    { name: 'Mar', Internet: 180, Health: 140, Food: 200, Shopping: 170, Vacation: 310 },
    { name: 'Apr', Internet: 220, Health: 160, Food: 230, Shopping: 200, Vacation: 340 },
    { name: 'May', Internet: 210, Health: 155, Food: 225, Shopping: 195, Vacation: 330 },
    { name: 'Jun', Internet: 230, Health: 170, Food: 240, Shopping: 210, Vacation: 350 },
    { name: 'Jul', Internet: 240, Health: 180, Food: 250, Shopping: 220, Vacation: 360 },
];

function FinancePage() {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <>
            <div className="finance-container">
                <div className="main" id='main'>
                    <div className="finance-content">
                        <div>
                            <h3>Your Total Balance</h3>
                            <p>Take a look at your statistics</p>
                        </div>
                        <div className='finance-stats'>
                            <div className='left-stats'>
                                <h3>$4343</h3>
                                <span>$23232(+2.5%)</span>
                            </div>
                            <div className='stats'>
                                {/* <GiReceiveMoney className='icon' /> */}
                                <div>
                                    <h2>$3232</h2>
                                    <span>Income from Investment</span>
                                </div>
                            </div>
                            <div className='stats'>
                                {/* <BsCurrencyRupee className='icon' /> */}
                                <div>
                                    <h2>$3232</h2>
                                    <span>Income from Accounts</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <hr />
                </div>
            </div>
            <div className="finance-cards" id='main'>
                <div className="single-card">
                    <div className="icon">
                        <div>
                            <h3>$2323</h3>
                            <p>Total Income</p>
                        </div>
                        <FaMoneyBillAlt className='icons' />
                    </div>
                    <div className='graph'>
                        <ResponsiveContainer width="100%" height={30}>
                            <AreaChart data={dataIncome}>
                                <Tooltip />
                                <Area type="monotone" dataKey="income" stroke="#8884d8" fill="#8884d8" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="single-card">
                    <div className="icon">
                        <div>
                            <h3>$1243</h3>
                            <p>Total Expend</p>
                        </div>
                        <FaMoneyBillAlt className='icons' />
                    </div>
                    <div className='graph'>
                        <ResponsiveContainer width="100%" height={30}>
                            <AreaChart data={dataExpend}>
                                <Tooltip />
                                <Area type="monotone" dataKey="expend" stroke="#82ca9d" fill="#82ca9d" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="single-card">
                    <div className="icon">
                        <div>
                            <h3>$223</h3>
                            <p>Total Savings</p>
                        </div>
                        <FaMoneyBillAlt className='icons' />
                    </div>
                    <div className='graph'>
                        <ResponsiveContainer width="100%" height={30}>
                            <AreaChart data={dataSavings}>
                                <Tooltip />
                                <Area type="monotone" dataKey="savings" stroke="#ffc658" fill="#ffc658" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="single-card">
                    <div className="icon">
                        <div>
                            <h3>$4323</h3>
                            <p>Total Investment</p>
                        </div>
                        <FaMoneyBillAlt className='icons' />
                    </div>
                    <div className='graph'>
                        <ResponsiveContainer width="100%" height={30}>
                            <AreaChart data={dataInvestment}>
                                <Tooltip />
                                <Area type="monotone" dataKey="investment" stroke="#ff7300" fill="#ff7300" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="finance-graph-container " id="main">
                <div className="graph-container">
                    <div className="graph-header">
                        <h3>Money Flow</h3>
                        <p>Cost and Usage</p>
                    </div>
                    <div className="graph-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dataMoneyFlow}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="" dataKey="Internet" stroke="#8884d8" />
                                <Line type="bar" dataKey="Health" stroke="#82ca9d" />
                                <Line type="" dataKey="Food" stroke="#ffc658" />
                                <Line type="monotone" dataKey="Shopping" stroke="#ff7300" />
                                <Line type="monotone" dataKey="Vacation" stroke="#413ea0" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                </div>
                <div className="recent-payment-container">
                    <div className="payment-header">
                        <h3>Recent Payment</h3>
                    </div>
                    <div className="payment-serch">
                        <input type="text" placeholder='Search Payment' />
                        <div className="calendar">
                            {/* <AiOutlineCalendar /> */}
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                customInput={<AiOutlineCalendar className='icon' />}
                            />
                        </div>
                    </div>
                    <div className="payment-list">

                        <div className='single-payment'>
                            <div>
                                <h3>Internet Payment</h3>
                                <p>07/02/2014</p>
                            </div>
                            <div>
                                <h5>+$24</h5>
                                <p>21:43pm</p>
                            </div>
                        </div>


                        <div className='single-payment'>
                            <div>
                                <h3>Internet Payment</h3>
                                <p>07/02/2014</p>
                            </div>
                            <div>
                                <h5>+$24</h5>
                                <p>21:43pm</p>
                            </div>
                        </div>
                        <div className='single-payment'>
                            <div>
                                <h3>Internet Payment</h3>
                                <p>07/02/2014</p>
                            </div>
                            <div>
                                <h5>+$24</h5>
                                <p>21:43pm</p>
                            </div>
                        </div>
                        <div className='single-payment'>
                            <div>
                                <h3>Internet Payment</h3>
                                <p>07/02/2014</p>
                            </div>
                            <div>
                                <h5>+$24</h5>
                                <p>21:43pm</p>
                            </div>
                        </div>
                        <div className='single-payment'>
                            <div>
                                <h3>Internet Payment</h3>
                                <p>07/02/2014</p>
                            </div>
                            <div>
                                <h5>+$24</h5>
                                <p>21:43pm</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default FinancePage;
