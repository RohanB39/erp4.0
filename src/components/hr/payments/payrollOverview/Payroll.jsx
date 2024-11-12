import React, { useMemo, useEffect, useState } from 'react';
import './payrollTable.css';
import { FaUsers } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { BiRupee } from "react-icons/bi";
import { IoWalletOutline } from "react-icons/io5";
import { CiWallet } from "react-icons/ci";
import PayRollEmpList from './PayRollEmpList';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
const data = [
    {
        employee: 'Amit Sharma',
        employeeNo: '001',
        paidHours: '160',
        grossPay: '2000',
        statutoryPay: '200',
        deduction: '100',
        netPay: '1700',
        status: 'Paid',
        paySlip: 'View'
    },
    {
        employee: 'Neha Gupta',
        employeeNo: '002',
        paidHours: '158',
        grossPay: '1980',
        statutoryPay: '195',
        deduction: '90',
        netPay: '1695',
        status: 'Paid',
        paySlip: 'View'
    },
    {
        employee: 'Rajesh Kumar',
        employeeNo: '003',
        paidHours: '162',
        grossPay: '2040',
        statutoryPay: '210',
        deduction: '110',
        netPay: '1730',
        status: 'Paid',
        paySlip: 'View'
    },
    {
        employee: 'Priya Singh',
        employeeNo: '004',
        paidHours: '160',
        grossPay: '2000',
        statutoryPay: '200',
        deduction: '100',
        netPay: '1700',
        status: 'Paid',
        paySlip: 'View'
    },
    {
        employee: 'Vikram Patel',
        employeeNo: '005',
        paidHours: '159',
        grossPay: '1990',
        statutoryPay: '198',
        deduction: '95',
        netPay: '1697',
        status: 'Paid',
        paySlip: 'View'
    },
    {
        employee: 'Anjali Desai',
        employeeNo: '006',
        paidHours: '161',
        grossPay: '2010',
        statutoryPay: '202',
        deduction: '105',
        netPay: '1703',
        status: 'Paid',
        paySlip: 'View'
    },
    {
        employee: 'Ravi Nair',
        employeeNo: '007',
        paidHours: '160',
        grossPay: '2000',
        statutoryPay: '200',
        deduction: '100',
        netPay: '1700',
        status: 'Un Paid',
        paySlip: 'View'
    },
    {
        employee: 'Kiran Joshi',
        employeeNo: '008',
        paidHours: '158',
        grossPay: '1980',
        statutoryPay: '195',
        deduction: '90',
        netPay: '1695',
        status: 'Paid',
        paySlip: 'View'
    },
    {
        employee: 'Suresh Menon',
        employeeNo: '009',
        paidHours: '162',
        grossPay: '2040',
        statutoryPay: '210',
        deduction: '110',
        netPay: '1730',
        status: 'Paid',
        paySlip: 'View'
    },
    {
        employee: 'Lakshmi Iyer',
        employeeNo: '010',
        paidHours: '160',
        grossPay: '2000',
        statutoryPay: '200',
        deduction: '100',
        netPay: '1700',
        status: 'Un Paid',
        paySlip: 'View'
    },
    {
        employee: 'Rohan Mehta',
        employeeNo: '011',
        paidHours: '159',
        grossPay: '1990',
        statutoryPay: '198',
        deduction: '95',
        netPay: '1697',
        status: 'Paid',
        paySlip: 'View'
    },
    {

        employee: 'Meena Rao',
        employeeNo: '012',
        paidHours: '161',
        grossPay: '2010',
        statutoryPay: '202',
        deduction: '105',
        netPay: '1703',
        status: 'Un Paid',
        paySlip: 'View'
    }
];

