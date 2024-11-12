import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useRowSelect, usePagination } from 'react-table';
import { FiUsers } from 'react-icons/fi';
import { IoIosPersonAdd } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom'; // React Router hook for navigation
import { fireDB } from '../firebase/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firestore methods
import dayjs from "dayjs";
import './hrDash.css';

function HrDashboard() {
    const [employees, setEmployees] = useState([]);
    const [onboardEmployee, setOnboardEmployee] = useState(0);
    const navigate = useNavigate();
    const [persentCount, setPersentCount] = useState(0);
    const [paidLeaveCount, setPaidLeaveCount] = useState(0);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // Create a query to fetch employees with Status 'Active'
                const employeesQuery = query(
                    collection(fireDB, "employees"),
                    where("Status", "==", "Active")
                );

                const querySnapshot = await getDocs(employeesQuery);
                const employeesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEmployees(employeesData);
            } catch (error) {
                console.error("Error fetching employees: ", error);
            }
        };

        fetchEmployees();
    }, []);

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

    const data = useMemo(() => employees, [employees]);

    const columns = useMemo(
        () => [
            {
                id: 'selection',
                Header: ({ getToggleAllRowsSelectedProps }) => (
                    <div>
                        <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
                    </div>
                ),
                Cell: ({ row }) => (
                    <div>
                        <input type="checkbox" {...row.getToggleRowSelectedProps()} />
                    </div>
                ),
            },
            {
                Header: 'Id',
                accessor: 'id',
            },
            {
                Header: 'Name',
                accessor: 'personalInfo.firstName',
            },
            {
                Header: 'Email',
                accessor: 'personalInfo.personalEmail',
            },
            {
                Header: 'Status',
                accessor: 'Status',
            },
            {
                Header: 'Action',
                Cell: ({ row }) => (
                    <div>
                        <button className='edit' onClick={() => handleNavigate(row.original.id)}>
                            <MdModeEditOutline />
                        </button>
                        <button className='delet'><MdOutlineDelete /></button>
                    </div>
                ),
            },
        ],
        []
    );

    const handleNavigate = (id) => {
        navigate(`/onboardEmployee/${id}`);
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        usePagination,
        useRowSelect
    );

    const handleEmployeeLoginClick = () => {
        navigate('/EmployeeLogin');
    };

    const fetchPresentEmployees = async () => {
        const today = dayjs().format("YYYY-MM-DD");
        let presentCount = 0;
        try {
            const signInCollectionRef = collection(fireDB, "EMP_SIGNIN_SIGNOUT");
            const snapshot = await getDocs(signInCollectionRef);
            snapshot.forEach(doc => {
                const docData = doc.data();
                if (docData[today]) {
                    presentCount += 1;
                }
            });
            return presentCount;
        } catch (error) {
            console.error("Error fetching absent employees count: ", error);
            return 0;
        }
    };

    useEffect(() => {
        const getPresentEmployees = async () => {
            const count = await fetchPresentEmployees();
            setPersentCount(count);
        };

        getPresentEmployees();
    }, []);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchPaidLeaveCount = async () => {
            const todayDate = getTodayDate();
            let count = 0;

            try {
                const querySnapshot = await getDocs(collection(fireDB, "employees"));
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const leaveApplications = data.LeaveApplications || {};

                    // Check if any fromDate matches todayDate
                    for (const leaveId in leaveApplications) {
                        const leave = leaveApplications[leaveId];
                        if (leave.fromDate === todayDate) {
                            count++;
                            break; // Increment count once per document if match is found
                        }
                    }
                });

                setPaidLeaveCount(count);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };

        fetchPaidLeaveCount();
    }, []);



    return (
        <>
            <main id='main' className='main'>
                <div className="employee-heading">
                    <h3>Employee Details</h3>
                </div>

                <div className="employee-cards">
                    <div className="single-employee-card">
                        <div className="employee-detail">
                            <h3>Total Employee</h3>
                            <p>{onboardEmployee}</p>
                        </div>
                        <div className="employee-icon">
                            <FiUsers />
                        </div>
                    </div>
                    <div className="single-employee-card">
                        <div className="employee-detail">
                            <h3>Present Employees</h3>
                            <p>{persentCount}</p>
                        </div>
                        <div className="employee-icon">
                            <FiUsers />
                        </div>
                    </div>
                    <div className="single-employee-card">
                        <div className="employee-detail">
                            <h3>Request Paid Leave</h3>
                            <p><p>{paidLeaveCount}</p></p>
                        </div>
                        <div className="employee-icon">
                            <FiUsers />
                        </div>
                    </div>
                </div>

                <div className="employee-table">
                    <div className="employee-profile">
                        <h3>Employee-Profile</h3>
                        <div className="employee-search">
                            <input type="text" placeholder='Search Employee' />
                        </div>
                        <div className="add-employee-btn">
                            {/* <button onClick={handleAddEmployeeClick}> <IoIosPersonAdd className='add-icon' />Add Employee</button> */}
                            <button onClick={handleEmployeeLoginClick}> <IoIosPersonAdd className='add-icon' />Create Employee Login</button>
                        </div>
                    </div>
                    <div className="employee-list">
                        <table {...getTableProps()}>
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
                                            {row.cells.map(cell => {
                                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
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
            </main>
        </>
    );
}
export default HrDashboard;
