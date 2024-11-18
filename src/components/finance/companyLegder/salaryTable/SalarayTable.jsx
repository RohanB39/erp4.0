import React, { useState, useEffect } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig'; // Import Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
import './salaryTable.css';

const SalaryTable = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchMonth, setSearchMonth] = useState('');

  useEffect(() => {
    const fetchSalaryData = async () => {
      const salaryCollection = collection(fireDB, "Salary_Details");
      const salarySnapshot = await getDocs(salaryCollection);
      const currentDate = new Date();
      const currentMonthYear = currentDate.toISOString().slice(0, 7); // YYYY-MM format
      const fetchedData = [];
      console.log(currentMonthYear);
      salarySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Fetched data:", data);
        Object.keys(data).forEach((monthYearKey) => {
          if (monthYearKey === currentMonthYear) { // Match the current month-year
            const employeeData = data[monthYearKey];
            const salaryDetails = {
              empId: employeeData.EmployeeId,
              empName: employeeData.EmployeeName,
              grossPay: parseFloat(employeeData.GrossPay) || 0, // Ensure it's a number
              netPay: parseFloat(employeeData.NetPay) || 0, // Ensure it's a number
              diduction: parseFloat(employeeData.Deduction) || 0, // Ensure it's a number
            };
            fetchedData.push(salaryDetails);
          }
        });
      });
      setSalaryData(fetchedData);
      console.log("Salary data set:", fetchedData);
    };

    fetchSalaryData();
  }, []);

  const handleNameSearch = (e) => {
    setSearchName(e.target.value);
  };

  const handleMonthSearch = (e) => {
    setSearchMonth(e.target.value);
  };

  // Filter data based on search criteria
  const filteredData = salaryData.filter((item) => {
    const matchesName = item.empName?.toLowerCase().includes(searchName.toLowerCase()) || false; // Optional chaining
    const matchesMonth = searchMonth ? item.empId?.slice(0, 7) === searchMonth : true; // Filter by month
    return matchesName && matchesMonth;
  });

  // Calculate the sum of Net Pay for the filtered data
  const totalNetPay = filteredData.reduce((total, item) => total + item.netPay, 0);

  return (
    <div className='salary-table'>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Employee Name"
          value={searchName}
          onChange={handleNameSearch}
          className="search-input"
        />
        <input
          type="month"
          placeholder="Search by Salary Month"
          value={searchMonth}
          onChange={handleMonthSearch}
          className="search-input"
        />

        <div className='salary_Paid'>Salary paid: ₹{totalNetPay.toFixed(2)}</div> {/* Display total Net Pay */}
      </div>
      <table>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Emp ID</th>
            <th>Emp Name</th>
            <th>Gross Pay</th>
            <th>Deduction</th>
            <th>Net Pay</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.empId}</td>
                <td>{item.empName}</td>
                <td>₹{item.grossPay.toFixed(2)}</td>
                <td>₹{item.diduction.toFixed(2)}</td>
                <td>₹{item.netPay.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No data available for this month.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryTable;
