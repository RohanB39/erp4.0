import React, { useMemo, useState } from 'react';
import { useTable, useRowSelect, usePagination } from 'react-table';
import { FiUsers } from 'react-icons/fi';
import { IoIosPersonAdd } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import AddEmployee from './employee/addEmployee/AddEmployee';
import './hrDash.css';


function HrDashboard() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [employees, setEmployees] = useState([
        { id: '001', name: 'Rajesh Kumar', position: 'Software Engineer', status: 'Active' },
        { id: '002', name: 'Priya Singh', position: 'Product Manager', status: 'On Leave' },
        { id: '003', name: 'Amit Patel', position: 'Data Analyst', status: 'Active' },
        { id: '004', name: 'Sunita Sharma', position: 'HR Manager', status: 'Active' },
        { id: '005', name: 'Vikram Reddy', position: 'Software Engineer', status: 'On Leave' },
        { id: '006', name: 'Neha Gupta', position: 'UX Designer', status: 'Active' },
        { id: '007', name: 'Anil Mehta', position: 'Backend Developer', status: 'Active' },
        { id: '008', name: 'Kavita Joshi', position: 'Frontend Developer', status: 'On Leave' },
        { id: '009', name: 'Ravi Nair', position: 'DevOps Engineer', status: 'Active' },
        { id: '010', name: 'Pooja Rao', position: 'Quality Assurance', status: 'Active' },
        { id: '011', name: 'Sandeep Kaur', position: 'Project Manager', status: 'Active' },
        { id: '012', name: 'Rahul Verma', position: 'System Administrator', status: 'On Leave' },
    ]);

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const addEmployee = (employee) => {
        setEmployees([...employees, employee]);
    };

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
                accessor: 'name',
            },
            {
                Header: 'Position',
                accessor: 'position',
            },
            {
                Header: 'Status',
                accessor: 'status',
            },
            {
                Header: 'Action',
                Cell: () => (
                    <div>
                        <button className='edit'><MdModeEditOutline /></button>
                        <button className='delet'><MdOutlineDelete /></button>
                    </div>
                ),
            },
        ],
        []
    );

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
                            <p>1200</p>
                        </div>
                        <div className="employee-icon">
                            <FiUsers />
                        </div>
                    </div>
                    <div className="single-employee-card">
                        <div className="employee-detail">
                            <h3>On Leave</h3>
                            <p>1200</p>
                        </div>
                        <div className="employee-icon">
                            <FiUsers />
                        </div>
                    </div>
                    <div className="single-employee-card">
                        <div className="employee-detail">
                            <h3>Request Paid Leave</h3>
                            <p>1200</p>
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
                            <button onClick={openPopup}> <IoIosPersonAdd className='add-icon' />Add Employee</button>
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
                {isPopupOpen && (
                    <AddEmployee onClose={closePopup} onAddEmployee={addEmployee} />
                )}
            </main >
        </>
    );
}

export default HrDashboard; 
