import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useTable } from 'react-table';
import { fireDB } from '../../../firebase/FirebaseConfig';
import Swal from 'sweetalert2';

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
              docId: doc.id,
              leaveId: key,
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

  const handleLeaveAction = async (docId, leaveId, newStatus) => {
    try {
      const employeeRef = doc(fireDB, 'employees', docId);
      const employeeDoc = await getDoc(employeeRef);
      const employeeData = employeeDoc.data();
      if (employeeData?.LeaveApplications && employeeData.LeaveApplications[leaveId]) {
        const leaveApplication = employeeData.LeaveApplications[leaveId];
        await updateDoc(employeeRef, {
          [`LeaveApplications.${leaveId}.status`]: newStatus,
        });
        if (newStatus === 'Approved') {
          const { leaveType, daysRequested } = leaveApplication;
          if (leaveType && daysRequested) {
            const leaveInfo = employeeData.leaveInfo || {};
            let updatedLeaveInfo = { ...leaveInfo };
            if (leaveType.toLowerCase() === 'casual') {
              updatedLeaveInfo.casualLeave = (updatedLeaveInfo.casualLeave || 0) - daysRequested;
            } else if (leaveType.toLowerCase() === 'earn') {
              updatedLeaveInfo.earnLeave = (updatedLeaveInfo.earnLeave || 0) - daysRequested;
            } else if (leaveType.toLowerCase() === 'hpl') {
              updatedLeaveInfo.hplLeave = (updatedLeaveInfo.hplLeave || 0) - daysRequested;
            }
            await updateDoc(employeeRef, {
              leaveInfo: updatedLeaveInfo,
            });
          }
        }
        Swal.fire({
          icon: 'success',
          title: 'Leave ' + newStatus + '!',
          text: `The leave has been successfully ${newStatus.toLowerCase()}ed.`,
          confirmButtonText: 'OK'
        });
        fetchPendingLeaves();
      } else {
        console.error('Leave application or leaveId not found!');
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Leave application not found or invalid leave ID.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error updating leave status and leaveInfo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: 'An error occurred while updating the leave details. Please try again.',
        confirmButtonText: 'OK'
      });
    }
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
