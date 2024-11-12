import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useTable } from 'react-table';
import { fireDB } from '../../../firebase/FirebaseConfig'; // Adjust this path to your Firebase config file

const ApproveLeave = () => {
  const [leaveData, setLeaveData] = useState([]);

  // Fetch leave applications with "Pending" status
  const fetchPendingLeaves = async () => {
    const employeesCollection = collection(fireDB, 'employees');
    const employeeDocs = await getDocs(employeesCollection);
    const pendingLeaves = [];

    employeeDocs.forEach((doc) => {
      const data = doc.data();
      const { LeaveApplications, personalInfo, employeeId } = data;

      if (LeaveApplications) {
        Object.entries(LeaveApplications).forEach(([key, leaveApplication]) => {
          if (leaveApplication.status === 'Pending') {
            pendingLeaves.push({
              docId: doc.id, // Keep track of document ID for updates
              leaveId: key, // Store the unique key for each leave application
              employeeId,
              firstName: personalInfo.firstName,
              lastName: personalInfo.lastName,
              leaveType: leaveApplication.leaveType,
              fromDate: leaveApplication.fromDate,
              toDate: leaveApplication.toDate,
              reason: leaveApplication.reason,
              appliedDate: leaveApplication.appliedDate,
              daysRequested: leaveApplication.daysRequested,
            });
          }
        });
      }
    });

    setLeaveData(pendingLeaves);
  };

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  // Approve or reject leave application
  const handleLeaveAction = async (docId, leaveId, newStatus) => {
    const employeeRef = doc(fireDB, 'employees', docId);
    await updateDoc(employeeRef, {
      [`LeaveApplications.${leaveId}.status`]: newStatus,
    });
    fetchPendingLeaves();
  };

  // Define columns for React Table
  const columns = React.useMemo(
    () => [
      { Header: 'Employee ID', accessor: 'employeeId' },
      { Header: 'First Name', accessor: 'firstName' },
      { Header: 'Last Name', accessor: 'lastName' },
      { Header: 'Leave Type', accessor: 'leaveType' },
      { Header: 'From Date', accessor: 'fromDate' },
      { Header: 'To Date', accessor: 'toDate' },
      { Header: 'Reason', accessor: 'reason' },
      { Header: 'Applied Date', accessor: 'appliedDate' },
      { Header: 'Days Requested', accessor: 'daysRequested' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button
              onClick={() => handleLeaveAction(row.original.docId, row.original.leaveId, 'Approved')}
              style={{ marginRight: '5px' }}
            >
              Approve
            </button>
            <button
              onClick={() => handleLeaveAction(row.original.docId, row.original.leaveId, 'Rejected')}
            >
              Reject
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data: leaveData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <div id="main" className="main">
      <h2>Approve Leave</h2>
      <table {...getTableProps()} style={{ width: '100%', border: '1px solid black' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} style={{ border: '1px solid black', padding: '8px' }}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} style={{ border: '1px solid black', padding: '8px' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ApproveLeave;
