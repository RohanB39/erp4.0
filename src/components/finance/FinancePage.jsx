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

    const [dataIncome, setDataIncome] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    let newArray = Object.values(dataIncome);
    newArray.unshift({ name: 'dummy', income: 0 });

    const [dataAssets, setDataAssets] = useState([]);
    const [totalAssets, setTotalAssets] = useState(0);
    let newAssetsArray = Object.values(dataAssets);
    newAssetsArray.unshift({ name: 'dummy', expence: 0 });

    const [dataExpence, setDataExpence] = useState([]);
    const [totalExpance, setTotalExpance] = useState(0);
    let newExpanceArray = Object.values(dataExpence);
    newExpanceArray.unshift({ name: 'dummy', expence: 0 });

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

    const currentMonth = new Date().getMonth() + 1;
    const previousMonth = currentMonth - 1;
    const currentMonthIncome = newArray.find(item => parseInt(item.name) === currentMonth)?.income || 0;
    const previousMonthIncome = newArray.find(item => parseInt(item.name) === previousMonth)?.income || 0;
    const incomeDifference = currentMonthIncome - previousMonthIncome;
    const incomePercentageChange = previousMonthIncome > 0 ? ((incomeDifference / previousMonthIncome) * 100).toFixed(2) : 0;
    const incomeChangeIndicator = incomeDifference >= 0 ? `(+${incomePercentageChange}%)` : `(${incomePercentageChange}%)`;

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

    useEffect(() => {
        // Function to fetch the Material Expences
        const fetchMaterialExpences = async () => {
            try {
                const dispatchInvoicesRef = collection(fireDB, 'Items');
                const querySnapshot = await getDocs(dispatchInvoicesRef);
                const dispatchSnapshot = querySnapshot.docs.filter(doc =>
                    doc.data().status.includes('Stored')
                );

                // Temporary object to store the sum of expence per month
                const incomeByMonth = {
                    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0,
                    '11': 0, '12': 0
                };

                dispatchSnapshot.forEach(doc => {
                    const invoiceData = doc.data();
                    const invoiceDate = invoiceData.GRNDate;
                    const total = parseFloat(invoiceData.GrnInvoicePrice);


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
                    expenc: incomeByMonth[month],
                }));

                setDataExpence(updatedDataIncome);

                // Calculate total income from all months
                const total = Object.values(incomeByMonth).reduce((acc, curr) => acc + curr, 0);
                setTotalExpance(total);

            } catch (error) {
                console.error('Error calculating income:', error);
            }
        };
        fetchMaterialExpences();
    }, []);

    const [paymentData, setPaymentData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPayments, setFilteredPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const combinedData = [];

                // Fetching Purchase Orders with status "Stored"
                const purchaseOrdersRef = collection(fireDB, 'Purchase_Orders');
                const poQuery = query(purchaseOrdersRef, where('status', '==', 'Stored'));
                const poSnapshot = await getDocs(poQuery);

                poSnapshot.forEach(doc => {
                    const poData = doc.data();
                    combinedData.push({
                        type: 'purchase_order',
                        materialName: poData.materialName,
                        date: poData.poDate,
                        price: poData.GrnInvoicePrice,
                    });
                });

                // Fetching Dispatch Invoices with invStatus "Dispatched"
                const dispatchInvoicesRef = collection(fireDB, 'Dispatch_Invoices');
                const dispatchQuery = query(dispatchInvoicesRef, where('invStatus', '==', 'Dispatched'));
                const dispatchSnapshot = await getDocs(dispatchQuery);

                dispatchSnapshot.forEach(doc => {
                    const dispatchData = doc.data();
                    combinedData.push({
                        type: 'dispatch_invoice',
                        customer: dispatchData.customer,
                        date: dispatchData.invoiceDate,
                        total: dispatchData.total,
                    });
                });

                // Sorting the data by date in descending order (most recent first)
                combinedData.sort((a, b) => new Date(b.date) - new Date(a.date));

                setPaymentData(combinedData);
                setFilteredPayments(combinedData);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };

        fetchPayments();
    }, []);

    useEffect(() => {
        // Filter payments based on search query
        const filtered = paymentData.filter(payment =>
            (payment.customer && payment.customer.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (payment.materialName && payment.materialName.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        setFilteredPayments(filtered); // Update filteredPayments state
    }, [searchQuery, paymentData]);



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
                                <h3>Rs. {currentMonthIncome.toLocaleString()}</h3>
                                <span>Rs. {Math.abs(incomeDifference).toLocaleString()} {incomeChangeIndicator}</span>
                            </div>
                            <div className='stats'>
                                {/* <GiReceiveMoney className='icon' /> */}
                                <div>
                                    <h2>Rs. {totalAssets}</h2>
                                    <span>Total Investment</span>
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
                            <h3>Rs. {totalExpance}</h3>
                            <p>Total Expend</p>
                        </div>
                        <FaMoneyBillAlt className='icons' />
                    </div>
                    <div className='graph'>
                        <ResponsiveContainer width="100%" height={30}>
                            <AreaChart data={dataExpence}>
                                <Tooltip />
                                <Area type="monotone" dataKey="expenc" stroke="#82ca9d" fill="#82ca9d" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="single-card">
                    <div className="icon">
                        <div>
                            <h3>Rs. {{totalIncome} - {totalExpance}}</h3>
                            <p>Total Profit</p>
                        </div>
                        <FaMoneyBillAlt className='icons' />
                    </div>
                    <div className='graph'>
                        <ResponsiveContainer width="100%" height={30}>
                            <AreaChart>
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
                        <input
                            type="text"
                            placeholder='Search Payment'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="payment-list">
                        {filteredPayments.map((payment, index) => (
                            <div className='single-payment' key={index}>
                                <div>
                                    <h3>
                                        {payment.type === 'purchase_order' ? payment.materialName : payment.customer}
                                    </h3>
                                    <p>{payment.date}</p>
                                </div>
                                <div>
                                    <h5 style={{ color: payment.type === 'purchase_order' ? 'red' : 'green' }}>
                                        {payment.type === 'purchase_order' ? `- Rs. ${payment.price}` : `+ Rs. ${payment.total}`}
                                    </h5>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default FinancePage;
