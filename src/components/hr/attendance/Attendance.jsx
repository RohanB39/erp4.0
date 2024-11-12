import React, { useState, useEffect, useMemo } from 'react';
import './attendance.css';
import { IoMdListBox, IoMdTime } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { FaBullhorn, FaLongArrowAltRight } from "react-icons/fa";
import { LuArrowDownRightSquare, LuArrowUpRightSquare } from "react-icons/lu";
import { CiExport, CiSearch } from "react-icons/ci";
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import CalendarButton from '../../calenderButton/CalenderButton';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import dayjs from "dayjs";

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const currentDate = new Date().toISOString().split('T')[0];
    const [today, setToday] = useState('');
    const [onboardEmployee, setOnboardEmployee] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);
    const [persentCount, setPersentCount] = useState(0);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       window.location.reload();
    //     }, 2000);
    //     return () => clearInterval(interval);
    //   }, []);

    const fetchAttendanceData = async () => {
        try {
            const attendanceCollectionRef = collection(fireDB, 'EMP_SIGNIN_SIGNOUT');
            const snapshot = await getDocs(attendanceCollectionRef);
            const data = [];

            snapshot.forEach(doc => {
                const docId = doc.id;
                const parts = docId.split(' '); // Split by space
                const employeeName = parts.slice(0, -1).join(' ');
                const date = parts[parts.length - 1]; // The last part is the date

                if (date === currentDate) {
                    const attendanceRecord = {
                        id: docId,
                        emp_name: employeeName,
                        position: doc.data().designation,
                        date: doc.data().signInDate,
                        shift: doc.data().shiftType,
                        status: doc.data().isSignedIn ? 'Signed In' : 'Signed Out',
                        checkIn: doc.data().signInTime,
                        checkOut: doc.data().signOutTime,
                        overtime: 'N/A'
                    };
                    data.push(attendanceRecord);
                } else {
                    // console.log(`Skipping document ${docId} as date does not match: ${date} !== ${currentDate}`);
                }
            });
            setAttendanceData(data);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const columns = useMemo(() => [
        { Header: 'Emp. ID', accessor: 'id' },
        {
            Header: 'Emp. Name', accessor: 'emp_name',
            Cell: ({ row }) => (
                <div>
                    <div>{row.original.emp_name}</div>
                    <div style={{ fontSize: '0.9em', color: 'gray' }}>{row.original.position}</div>
                </div>
            )
        },
        {
            Header: 'Date',
            accessor: 'date'
        },
        {
            Header: 'Shift',
            accessor: 'shift'
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }) => {
                const statusClass = value === 'Signed In' ? 'status-signed-in' : 'status-signed-out';
                return <span className={statusClass}>{value}</span>;
            }
        },
        {
            Header: 'Check In',
            accessor: 'checkIn'
        },
        {
            Header: 'Check Out',
            accessor: 'checkOut'
        },
        {
            Header: 'Overtime',
            accessor: 'overtime'
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state: { pageIndex, pageSize },
        setGlobalFilter // Function to set the global filter
    } = useTable(
        {
            columns,
            data: attendanceData,
            initialState: { pageIndex: 0, pageSize: 5 },
        },
        useGlobalFilter, // Enable global filtering
        usePagination
    );

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
        setToday(formattedDate);
    }, []);

    useEffect(() => {
        const fetchEmployeesCount = async () => {
            try {
                const employeesQuery = query(
                    collection(fireDB, "employees"),
                    where("Status", "==", "Onboarded")
                );
                const querySnapshot = await getDocs(employeesQuery);
                let count = 0;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.Status === "Onboarded") {
                        count++;
                    }
                });

                setOnboardEmployee(count);
            } catch (error) {
                console.error("Error fetching employees: ", error);
            }
        };

        fetchEmployeesCount();
    }, []);

    // useEffect(() => {
    //     const fetchLateInCount = async () => {
    //         try {
    //             const today = dayjs().format("MMMM D, YYYY");
    //             const employeesQuery = query(
    //                 collection(fireDB, "EMP_SIGNIN_SIGNOUT"),
    //                 where("signInDate", "==", today)
    //             );
    //             const querySnapshot = await getDocs(employeesQuery);
    //             let count = 0;
    //             querySnapshot.forEach((doc) => {
    //                 const data = doc.data();
    //                 const signInTime = data.signInTime;
    //                 const [time, period] = signInTime.split(" ");
    //                 const shiftATime = dayjs("04:00:00 AM", "hh:mm:ss A"); // Shift A time (4:00 AM)
    //                 const shiftBTime = dayjs("12:00:00 PM", "hh:mm:ss A"); // Shift B time (12:00 PM)
    //                 const shiftCTime = dayjs("08:00:00 PM", "hh:mm:ss A"); // Shift C time (8:00 PM)

    //                 if (data.shiftType === "A" && time > shiftATime) {
    //                     console.log("A - Late In");
    //                     count++;
    //                 } else if (data.shiftType === "B" && time > shiftBTime) {
    //                     console.log("B - Late In");
    //                     count++;
    //                 } else if (data.shiftType === "C" && time > shiftCTime) {
    //                     console.log("C - Late In");
    //                     count++;
    //                 }
    //             });

    //             setLateInCount(count);
    //         } catch (error) {
    //             console.error("Error fetching late in count: ", error);
    //         }
    //     };

    //     fetchLateInCount();
    // }, []);

    const fetchAbsentEmployees = async () => {
        try {
            // Today's date in the required format (MMMM D, YYYY)
            const today = dayjs().format("MMMM D, YYYY");

            // Step 1: Get the count of "Onboarded" employees from the "employees" collection
            const employeesQuery = query(
                collection(fireDB, "employees"),
                where("Status", "==", "Onboarded")
            );
            const employeeSnapshot = await getDocs(employeesQuery);
            const totalOnboarded = employeeSnapshot.size;

            // Step 2: Get the count of sign-in records for today's date from the "EMP_SIGNIN_SIGNOUT" collection
            const signInQuery = query(
                collection(fireDB, "EMP_SIGNIN_SIGNOUT"),
                where("signInDate", "==", today)
            );
            const signInSnapshot = await getDocs(signInQuery);
            const signedInToday = signInSnapshot.size;

            // Step 3: Calculate absent employees (Onboarded - Signed In Today)
            const absentCount = totalOnboarded - signedInToday;

            return absentCount; // Return the count of absent employees

        } catch (error) {
            console.error("Error fetching absent employees count: ", error);
            return 0;
        }
    };

    useEffect(() => {
        const getAbsentEmployees = async () => {
            const count = await fetchAbsentEmployees();
            setAbsentCount(count); // Set the count of absent employees
        };

        getAbsentEmployees(); // Call the function to fetch absent employee count
    }, []);

    const handleSearchChange = (event) => {
        setGlobalFilter(event.target.value || undefined);
    };

    useEffect(() => {
        setPersentCount(onboardEmployee - absentCount);
      }, [onboardEmployee, absentCount]);

    return (
        <>
            <div className="attendence-bg">
                <div className="main" id="main">
                    <div className="attendace-head-content">
                        <div className="attendace-title">
                            <h3>Attendance</h3>
                        </div>
                        {/* <div className="attendave-subtabs">
                            <button><IoMdListBox className='icons' /> Reports</button>
                            <button><IoMdTime className='icons' />Absence deduct time off</button>
                            <button><IoLocationOutline className='icons' />Location</button>
                        </div> */}
                    </div>
                    <hr />
                </div>
            </div>
            <div className="attendace-info-content" id='main'>
                <div className="attendence-info">
                    <div className="leftside-info">
                        <div className='icon'>
                            <FaBullhorn />
                        </div>
                        <div>
                            <h3>Today, {today}</h3>
                            <p>This shows daily date in real time | <span>Insight <FaLongArrowAltRight /></span></p>
                        </div>
                    </div>
                    <div className="rightside-info">
                        <div className="attendae-info">
                            <div className="single-info">
                                <h2>Total Employee</h2>
                                <div>
                                    <h3>{onboardEmployee}</h3>
                                    <LuArrowDownRightSquare className='downright' />
                                </div>
                            </div>
                            {/* <div className="single-info">
                                <h2>Late In</h2>
                                <div>
                                    <h3>{lateInCount}</h3>
                                    <h3>2</h3>
                                    <LuArrowUpRightSquare className='upright' />
                                </div>
                            </div>
                            <div className="single-info">
                                <h2>On Time</h2>
                                <div>
                                    <h3>0</h3>
                                    <LuArrowUpRightSquare className='upright' />
                                </div>
                            </div> */}
                            <div className="single-info">
                                <h2>Absent</h2>
                                <div>
                                    <h3>{absentCount}</h3>
                                    <LuArrowUpRightSquare className='upright' />
                                </div>
                            </div>
                            <div className="single-info">
                                <h2>Present</h2>
                                <div>
                                    <h3>{persentCount}</h3>
                                    <LuArrowUpRightSquare className='upright' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="attendence-table" id="main">
                <div className="attendence-table-header">
                    <div className="attendance-table-leftside">
                        <h2>Employee Attendance</h2>
                        <p>Keep track on employee attendance daily basis</p>
                    </div>
                    <div className="attendance-table-rightside">
                        <CalendarButton />
                        <button><CiExport className='icon' />Export</button>
                    </div>
                </div>
                <hr />
                <div className="attendence-filter">
                    <div className="attendence-filter-leftside">
                        <div className="single-filter">
                            <button className='active'>All Employees</button>
                        </div>
                        {/* <div className="single-filter">
                            <button>IT Division</button>
                        </div>
                        <div className="single-filter">
                            <button>Marketing</button>
                        </div>
                        <div className="single-filter">
                            <button>Finance</button>
                        </div> */}
                    </div>
                    <div className="attendence-filter-rightside">
                        <input
                            type="text"
                            placeholder="Search Here"
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <div className="attendence-list">
                    <table {...getTableProps()} className="attendance-table">
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

                    <div>
                        <button onClick={() => previousPage()} disabled={!canPreviousPage}> {'<'} </button>
                        <button onClick={() => nextPage()} disabled={!canNextPage}> {'>'} </button>
                    </div>

                    <span>
                        {pageIndex + 1} of {pageOptions.length}
                    </span>

                </div>
            </div>
        </>
    );
}

export default Attendance;
