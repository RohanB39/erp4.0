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
import { collection, getDocs, query, where, getDoc, updateDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
import SalaryPopup from './SalaryPopup/SalaryPopup';
import { Navigate } from 'react-router-dom';
import emailjs from 'emailjs-com';

function Payroll() {
    const [onboardEmployee, setOnboardEmployee] = useState(0);
    const [totalWorkingHours, setTotalWorkingHours] = useState(0);
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const [currentMonthLastDate, setCurrentMonthLastDate] = useState('');
    const [previousMonthLastDate, setPreviousMonthLastDate] = useState('');
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [paidEmployees, setPaidEmployees] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

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

    function convertTo24Hour(time) {
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes, seconds] = timePart.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

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
                    const employeeEmail = employee.personalInfo.personalEmail;
                    console.log("Email: " + employeeEmail);
                    console.log("Employee Id: " + employeeId);
                    const signInOutRef = collection(fireDB, 'EMP_SIGNIN_SIGNOUT');
                    const signInOutDocRef = doc(signInOutRef, employeeId);
                    const signInOutDocSnapshot = await getDoc(signInOutDocRef);
                    let signInOutDays = 0;
                    if (signInOutDocSnapshot.exists()) {
                        const signInOutData = signInOutDocSnapshot.data();
                        console.log(signInOutData);
                        Object.keys(signInOutData).forEach((date) => {
                            const signInOutDate = dayjs(date, 'YYYY-MM-DD');
                            if (signInOutDate.month() === currentMonth && signInOutDate.year() === currentYear) {
                                const entry = signInOutData[date];
                                const signInTime = entry?.signInTime || "00:00:00 AM";
                                const signOutTime = entry?.signOutTime || "00:00:00 PM";
                                console.log("Sign in time " + signInTime);
                                console.log("Sign out time " + signOutTime);
                                const signInDate = new Date(`1970-01-01T${convertTo24Hour(signInTime)}Z`);
                                const signOutDate = new Date(`1970-01-01T${convertTo24Hour(signOutTime)}Z`);
                                const timeDiffMs = signOutDate - signInDate;
                                const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
                                console.log("hours: " + timeDiffHours.toFixed(2));
                                if (timeDiffHours.toFixed(2) < 5) {
                                    signInOutDays += 0;
                                } else if (timeDiffHours.toFixed(2) >= 5 && timeDiffHours.toFixed(2) < 8) {
                                    signInOutDays += 0.5;
                                } else if (timeDiffHours.toFixed(2) >= 8) {
                                    signInOutDays += 1;
                                }
                                // signInOutDays += 1;
                            } else {
                                console.log("No sign in out data found")
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

                    const grossPay = employee.SalaryDetails?.totalFixedPay || 0;
                    const employeePF = employee.SalaryDetails?.employerPF || 0;
                    const gratuity = employee.SalaryDetails?.gratuity || 0;
                    const PM = (grossPay / 12).toFixed(2);
                    const PD = (Number(PM) / 30).toFixed(2);
                    let workingDays = 0;
                    if (authorizedLeaves <= 3) {
                        workingDays = authorizedLeaves + signInOutDays;
                    } else {
                        const takenLeaves = employee.leaves || 0;
                        workingDays = takenLeaves + signInOutDays;
                    }
                    const netPaye = (PD * workingDays).toFixed(2);
                    const deduction = ((employeePF + gratuity) / 12).toFixed(2);

                    const currentDay = dayjs().date();
                    const absentDays = (currentDay - signInOutDays);

                    let status = 'Unpaid';
                    const salaryDetailsRef = doc(fireDB, 'Salary_Details', employeeId);
                    const salaryDocSnapshot = await getDoc(salaryDetailsRef);
                    if (salaryDocSnapshot.exists()) {
                        const salaryData = salaryDocSnapshot.data();
                        const currentMonthh = new Date().getMonth() + 1;
                        const currentYearr = new Date().getFullYear();
                        const currentMonthKey = `${currentYearr}-${String(currentMonthh).padStart(2, '0')}`;
                        // console.log("Current month end date: " + currentMonthKey);
                        if (salaryData[currentMonthKey] && salaryData[currentMonthKey].Status) {
                            status = salaryData[currentMonthKey].Status;
                        }
                    }

                    // Push data into employeesData array
                    employeesData.push({
                        employeeName: `${employee.personalInfo?.firstName || ''} ${employee.personalInfo?.lastName || ''}`,
                        employeeId: employee.employeeId || '',
                        email: employee.personalInfo.personalEmail || '',
                        leaves: totalLeaves,
                        authorizedLeaves,
                        signInOutDays,
                        workingDays,
                        PM,
                        absentDays,
                        netPaye,
                        deduction,
                        netPay: 0,
                        status,
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
            accessor: 'authorizedLeaves',
            Cell: ({ value }) => (
                <span>{value} &nbsp;Leaves</span>
            )
        },
        {
            Header: 'Paid Leaves',
            accessor: 'leaves',
            Cell: ({ value }) => (
                <span>{value} &nbsp;Leaves</span>
            )
        },
        {
            Header: 'Unpaid Leaves',
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
            accessor: 'signInOutDays',
            Cell: ({ value }) => (
                <span>{value} &nbsp;Days</span>
            )
        },
        {
            Header: 'Exception Days',
            accessor: 'absentDays',
            Cell: ({ value }) => (
                <span>{value} &nbsp;Days</span>
            )
        },
        {
            Header: 'Payable Days',
            accessor: 'workingDays',
            Cell: ({ value }) => (
                <span>{value} &nbsp;Days</span>
            )
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
            Header: 'Deduction',
            accessor: 'deduction',
            Cell: ({ value }) => (
                <span style={{ color: 'red' }}>
                    <BiRupee /> {value}
                </span>
            )
        },
        {
            Header: 'Net Pay',
            accessor: 'netPaye',
            Cell: ({ value }) => (
                <span style={{ color: 'green' }}>
                    <BiRupee /> {value}
                </span>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row, value }) => {
                const statusClass = value === 'Paid' ? 'status-paid' : 'status-unpaid';
                const handleClick = () => {
                    if (value !== 'Paid') {
                        setSelectedRow(row.original);
                        setShowPopup(true);
                    }
                };
                return (
                    <span className={statusClass} onClick={handleClick} style={{ cursor: 'pointer' }}>
                        {value}
                    </span>
                );
            }
        }
    ], []);

    useEffect(() => {
        // Filter employees with "Paid" status
        const filteredEmployees = data.filter(employee => employee.status === 'Paid');
        setPaidEmployees(filteredEmployees);
    }, [data]);

    const handlePayClick = () => {
        setIsPopupVisible(true);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
    };

    const totalGrossPay = data.reduce((total, item) => total + parseFloat(item.PM || 0), 0);
    const formattedTotal = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(totalGrossPay);

    const totalNetPay = data.reduce((total, item) => total + parseFloat(item.netPaye || 0), 0);
    const formattednetPay = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(totalNetPay);

    const totaldeduction = data.reduce((total, item) => total + parseFloat(item.deduction || 0), 0);
    const formattedDeduction = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(totaldeduction);

    const handleSendEmail = () => {
        // Get the current year and month
        const currentDate = new Date();
        const currentYearr = currentDate.getFullYear();  // Get current year
        const currentMonth = currentDate.getMonth() + 1; // Get current month (1-12)
    
        const emailData = paidEmployees.map(employee => ({
            name: employee.employeeName,
            id: employee.employeeId,
            email: employee.email,
            leaves: employee.leaves,
            authorizedLeaves: employee.authorizedLeaves,
            workingDays: employee.workingDays,
            absentDays: employee.absentDays,
            GrossSalary: employee.PM,
            netPaye: employee.netPaye,
            status: employee.status
        }));
    
        emailData.forEach(async (employee) => {
            const templateParams = {
                to_name: employee.email, // recipient email address
                name: employee.name,
                id: employee.id,
                leaves: employee.leaves,
                authorizedLeaves: employee.authorizedLeaves,
                workingDays: employee.workingDays,
                absentDays: employee.absentDays,
                GrossSalary: employee.GrossSalary,
                netPaye: employee.netPaye,
                status: employee.status,
            };
    
            try {
                // Send the email using EmailJS
                await emailjs.send('service_o2439vh', 'template_na8e8om', templateParams, 'P8CxtoSj7N9TPkNkQ');
                console.log('Email sent successfully!');
    
                // Reference to the Salary_Details document
                const salaryDetailsRef = doc(fireDB, 'Salary_Details', employee.id);
    
                // Fetch the document to check if the "year-month" reference object exists
                const salaryDetailsSnapshot = await getDoc(salaryDetailsRef);
    
                if (salaryDetailsSnapshot.exists()) {
                    // Get the document data
                    const salaryData = salaryDetailsSnapshot.data();
    
                    // Construct the year-month key
                    const yearMonthKey = `${currentYearr}-${String(currentMonth).padStart(2, '0')}`;
    
                    // Check if the year-month object exists
                    if (salaryData[yearMonthKey]) {
                        // If the year-month object exists, update the Status field
                        await updateDoc(salaryDetailsRef, {
                            [`${yearMonthKey}.Status`]: 'Sent',
                        });
    
                        console.log('Status updated successfully');
                    } else {
                        console.log(`The year-month ${yearMonthKey} does not exist in the document`);
                    }
                } else {
                    console.log('Salary details document not found');
                }
    
                alert('Email sent and status updated successfully!');
            } catch (err) {
                console.error('Error sending email:', err);
                alert('Failed to send email. Please try again.');
            }
        });
    };
    
    

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
                                        <h2> <span>Rs.</span> {formattedTotal} <span>/-</span></h2>
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
                                        <h2>{formattednetPay}</h2>
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
                                        <h2 className='ded'>{formattedDeduction}</h2>
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
                            <div className="payroll-btn">
                                <button onClick={handlePayClick}>Pay</button>
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
            {showPopup && (
                <SalaryPopup
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    selectedRow={selectedRow}
                />
            )}

            {isPopupVisible && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Paid Employee Emails</h3>
                        <ul>
                            {paidEmployees.map(employee => (
                                <li key={employee.email}>{employee.email}</li>
                            ))}
                        </ul>
                        <button onClick={handleSendEmail}>Send</button>
                        <button onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Payroll;
