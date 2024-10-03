import React, { useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig'; // Import Firebase config
import './quality.css';

function FinalQuality() {
  const [data, setData] = useState([]);

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
          id: doc.id, // Optional: Keep track of the document ID if needed
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
      { Header: 'Approved', accessor: 'approved' },
      { Header: 'Hold', accessor: 'hold' },
      { Header: 'Pass', accessor: 'pass' },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => {
          const handleActionClick = () => {
            const newData = data.map((item, index) => {
              if (index === row.index) {
                if (item.status === 'approved') item.status = 'hold';
                else if (item.status === 'hold') item.status = 'pass';
                else if (item.status === 'pass') item.status = 'approved';
              }
              return item;
            });
            setData(newData);
          };

          const getButtonLabel = (status) => {
            if (status === 'approved') return 'Send to Hold';
            if (status === 'hold') return 'Send to Pass';
            if (status === 'pass') return 'Approved';
            return '';
          };

          return (
            <button onClick={handleActionClick}>
              {getButtonLabel(row.original.status)}
            </button>
          );
        }
      }
    ],
    [data]
  );

  // Modify the data to add Yes/No based on status
  const modifiedData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        approved: item.status === 'approved' ? 'Yes' : 'No',
        hold: item.status === 'hold' ? 'Yes' : 'No',
        pass: item.status === 'pass' ? 'Yes' : 'No',
      })),
    [data]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: modifiedData });

  return (
    <div className='qualityTable'>
      <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
