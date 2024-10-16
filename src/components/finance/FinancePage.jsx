import React, { useState, useEffect } from 'react';
import './financePage.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { GiReceiveMoney } from "react-icons/gi";
import { BsCurrencyRupee } from "react-icons/bs";
import { FaMoneyBillAlt } from "react-icons/fa";
import { AiOutlineCalendar } from 'react-icons/ai';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { fireDB, collection, query, where, getDocs } from '../firebase/FirebaseConfig';

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
    const [dataIncome, setDataIncome] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    let newArray = Object.values(dataIncome);
    newArray.unshift({ name: 'dummy', income: 0 });

    const [dataAssets, setDataAssets] = useState([]);
    const [totalAssets, setTotalAssets] = useState(0);
    let newAssetsArray = Object.values(dataAssets);
    newAssetsArray.unshift({ name: 'dummy', expence: 0 });

    useEffect(() => {
        // Function to fetch the income data
        const fetchIncomeData = async () => {
            try {
                const dispatchInvoicesRef = collection(fireDB, 'Dispatch_Invoices');
                const dispatchQuery = query(dispatchInvoicesRef, where('invStatus', '==', 'Dispatched'));
                const dispatchSnapshot = await getDocs(dispatchQuery);

                // Temporary object to store the sum of income per month
                const incomeByMonth = {
                    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0,
                    '11': 0, '12': 0
                };

                dispatchSnapshot.forEach(doc => {
                    const invoiceData = doc.data();
                    const invoiceDate = invoiceData.invoiceDate;
                    const total = parseFloat(invoiceData.total);

                    let month = invoiceDate.split('-')[1];
                    month = (parseInt(month, 10)).toString();

                    // Add the total to the corresponding month in the incomeByMonth object
                    if (incomeByMonth[month] !== undefined) {
                        incomeByMonth[month] += total;
                    }
                });

                // Update dataIncome based on the fetched data
                const updatedDataIncome = Object.keys(incomeByMonth).map(month => ({
                    name: month,
                    income: incomeByMonth[month],
                }));

                setDataIncome(updatedDataIncome);

                // Calculate total income from all months
                const total = Object.values(incomeByMonth).reduce((acc, curr) => acc + curr, 0);
                setTotalIncome(total);

            } catch (error) {
                console.error('Error calculating income:', error);
            }
        };
        fetchIncomeData();
    }, []);

    useEffect(() => {
        // Function to fetch the machine data
        const fetchMachineData = async () => {
            try {
                const dispatchInvoicesRef = collection(fireDB, 'Machines');
                const dispatchQuery = query(dispatchInvoicesRef, where('machineStatus', '==', 'Active'));
                const dispatchSnapshot = await getDocs(dispatchQuery);

                // Temporary object to store the sum of income per month
                const incomeByMonth = {
                    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0,
                    '11': 0, '12': 0
                };

                dispatchSnapshot.forEach(doc => {
                    const invoiceData = doc.data();
                    const invoiceDate = invoiceData.installationDate;
                    const total = parseFloat(invoiceData.machinePrice);

                    let month = invoiceDate.split('-')[1];
                    month = (parseInt(month, 10)).toString();

                    // Add the total to the corresponding month in the incomeByMonth object
                    if (incomeByMonth[month] !== undefined) {
                        incomeByMonth[month] += total;
                    }
                });

                // Update dataIncome based on the fetched data
                const updatedDataIncome = Object.keys(incomeByMonth).map(month => ({
                    name: month,
                    expance: incomeByMonth[month],
                }));

                setDataAssets(updatedDataIncome);

                // Calculate total income from all months
                const total = Object.values(incomeByMonth).reduce((acc, curr) => acc + curr, 0);
                setTotalAssets(total);

            } catch (error) {
                console.error('Error calculating income:', error);
            }
        };
        fetchMachineData();
    }, []);

    console.log(newAssetsArray);


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
                            <h3>Rs. {totalIncome}</h3>
                            <p>Total Income</p>
                        </div>
                        <FaMoneyBillAlt className="icons" />
                    </div>
                    <div className="graph">
                        <ResponsiveContainer width="100%" height={30}>
                            <AreaChart data={newArray}>
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
                            <h3>Rs. {totalAssets}</h3>
                            <p>Total Assets</p>
                        </div>
                        <FaMoneyBillAlt className='icons' />
                    </div>
                    <div className='graph'>
                        <ResponsiveContainer width="100%" height={30}>
                            <AreaChart data={newAssetsArray}>
                                <Tooltip />
                                <Area type="monotone" dataKey="expance" stroke="#ff7300" fill="#ff7300" />
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
