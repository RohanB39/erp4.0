import React, { useEffect, useState } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useTable } from 'react-table';
import AssignMachinePopup from '../machineAssignment/machineAssignPopup/AssignMachinePopup'; 
import './machineAssignment.css';

const MachineAssignment = () => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); 

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialsCollection = collection(fireDB, 'Production_Orders');
        const q = query(materialsCollection, where('progressStatus', '==', 'Production Started'));
        const snapshot = await getDocs(q);
        const fetchedMaterials = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMaterials(fetchedMaterials);
      } catch (error) {
        console.error('Error fetching materials: ', error);
      }
    };

    fetchMaterials();
  }, []);

  const handleAssignMachine = (material) => {
    setSelectedMaterial(material); 
    setIsPopupOpen(true); 
  };

  const closePopup = () => {
    setIsPopupOpen(false); 
    setSelectedMaterial(null); 
  };

  // Function to group materials by date
  const groupByDate = (materials) => {
    return materials.reduce((groups, material) => {
      if (material.startTime && material.startTime.seconds) {
        const date = new Date(material.startTime.seconds * 1000);
        const formattedDate = date.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Asia/Kolkata',
        });

        if (!groups[formattedDate]) {
          groups[formattedDate] = [];
        }
        groups[formattedDate].push(material);
      }
      return groups;
    }, {});
  };

  // Group the materials by date
  const groupedMaterials = groupByDate(materials);

  // Define columns for React Table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Machine Name',
        accessor: 'selectedMachine',
      },
      {
        Header: 'FG ID',
        accessor: 'selectedProductId',
      },
      {
        Header: 'Planned Quantity',
        accessor: 'quantity',
      },
      {
        Header: 'Started',
        accessor: 'startTime',
        Cell: ({ value }) => {
          if (value && value.seconds) {
            const date = new Date(value.seconds * 1000);
            return date.toLocaleTimeString('en-IN', { hour12: true, timeZone: 'Asia/Kolkata' });
          } else {
            return 'Invalid Time';
          }
        }
      },
      {
        Header: 'Time Remaining',
        Cell: ({ row }) => {
          const { startTime, requiredTime } = row.original;
          const [remainingTime, setRemainingTime] = useState(null); // State to track remaining time
      
          useEffect(() => {
            const calculateTimeRemaining = () => {
              const currentTime = new Date();
      
              if (startTime && startTime.seconds && requiredTime) {
                const startTimeDate = new Date(startTime.seconds * 1000);
                
                // Calculate elapsed time in milliseconds
                const elapsedTime = currentTime - startTimeDate;
      
                // Parse the requiredTime string (e.g., "1 days" or "12 hours")
                const [requiredValue, requiredUnit] = requiredTime.split(' ');
                let requiredTimeMs;
      
                // Convert the requiredTime to milliseconds based on the unit
                if (requiredUnit === 'days') {
                  requiredTimeMs = requiredValue * 12 * 60 * 60 * 1000; // Convert days to 12 hours in milliseconds
                } else if (requiredUnit === 'hours') {
                  requiredTimeMs = requiredValue * 60 * 60 * 1000; // Convert hours to milliseconds
                } else if (requiredUnit === 'minutes') {
                  requiredTimeMs = requiredValue * 60 * 1000; // Convert minutes to milliseconds
                } else if (requiredUnit === 'seconds') {
                  requiredTimeMs = requiredValue * 1000; // Convert seconds to milliseconds
                } else {
                  return 'Invalid Time Unit';
                }
      
                // If elapsed time is greater than or equal to requiredTime, show "Stop Machine"
                if (elapsedTime >= requiredTimeMs) {
                  setRemainingTime('Stop Machine');
                } else {
                  // Calculate time remaining and display it
                  const timeRemainingMs = requiredTimeMs - elapsedTime;
      
                  // Convert the remaining time into hours, minutes, and seconds
                  const hours = Math.floor(timeRemainingMs / (1000 * 60 * 60));
                  const minutes = Math.floor((timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
                  const seconds = Math.floor((timeRemainingMs % (1000 * 60)) / 1000);
      
                  setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
                }
              } else {
                setRemainingTime('Invalid Time');
              }
            };
      
            // Set an interval to update the remaining time every second
            const intervalId = setInterval(calculateTimeRemaining, 1000);
      
            // Clear the interval when the component is unmounted
            return () => clearInterval(intervalId);
          }, [startTime, requiredTime]);
      
          return remainingTime ? remainingTime : 'Loading...';
        }
      },     
      {
        Header: 'Assembly Cell',
        accessor: 'assembelyCell',
      },
      {
        Header: 'Status',
        accessor: 'progressStatus',
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <button className='grnBtn' onClick={() => handleAssignMachine(row.original)}>
            Stop
          </button>
        ),
      },
    ],
    []
  );

  // Create table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: materials,
  });

  return (
    <div className='main'>
      <h4>Machine Assignment</h4>

      {/* Render the table grouped by date */}
      {Object.keys(groupedMaterials).map(date => (
        <div key={date}>
          <h5>{date}</h5> {/* Date Header */}
          <table {...getTableProps()} className="react-table">
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
              {groupedMaterials[date].map(material => {
                const rowIndex = rows.findIndex(row => row.original.id === material.id);
                if (rowIndex !== -1) {
                  const row = rows[rowIndex];
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      ))}

      {/* Render the popup component */}
      <AssignMachinePopup 
        material={selectedMaterial} 
        isOpen={isPopupOpen} 
        onClose={closePopup} 
      />
    </div>
  );
}

export default MachineAssignment;
