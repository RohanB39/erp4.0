import React, { useState, useMemo } from 'react';
import './attendance.css';
import { IoMdListBox, IoMdTime } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { FaBullhorn, FaLongArrowAltRight } from "react-icons/fa";
import { LuArrowDownRightSquare, LuArrowUpRightSquare } from "react-icons/lu";
import { CiExport, CiSearch } from "react-icons/ci";
import { useTable, usePagination } from 'react-table';

import CalendarButton from '../../CalenderButton';

const Attendance = () => {
    const data = useMemo(() => [
        { id: 1, emp_name: 'Amit Kumar', position: 'Software Engineer', date: '2024-06-25', shift: 'Morning', status: 'Work from Office', checkIn: '09:00', checkOut: '17:00', overtime: '1h' },
        { id: 2, emp_name: 'Ravi Sharma', position: 'Project Manager', date: '2024-06-25', shift: 'Evening', status: 'Work from Home', checkIn: '-', checkOut: '-', overtime: '0h' },
        { id: 3, emp_name: 'Sunita Verma', position: 'Data Analyst', date: '2024-06-25', shift: 'Night', status: 'Work from Office', checkIn: '09:30', checkOut: '17:30', overtime: '0h' },
        { id: 4, emp_name: 'Priya Singh', position: 'HR Manager', date: '2024-06-25', shift: 'Morning', status: 'Work from Office', checkIn: '09:00', checkOut: '17:00', overtime: '2h' },
        { id: 5, emp_name: 'Vikram Patel', position: 'System Admin', date: '2024-06-25', shift: 'Evening', status: 'Work from Home', checkIn: '09:00', checkOut: '17:00', overtime: '1h' },
        { id: 6, emp_name: 'Anjali Desai', position: 'UI/UX Designer', date: '2024-06-25', shift: 'Night', status: 'Work from Home', checkIn: '-', checkOut: '-', overtime: '0h' },
        { id: 7, emp_name: 'Rajesh Gupta', position: 'DevOps Engineer', date: '2024-06-25', shift: 'Morning', status: 'Work from Office', checkIn: '09:00', checkOut: '17:00', overtime: '1h' },
        { id: 8, emp_name: 'Kavita Joshi', position: 'Content Writer', date: '2024-06-25', shift: 'Evening', status: 'Work from Home', checkIn: '09:00', checkOut: '17:00', overtime: '1h' },
        { id: 9, emp_name: 'Manish Mehta', position: 'QA Engineer', date: '2024-06-25', shift: 'Night', status: 'Work from Home', checkIn: '09:30', checkOut: '17:30', overtime: '0h' },
        { id: 10, emp_name: 'Nisha Rao', position: 'Marketing Manager', date: '2024-06-25', shift: 'Morning', status: 'Work from Office', checkIn: '09:00', checkOut: '17:00', overtime: '1h' },
    ], []);

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
                const statusClass = value === 'Work From Home' ? 'status-wfh' : 'status-wfo';
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
        gotoPage,
        pageCount,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 5 }
        },
        usePagination
    );


    return (
        <>
            <div className="attendence-bg">
                <div className="main" id="main">
                    <div className="attendace-head-content">
                        <div className="attendace-title">
                            <h3>Attendance</h3>
                        </div>
                        <div className="attendave-subtabs">
                            <button><IoMdListBox className='icons' /> Reports</button>
                            <button><IoMdTime className='icons' />Absence deduct time off</button>
                            <button><IoLocationOutline className='icons' />Location</button>
                        </div>
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
                            <h3>Today, 25/06/2024</h3>
                            <p>This shows daily date in real time | <span>Insight <FaLongArrowAltRight /></span></p>
                        </div>
                    </div>
                    <div className="rightside-info">
                        <div className="attendae-info">
                            <div className="single-info">
                                <h2>Total Employee</h2>
                                <div>
                                    <h3>345</h3>
                                    <LuArrowDownRightSquare className='downright' />
                                </div>
                            </div>
                            <div className="single-info">
                                <h2>Late In</h2>
                                <div>
                                    <h3>45</h3>
                                    <LuArrowUpRightSquare className='upright' />
                                </div>
                            </div>
                            <div className="single-info">
                                <h2>On Time</h2>
                                <div>
                                    <h3>125</h3>
                                    <LuArrowUpRightSquare className='upright' />
                                </div>
                            </div>
                            <div className="single-info">
                                <h2>Absent</h2>
                                <div>
                                    <h3>45</h3>
                                    <LuArrowUpRightSquare className='upright' />
                                </div>
                            </div>
                            <div className="single-info">
                                <h2>Time Off</h2>
                                <div>
                                    <h3>5</h3>
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
                        <div className="single-filter">
                            <button>IT Division</button>
                        </div>
                        <div className="single-filter">
                            <button>Marketing</button>
                        </div>
                        <div className="single-filter">
                            <button>Finance</button>
                        </div>
                    </div>
                    <div className="attendence-filter-rightside">
                        <input type="text" placeholder='Search Here' />
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

                </div>
                <div className="pagination">
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
