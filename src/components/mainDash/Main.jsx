import React, { useMemo, useState, useEffect } from 'react';
import './main.css';
import { useTable, usePagination } from 'react-table';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaMoneyBillAlt } from "react-icons/fa";
import { AiOutlineCalendar } from 'react-icons/ai';
import { auth, fireDB } from '../firebase/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const dataMoneyFlow = [
    { name: 'Jan', Internet: 164, Health: 128, Food: 210, Shopping: 180, Vacation: 300 },
    { name: 'Feb', Internet: 200, Health: 150, Food: 220, Shopping: 190, Vacation: 320 },
    { name: 'Mar', Internet: 180, Health: 140, Food: 200, Shopping: 170, Vacation: 310 },
    { name: 'Apr', Internet: 220, Health: 160, Food: 230, Shopping: 200, Vacation: 340 },
    { name: 'May', Internet: 210, Health: 155, Food: 225, Shopping: 195, Vacation: 330 },
    { name: 'Jun', Internet: 230, Health: 170, Food: 240, Shopping: 210, Vacation: 350 },
    { name: 'Jul', Internet: 240, Health: 180, Food: 250, Shopping: 220, Vacation: 360 },
];

const getGreeting = () => {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 5 && hours < 12) {
        return "Good Morning";
    } else if (hours >= 12 && hours < 17) {
        return "Good Afternoon";
    } else if (hours >= 17 && hours < 21) {
        return "Good Evening";
    } else {
        return "Good Night";
    }
};

