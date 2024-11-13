import React, { useMemo, useEffect, useState } from 'react';
import './payrollTable.css';
import { FaUsers } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { BiRupee } from "react-icons/bi";
import { IoWalletOutline } from "react-icons/io5";
import { CiWallet } from "react-icons/ci";
import PayRollEmpList from './PayRollEmpList';
import { fireDB, doc } from '../../../firebase/FirebaseConfig';
import { collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import dayjs from 'dayjs';

function Payroll() {
    const [onboardEmployee, setOnboardEmployee] = useState(0);
    const [totalWorkingHours, setTotalWorkingHours] = useState(0);
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const [currentMonthLastDate, setCurrentMonthLastDate] = useState('');
    const [previousMonthLastDate, setPreviousMonthLastDate] = useState('');
    const [data, setData] = useState([]);
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

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employeesRef = collection(fireDB, 'employees');
                const q = query(employeesRef, where("Status", "==", "Onboarded"));
                const querySnapshot = await getDocs(q);
                const currentMonth = dayjs().month();
                const currentYear = dayjs().year();
                const employeesData = [];
                for (const docSnapshot of querySnapshot.docs) {
                    const employee = docSnapshot.data();
                    const employeeId = employee.employeeId;
                    console.log("Employee Id: " + employeeId);

                    const signInOutRef = collection(fireDB, 'EMP_SIGNIN_SIGNOUT');
                    const signInOutDocRef = doc(signInOutRef, employeeId);
                    const signInOutDocSnapshot = await getDoc(signInOutDocRef);
                    let signInOutDays = 0;
                    if (signInOutDocSnapshot.exists()) {
                        const signInOutData = signInOutDocSnapshot.data();
                        
                        Object.keys(signInOutData).forEach((date) => {
                            const signInOutDate = dayjs(date, 'YYYY-MM-DD');
                            console.log("Signin Date: ", signInOutDate.format('YYYY-MM-DD'));
                            
                            if (signInOutDate.month() === currentMonth && signInOutDate.year() === currentYear) {
                                signInOutDays += 1;
                            }
                        });
                    } else {
                        console.log("No sign-in/out data found for employeeId:", employeeId);
                    }
                    const totalLeaves = employee.LeaveApplications
                        ? Object.values(employee.LeaveApplications).reduce((acc, leave) => {
                            const leaveDate = dayjs(leave.fromDate);
                            if (leaveDate.month() === currentMonth && leaveDate.year() === currentYear) {
                                return acc + (leave.daysRequested || 0);
                            }
                            return acc;
                        }, 0)
                        : 0;

                    // Calculate authorized leaves
                    const authorizedLeaves = employee.leaveInfo
                        ? (() => {
                            const startDate = employee.leaveInfo.StartDate;
                            const endDate = employee.leaveInfo.EndDate;
                            const [startDay, startMonth, startYear] = startDate.split("-");
                            const [endDay, endMonth, endYear] = endDate.split("-");
                            const currentDate = dayjs();
                            const currentMonth = currentDate.month() + 1;
                            const currentYear = currentDate.year();

                            let isCurrentMonthInRange = false;

                            if (employee.leaveInfo.leaveFrequency === "Monthly") {
                                isCurrentMonthInRange = (startMonth == currentMonth || endMonth == currentMonth);
                            } else if (employee.leaveInfo.leaveFrequency === "Yearly") {
                                isCurrentMonthInRange = (startMonth == currentMonth && startYear == currentYear) ||
                                    (endMonth == currentMonth && endYear == currentYear + 1);
                            }

                            return isCurrentMonthInRange ? (employee.leaveInfo.approvedLeaves || 0) : 0;
                        })()
                        : 0;
                    
                    const grossPay = employee.SalaryDetails?.totalCTC || 0;
                    const PM = (grossPay / 12).toFixed(2);

                    // Push data into employeesData array
                    employeesData.push({
                        employeeName: `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`,
                        employeeId: employee.employeeId || '',
                        leaves: totalLeaves,
                        authorizedLeaves,
                        signInOutDays,
                        workingDays: 0,
                        PM, 
                        statutoryPay: 0,
                        deduction: 0,
                        netPay: 0,
                        status: employee.Status || 'Unpaid'
                    });
                }

                setData(employeesData);
            } catch (error) {
                console.error("Error fetching employee data: ", error);
            }
        };

        fetchEmployees();
    }, []);



    const columns = useMemo(() => [
        {
            Header: 'Employee',
            accessor: 'employeeName'
        },
        {
            Header: 'Employee ID',
            accessor: 'employeeId'
        },
        {
            Header: 'Approved Leaves',
            accessor: 'authorizedLeaves'
        },
        {
            Header: 'Taken Leaves',
            accessor: 'leaves'
        },
        {
            Header: 'Extra Leaves',
            accessor: '',
            Cell: ({ row }) => {
                const takenLeaves = row.original.leaves || 0;
                const approvedLeaves = row.original.authorizedLeaves || 0;
                const extraLeaves = takenLeaves > approvedLeaves ? takenLeaves - approvedLeaves : 0;
                row.original.extraLeaves = extraLeaves; 
                return <span>{extraLeaves}</span>;
            }
        },
        {
            Header: 'Working Days',
            accessor: 'signInOutDays'
        },
        {
            Header: 'Exception Days',
            accessor: 'absentDays',
            Cell: ({ row }) => {
                const signInOutDays = row.original.signInOutDays || 0;
                const currentDay = dayjs().date(); 
                const extraLeaves = row.original.extraLeaves || 0;
                const absentDays = (currentDay - signInOutDays);
                return <span>{absentDays}</span>;
            }
        },
        {
            Header: 'Payable Days',
            accessor: 'workingDays',
            Cell: ({ row }) => {
                let authorizedLeaves = row.original.authorizedLeaves || 0;
                if(authorizedLeaves <= 3) {
                    const workingDays = row.original.signInOutDays || 0;
                    const payableDays = authorizedLeaves + workingDays;
                    return <span>{payableDays}</span>;
                }else {
                    const takenLeaves = row.original.leaves || 0;
                    const workingDays = row.original.signInOutDays || 0;
                    const payableDays = takenLeaves + workingDays;
                    return <span>{payableDays}</span>;
                }
                
            }
        },
        {
            Header: 'Gross Pay',
            accessor: 'PM',
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
            accessor: 'paySlipButton',
            Cell: ({ row }) => (
                <button className='payroll-btn' disabled={row.original.status !== 'Paid'}>
                    Generate Pay Slip
                </button>
            )
        }
    ], []);


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
