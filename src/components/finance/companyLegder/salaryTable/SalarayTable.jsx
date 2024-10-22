import React, { useState } from 'react';
import './salaryTable.css';
const SalaryTable = () => {
  // Dummy Indian employee data
  const salaryData = [
    { srNo: 1, empId: 'E001', empName: 'Amit Sharma', designation: 'Software Engineer', salary: 60000, createdDate: '2024-01-15' },
    { srNo: 2, empId: 'E002', empName: 'Priya Deshmukh', designation: 'Project Manager', salary: 85000, createdDate: '2024-01-10' },
    { srNo: 3, empId: 'E003', empName: 'Ravi Kumar', designation: 'UX Designer', salary: 55000, createdDate: '2024-01-05' },
    { srNo: 4, empId: 'E004', empName: 'Neha Singh', designation: 'QA Engineer', salary: 60000, createdDate: '2024-02-22' },
    { srNo: 5, empId: 'E005', empName: 'Vikram Patel', designation: 'HR Manager', salary: 75000, createdDate: '2024-02-30' },
    { srNo: 6, empId: 'E006', empName: 'Sanya Gupta', designation: 'Full Stack Developer', salary: 70000, createdDate: '2024-02-10' },
    { srNo: 7, empId: 'E007', empName: 'Ankit Yadav', designation: 'Data Scientist', salary: 90000, createdDate: '2024-03-12' },
    { srNo: 8, empId: 'E008', empName: 'Meera Verma', designation: 'Marketing Head', salary: 95000, createdDate: '2024-03-15' },
    { srNo: 9, empId: 'E009', empName: 'Suresh Reddy', designation: 'Account Manager', salary: 65000, createdDate: '2024-03-01' },
    { srNo: 10, empId: 'E010', empName: 'Deepika Rao', designation: 'Sales Manager', salary: 78000, createdDate: '2024-04-10' },
  ];

  // State to hold search terms
  const [searchName, setSearchName] = useState('');
  const [searchMonth, setSearchMonth] = useState('');

  // Handle change in the employee name search
  const handleNameSearch = (e) => {
    setSearchName(e.target.value);
  };

  // Handle change in the salary month search
  const handleMonthSearch = (e) => {
    setSearchMonth(e.target.value);
  };

  // Filter data based on search criteria
  const filteredData = salaryData.filter((item) => {
    const matchesName = item.empName.toLowerCase().includes(searchName.toLowerCase());
    const matchesMonth = item.createdDate.includes(searchMonth); // Filter by month (yyyy-mm)
    return matchesName && matchesMonth;
  });

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
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Emp ID</th>
            <th>Emp Name</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.empId}>
              <td>{item.srNo}</td>
              <td>{item.empId}</td>
              <td>{item.empName}</td>
              <td>{item.designation}</td>
              <td>₹{item.salary}</td>
              <td>{item.createdDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryTable;
