import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useRowSelect, usePagination } from 'react-table';
import { FiUsers } from 'react-icons/fi';
import { IoIosPersonAdd } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom'; // React Router hook for navigation
import { fireDB } from '../firebase/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firestore methods
import './hrDash.css';

function HrDashboard() {
    const [employees, setEmployees] = useState([]);
    const [onboardEmployee, setOnboardEmployee] = useState(0);
    const navigate = useNavigate();
    // Fetch employees from Firebase
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
        navigate(`/onboardEmployee/${id}`); // Pass the id as a route parameter
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

    const handleAddEmployeeClick = () => {
        navigate('/add-employee');
    };

    const handleEmployeeLoginClick = () => {
        navigate('/EmployeeLogin');
    };

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
                            <h3>On Leave</h3>
                            <p>0</p> {/* Dummy data, replace with actual logic if available */}
                        </div>
                        <div className="employee-icon">
                            <FiUsers />
                        </div>
                    </div>
                    <div className="single-employee-card">
                        <div className="employee-detail">
                            <h3>Request Paid Leave</h3>
                            <p>0</p> {/* Dummy data, replace with actual logic if available */}
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
