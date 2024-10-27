import React, { useEffect, useState } from 'react';
import { collection, getDocs, fireDB } from '../../../firebase/FirebaseConfig';

const AssetsTable = () => {
  const [machines, setMachines] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [machinesPerPage] = useState(5); // Number of machines per page

  // Fetch data from Firestore
  const fetchMachines = async () => {
    try {
      const machinesCollection = collection(fireDB, 'Machines');
      const machineSnapshot = await getDocs(machinesCollection);
      const machineList = machineSnapshot.docs.map((doc, index) => ({
        id: doc.id,
        srNo: index + 1, // Add serial number
        ...doc.data()
      }));
      setMachines(machineList);
      const total = machineList.reduce((acc, receivable) => {
        const amount = parseFloat(receivable.machinePrice);
        return acc + (isNaN(amount) ? 0 : amount); // Only add if it's a valid number
      }, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error('Error fetching machines:', error);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  // Get current machines based on pagination
  const indexOfLastMachine = currentPage * machinesPerPage;
  const indexOfFirstMachine = indexOfLastMachine - machinesPerPage;
  const currentMachines = machines.slice(indexOfFirstMachine, indexOfLastMachine);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='main'>
      <h2>Assets Table</h2>
      <div style={{
        padding: '20px',
        margin: '20px 0',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        width: '50%',
        color: 'green',
      }}>
        Total Investment On Assets: {totalAmount.toFixed(2)} Rs
      </div>
      <table>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Machine Name</th>
            <th>Invoice Number</th>
            <th>Installation Date</th>
            <th>Model Number</th>
            <th>Purchase Date</th>
            <th>Payment Mode</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentMachines.map((machine, index) => (
            <tr key={machine.id}>
              <td>{indexOfFirstMachine + index + 1}</td>
              <td>{machine.machineName}</td>
              <td>{machine.vendorInvoice}</td>
              <td>{machine.installationDate}</td>
              <td>{machine.modelNumber}</td>
              <td>{machine.purchaseDate}</td>
              <td>{machine.paymentStatus}</td>
              <td>Rs. {machine.machinePrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(machines.length / machinesPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
            style={{ margin: '5px', padding: '5px 10px' }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssetsTable;
