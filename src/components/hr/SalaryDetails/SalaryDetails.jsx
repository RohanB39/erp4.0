import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, fireDB } from '../../firebase/FirebaseConfig'; // Import Firebase functions
import './SalaryDetails.css';
import SalaryDetailsPopup from './SalaryDetailsPopup/SalaryDetailsPopup';

const SalaryDetails = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const q = query(collection(fireDB, 'employees'), where('Status', '==', 'Verification Completed'));
                const querySnapshot = await getDocs(q);
                const employeeList = querySnapshot.docs.map((doc, index) => {
                    const employeeData = doc.data();
                    const fullName = `${employeeData.personalInfo.firstName} ${employeeData.personalInfo.fatherName} ${employeeData.personalInfo.lastName}`;
                    return {
                        srNo: index + 1,
                        employeeId: employeeData.employeeId,
                        fullName: fullName,
                        mobileNumber: employeeData.personalInfo.mobileNumber,
                        personalEmail: employeeData.personalInfo.personalEmail,
                        docId: doc.id
                    };
                });
                setEmployees(employeeList); // Update the state with fetched employee data
            } catch (error) {
                console.error("Error fetching employee data: ", error);
            }
        };

        fetchEmployees(); // Call the function to fetch employees
    }, []);

    const handleAddSalaryDetails = (employee) => {
        setSelectedEmployee(employee);
        setIsPopupOpen(true); // Show the popup
    };

    // Function to close the popup
    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedEmployee(null); // Clear selected employee
    };

    return (
        <div id='main'>
            <h2>Employee Salary Details</h2>
            <table className="salary-table">
                <thead>
                    <tr>
                        <th>Sr/No</th>
                        <th>Employee ID</th>
                        <th>Full Name</th>
                        <th>Mobile Number</th>
                        <th>Email ID</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.docId}>
                            <td>{employee.srNo}</td>
                            <td>{employee.employeeId}</td>
                            <td>{employee.fullName}</td>
                            <td>{employee.mobileNumber}</td>
                            <td>{employee.personalEmail}</td>
                            <td>
                                <button
                                    onClick={() => handleAddSalaryDetails(employee)}
                                    className="add-salary-btn"
                                >
                                    Add Salary Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isPopupOpen && (
                <SalaryDetailsPopup
                    employeeData={selectedEmployee}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    );
};

export default SalaryDetails;
