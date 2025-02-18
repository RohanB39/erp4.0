import React, { useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table';
import { collection, query, where, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { fireDB } from '../firebase/FirebaseConfig';



import style from './quality.module.css';
import GreenTickGif from '../../assets/approve.mp4';

function FinalQuality() {
  const [data, setData] = useState([]);
  const [searchDate, setSearchDate] = useState('');

  // Fetch data from Firestore based on the specified criteria
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(fireDB, 'Production_Orders'),
          where('progressStatus', 'in', ['Assembly End', 'Production Completed']),
          where('productionStatus', 'in', [
            'Production Phase 1 complete ready to dispatch',
            'Assembly Completed'
          ])
        );

        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Define the columns for the table
  const columns = useMemo(
    () => [
      { Header: 'Machine Name', accessor: 'selectedMachine' },
      { Header: 'Assembled Quantity', accessor: 'assembledQuantity' },
      { Header: 'Production Quantity', accessor: 'productionQuantity' },
      { Header: 'FG ID', accessor: 'selectedProductId' },
      { Header: 'Planned Quantity', accessor: 'quantity' },
      { Header: 'Production Order ID', accessor: 'productionOrderId' },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => {
          const handleApprove = async () => {
            try {
              const docRef = doc(fireDB, 'Production_Orders', row.original.id);
              await updateDoc(docRef, {
                progressStatus: 'Final Quality Approved',
                FinalQualityApprovalDate: Timestamp.now()
              });
              alert(`Approved: ${row.original.productionOrderId}`);
            } catch (error) {
              console.error('Error approving:', error);
            }
          };

          const handleReject = async () => {  // Marked as async
            try {
              const docRef = doc(fireDB, 'Production_Orders', row.original.id);
              await updateDoc(docRef, { progressStatus: 'Final Quality Rejected' });
              alert('Rejected:', row.original.productionOrderId);
            } catch (error) {
              console.error('Error rejecting:', error); // Updated error message for clarity
            }
          };

          return (
            <div>
              <button onClick={handleApprove}>Approve</button>
              <button onClick={handleReject} style={{ marginLeft: '10px' }}>Reject</button>
            </div>
          );
        },
      },
    ],
    [data]
  );

  const modifiedData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
      })),
    [data]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: modifiedData });

  return (
    <div className={style.qualityTable}>
      <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead className={style.qualityTableHeader}>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${i}`}>
              {headerGroup.headers.map((column, j) => (
                <th {...column.getHeaderProps()} key={`column-${j}`}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className={style.qualityTableBody}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={`row-${rowIndex}`}>
                {row.cells.map((cell, cellIndex) => (
                  <td {...cell.getCellProps()} key={`cell-${rowIndex}-${cellIndex}`}>
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
}

export default FinalQuality;