function Main() {
    const [companyName, setUserName] = useState('');
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userDoc = await getDoc(doc(fireDB, 'users', user.uid));

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserName(userData.companyName || 'John');
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                console.log('No user is signed in.');
            }
        };

        fetchUserData();
    }, []);

    const data = useMemo(
        () => [
            {
                orderId: 'ORD001',
                category: 'Electronics',
                shippingDate: '2024-07-26',
                departure: 'New York',
                destination: 'San Francisco',
                weight: '5kg',
                status: 'Delivered'
            },
            {
                orderId: 'ORD002',
                category: 'Clothing',
                shippingDate: '2024-07-26',
                departure: 'Los Angeles',
                destination: 'Chicago',
                weight: '2kg',
                status: 'In Transit'
            },
            {
                orderId: 'ORD003',
                category: 'Books',
                shippingDate: '2024-07-26',
                departure: 'Miami',
                destination: 'Dallas',
                weight: '1kg',
                status: 'Pending'
            },
            {
                orderId: 'ORD004',
                category: 'Home Appliances',
                shippingDate: '2024-07-26',
                departure: 'Houston',
                destination: 'Seattle',
                weight: '10kg',
                status: 'Delivered'
            },
            {
                orderId: 'ORD005',
                category: 'Toys',
                shippingDate: '2024-07-26',
                departure: 'Boston',
                destination: 'Denver',
                weight: '3kg',
                status: 'Cancelled'
            },
            {
                orderId: 'ORD006',
                category: 'Furniture',
                shippingDate: '2024-07-26',
                departure: 'San Diego',
                destination: 'Phoenix',
                weight: '20kg',
                status: 'In Transit'
            },
            {
                orderId: 'ORD007',
                category: 'Groceries',
                shippingDate: '2024-07-26',
                departure: 'Philadelphia',
                destination: 'Las Vegas',
                weight: '8kg',
                status: 'Delivered'
            },
            {
                orderId: 'ORD008',
                category: 'Beauty Products',
                shippingDate: '2024-07-26',
                departure: 'San Antonio',
                destination: 'San Jose',
                weight: '1.5kg',
                status: 'Pending'
            },
            {
                orderId: 'ORD009',
                category: 'Sporting Goods',
                shippingDate: '2024-07-26',
                departure: 'Dallas',
                destination: 'Columbus',
                weight: '7kg',
                status: 'In Transit'
            },
            {
                orderId: 'ORD010',
                category: 'Automotive',
                shippingDate: '2024-07-26',
                departure: 'Austin',
                destination: 'Charlotte',
                weight: '15kg',
                status: 'Cancelled'
            },
            {
                orderId: 'ORD011',
                category: 'Jewelry',
                shippingDate: '2024-07-26',
                departure: 'San Francisco',
                destination: 'Indianapolis',
                weight: '0.5kg',
                status: 'Delivered'
            },
            {
                orderId: 'ORD012',
                category: 'Health Products',
                shippingDate: '2024-07-26',
                departure: 'Fort Worth',
                destination: 'Jacksonville',
                weight: '3kg',
                status: 'Pending'
            }
        ],
        []
    );

    const columns = useMemo(
        () => [
            {
                Header: 'Order ID',
                accessor: 'orderId'
            },
            {
                Header: 'Category',
                accessor: 'category'
            },
            {
                Header: 'Shipping Date',
                accessor: 'shippingDate'
            },
            {
                Header: 'Departure',
                accessor: 'departure'
            },
            {
                Header: 'Destination',
                accessor: 'destination'
            },
            {
                Header: 'Weight',
                accessor: 'weight'
            },
            {
                Header: 'Status',
                accessor: 'status'
            }
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state: { pageIndex },
        prepareRow
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 }
        },
        usePagination
    );

    const [startDate, setStartDate] = useState(new Date());

    return (
        <div id='main' className='main'>
            <div className="mainDashContainer">
                <div className="dashHeader">
                    <p>Hello {companyName}</p>
                    <h3>{getGreeting()}</h3>
                </div>
                <div className="mainDashInfoCards">
                    <div className="singleCard">
                        <div className="topSide">
                            <p>Total Delivered</p>
                        </div>
                        <h3>12121</h3>
                        <small>-200 vs last month</small>
                    </div>
                    <div className="singleCard">
                        <div className="topSide">
                            <p>On Delivery</p>
                        </div>
                        <h3>12121</h3>
                        <small>-200 vs last month</small>
                    </div>
                    <div className="singleCard">
                        <div className="topSide">
                            <p>Cancel Delivery</p>
                        </div>
                        <h3>12121</h3>
                        <small>-200 vs last month</small>
                    </div>
                    <div className="singleCard">
                        <div className="topSide">
                            <p>Return Delivery</p>
                        </div>
                        <h3>12121</h3>
                        <small>-200 vs last month</small>
                    </div>
                </div>
                <div className="mainDash-graph-container">
                    <div className="graph-container">
                        <div className="mainDash-graph-header">
                            <h3>Money Flow</h3>
                            <p>Cost and Usage</p>
                        </div>
                        <div className="mainDash-graph-body">
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
                            <h3>Shipping Revenue</h3>
                        </div>
                        <div className="payment-serch">
                            <input type="text" placeholder='Search Payment' />
                            <div className="calendar">
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
                                    <h3>Shipping Payment</h3>
                                    <p>07/02/2014</p>
                                </div>
                                <div>
                                    <h5>+$24</h5>
                                    <p>21:43pm</p>
                                </div>
                            </div>
                            <div className='single-payment'>
                                <div>
                                    <h3>Shipping Payment</h3>
                                    <p>07/02/2014</p>
                                </div>
                                <div>
                                    <h5>+$24</h5>
                                    <p>21:43pm</p>
                                </div>
                            </div>
                            <div className='single-payment'>
                                <div>
                                    <h3>Shipping Payment</h3>
                                    <p>07/02/2014</p>
                                </div>
                                <div>
                                    <h5>+$24</h5>
                                    <p>21:43pm</p>
                                </div>
                            </div>
                            <div className='single-payment'>
                                <div>
                                    <h3>Shipping Payment</h3>
                                    <p>07/02/2014</p>
                                </div>
                                <div>
                                    <h5>+$24</h5>
                                    <p>21:43pm</p>
                                </div>
                            </div>
                            <div className='single-payment'>
                                <div>
                                    <h3>Shipping Payment</h3>
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

                <div className="data-table-container">
                    <div>
                        <h4>Shipping Details</h4>
                    </div>
                    <div className='data-table'>
                        <table {...getTableProps()} className="table">
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {page.map(row => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination">
                        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                            {'<'}
                        </button>
                        <span>
                            {pageIndex + 1} of {pageOptions.length}
                        </span>
                        <button onClick={() => nextPage()} disabled={!canNextPage}>
                            {'>'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;