import React, { useEffect, useState } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useTable } from 'react-table';
import AssemblyStopPopup from './machineAssignPopup/AssemblyStopPopup';


import style from './assembalyComponent.module.css'

const AssemblyComponent = () => {
  const [data, setData] = useState([]); // State to hold the data from Firestore
  const [loading, setLoading] = useState(true); // Loading state
  const [popupOpen, setPopupOpen] = useState(false); // State to control popup visibility
  const [selectedRowData, setSelectedRowData] = useState(null);

  // Function to fetch data from Firestore
  const fetchData = async () => {
    try {
      const q = query(
        collection(fireDB, 'Production_Orders'),
        where('progressStatus', '==', 'Assembly started'),
        where('productionStatus', '==', 'Assembly Start')
      );
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc, index) => ({
        srNo: index + 1,
        ...doc.data(),
      }));

      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';

    // Check if the timestamp is a Firestore Timestamp object
    if (timestamp.toDate) {
      const date = timestamp.toDate(); // Convert Firestore Timestamp to JS Date
      const hours = String(date.getHours()).padStart(2, '0'); // Use getHours() for local time
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`; // Returns in 24-hour format
    } else {
      // If it's already a valid date or string, try converting it
      const date = new Date(timestamp);
      if (!isNaN(date)) {
        const hours = String(date.getHours()).padStart(2, '0'); // Use getHours() for local time
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`; // Returns in 24-hour format
      }
    }
    return 'Invalid Date'; // Fallback in case of invalid date
  };


  // Define columns for the table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Sr No',
        accessor: 'srNo',
      },
      {
        Header: 'Production Order ID',
        accessor: 'productionOrderId',
      },
      {
        Header: 'Machine Name',
        accessor: 'selectedMachine',
      },
      {
        Header: 'FG ID',
        accessor: 'selectedProductId',
      },
      {
        Header: 'Assembly Start',
        accessor: 'assemblyStartTimestamp',
        Cell: ({ value }) => formatTime(value),
      },
      {
        Header: 'Time Required',
        accessor: 'assemblyTimeRequired',
        Cell: ({ row }) => {
          const timeRequired = row.original.assemblyTimeRequired;
          const timeUnit = row.original.assemblyTimeUnit;

          return timeRequired ? `${timeRequired.toFixed(2)} ${timeUnit}` : 'N/A';
        },
      },
      {
        Header: 'Production Quantity',
        accessor: 'productionQuantity',
      },
      {
        Header: 'Action',
        accessor: 'action', // Optional: you can define an accessor if needed
        Cell: ({ row }) => (
          <button
            onClick={() => handleStopAssembly(row.original)}
          >
            Stop
          </button>
        ),
      },
    ],
    []
  );

  const handleStopAssembly = (row) => {
    setSelectedRowData(row); // Set the entire row data
    setPopupOpen(true); // Show the popup
  };

  // Create the table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className={style.assembalyComponentContainer}>
      <h4>Assembly Orders</h4>
      {loading ? (
        <p className={style.loadingMessage}>Loading...</p>
      ) : (
        <table {...getTableProps()} className={style.assembalyTable}>
          <thead className={style.assembalyTableHeader}>
            {headerGroups.map((headerGroup, headerGroupIndex) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${headerGroupIndex}`}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th {...column.getHeaderProps()} key={`column-${columnIndex}`}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className={style.assembalyTableBody}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={`row-${row.id || rowIndex}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td {...cell.getCellProps()} key={`cell-${cell.column.id || cellIndex}`}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

      )}
      {selectedRowData && (
        <AssemblyStopPopup
          isOpen={popupOpen}
          rowData={selectedRowData}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default AssemblyComponent;