function Payroll() {
    const [onboardEmployee, setOnboardEmployee] = useState(0);
    const [totalWorkingHours, setTotalWorkingHours] = useState(0);
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const [currentMonthLastDate, setCurrentMonthLastDate] = useState('');
    const [previousMonthLastDate, setPreviousMonthLastDate] = useState('');
    useEffect(() => {
        const fetchEmployeesCount = async () => {
            try {
                const employeesQuery = query(
                    collection(fireDB, "employees"),
                    where("Status", "==", "Onboarded")
                );
                const querySnapshot = await getDocs(employeesQuery);
                setOnboardEmployee(querySnapshot.size);
            } catch (error) {
                console.error("Error fetching employees: ", error);
            }
        };

        fetchEmployeesCount();
    }, []);

    useEffect(() => {
        const calculateWorkingHours = async () => {
            try {
                const signinCollection = collection(fireDB, "EMP_SIGNIN_SIGNOUT");
                const querySnapshot = await getDocs(signinCollection);
                let totalHours = 0;

                const currentMonth = new Date().getMonth() + 1;
                const currentYear = new Date().getFullYear();

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    Object.keys(data).forEach((date) => {
                        const [year, month] = date.split("-").map(Number);
                        if (year === currentYear && month === currentMonth) {
                            const { signInTime, signOutTime } = data[date];
                            const hours = calculateTimeDifference(signInTime, signOutTime);
                            totalHours += hours;
                        }
                    });
                });

                setTotalWorkingHours(totalHours);
            } catch (error) {
                console.error("Error calculating working hours: ", error);
            }
        };

        calculateWorkingHours();
    }, []);

    const calculateTimeDifference = (signIn, signOut) => {
        const [signInTime, signInPeriod] = signIn.split(" ");
        const [signOutTime, signOutPeriod] = signOut.split(" ");

        const [signInHour, signInMinute, signInSecond] = signInTime.split(":").map(Number);
        const [signOutHour, signOutMinute, signOutSecond] = signOutTime.split(":").map(Number);

        let signInDate = new Date();
        signInDate.setHours(
            signInPeriod === "PM" && signInHour !== 12 ? signInHour + 12 : signInHour,
            signInMinute,
            signInSecond
        );

        let signOutDate = new Date();
        signOutDate.setHours(
            signOutPeriod === "PM" && signOutHour !== 12 ? signOutHour + 12 : signOutHour,
            signOutMinute,
            signOutSecond
        );

        const differenceMs = signOutDate - signInDate;
        const hours = differenceMs / (1000 * 60 * 60);
        return hours > 0 ? hours : 0;
    };

    useEffect(() => {
        const calculateMonthEndDates = () => {
            // Last day of the current month
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);
            setCurrentMonthLastDate(
                `${currentMonthEnd.getDate()}/${currentMonthEnd.getMonth() + 1}/${currentMonthEnd.getFullYear()}`
            );

            // Last day of the previous month
            const previousMonthEnd = new Date(currentYear, currentMonth, 0);
            setPreviousMonthLastDate(
                `${previousMonthEnd.getDate()}/${previousMonthEnd.getMonth() + 1}/${previousMonthEnd.getFullYear()}`
            );
        };
        calculateMonthEndDates();
    }, []);

    const columns = useMemo(
        () => [

            {
                Header: 'Employee',
                accessor: 'employee'
            },
            {
                Header: 'Employee No',
                accessor: 'employeeNo'
            },
            {
                Header: 'Paid Hours',
                accessor: 'paidHours',
                Cell: ({ value }) => (
                    <span>
                        <BiRupee /> {value}
                    </span>
                )
            },
            {
                Header: 'Gross Pay',
                accessor: 'grossPay',
                Cell: ({ value }) => (
                    <span>
                        <BiRupee /> {value}
                    </span>
                )
            },
            {
                Header: 'Statutory Pay',
                accessor: 'statutoryPay',
                Cell: ({ value }) => (
                    <span>
                        <BiRupee /> {value}
                    </span>
                )
            },
            {
                Header: 'Deduction',
                accessor: 'deduction',
                Cell: ({ value }) => (
                    <span>
                        <BiRupee /> {value}
                    </span>
                )
            },
            {
                Header: 'Net Pay',
                accessor: 'netPay',
                Cell: ({ value }) => {
                    const netPayClass = value >= 1700 ? 'net-pay-positive' : 'net-pay-negative';
                    return (
                        <span className={netPayClass}>
                            <BiRupee /> {value}
                        </span>
                    );
                }
            },
            {
                Header: 'Status',
                accessor: 'status',
                Cell: ({ value }) => {
                    const statusClass = value === 'Paid' ? 'status-paid' : 'status-unpaid';
                    return <span className={statusClass}>{value}</span>;
                }
            },
            {
                Header: 'Pay Slip',
                accessor: 'paySlip',
                Cell: ({ value }) => <button className='payroll-btn'>{value}</button>
            }
        ],
        []
    );

    return (
        <main className='main' id='main'>
            <div className="payroll-title">
                <h3>Payroll Overview</h3>
            </div>
            <div className="payroll-section">
                <div className="payroll-container">
                    <div className="left-container">
                        <div className="top-cards">
                            <div className="single-card">
                                <h3>Total Employees</h3>
                                <div className='d-flex'>
                                    <div>
                                        <h2>{onboardEmployee}</h2>
                                        <p>Total Onboarded Employees</p>
                                    </div>
                                    <div className='icon'>
                                        <FaUsers />
                                    </div>
                                </div>
                            </div>
                            <div className="single-card">
                                <h3>Total Working Hours</h3>
                                <div className='d-flex'>
                                    <div>
                                        <h2>{totalWorkingHours.toFixed(2)} <span>hrs</span></h2>
                                        <p>Total Working Hours In {currentMonth}</p>
                                    </div>
                                    <div className='icon'>
                                        <MdOutlineAccessTimeFilled />
                                    </div>
                                </div>
                            </div>
                            <div className="single-card">
                                <h3>Payroll Cost</h3>
                                <div className='d-flex'>
                                    <div>
                                        <h2> <span>Rs.</span> 122 <span>/-</span></h2>
                                        <p>-2% since Last Quarter</p>
                                    </div>
                                    <div className='icon'>
                                        <RiMoneyRupeeCircleFill />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bottom-cards">
                            <div className="single-card">
                                <h3>Net Salary</h3>
                                <div className='d-flex'>
                                    <div>
                                        <h2>122</h2>
                                        <p>-2% since Last Quarter</p>
                                    </div>
                                    <div className='icon'>
                                        <IoWalletOutline />
                                    </div>
                                </div>
                            </div>
                            <div className="single-card">
                                <h3>Deduction</h3>
                                <div className='d-flex'>
                                    <div>
                                        <h2>122</h2>
                                        <p>-2% since Last Quarter</p>
                                    </div>
                                    <div className='icon'>
                                        <BiRupee />
                                    </div>
                                </div>
                            </div>
                            <div className="single-card">
                                <h3>Statutory Pay</h3>
                                <div className='d-flex'>
                                    <div>
                                        <h2>122</h2>
                                        <p>-2% since Last Quarter</p>
                                    </div>
                                    <div className='icon'>
                                        <BiRupee />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="middle-container">
                        <div className="middle-container-content">
                            <div className="icon">
                                <CiWallet />
                            </div>
                            <h2>Payroll Date</h2>
                            <h3>{currentMonthLastDate}</h3>
                            <p>Payroll Run :- {previousMonthLastDate} - {currentMonthLastDate}</p>
                            <div className="payroll-btn">
                                <button>Payroll Details</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="employee-payroll-container">
                    <div className="employee-payroll-title">
                        <h3>Employee Payroll</h3>
                    </div>
                    <div className="employee-payroll-search">
                        <input type="text" placeholder='Search For Employee' />
                        <button className='search-btn'>Search</button>
                    </div>
                    <div className="employee-payroll-list">
                        <PayRollEmpList columns={columns} data={data} />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Payroll;
