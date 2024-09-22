import React, { useState } from 'react';
import UpdateEmployee from '../updateEmployee/UpdateEmployee';
import ViewEmployees from '../viewEmployee/ViewEmployees';
import './employeeManager.css';

function EmployeeManager() {
    const [employees, setEmployees] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', position: 'Developer' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', position: 'Designer' }
    ]);

    const handleUpdateEmployee = (updatedEmployee) => {
        setEmployees(employees.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp)));
    };

    const handleDeleteEmployee = (id) => {
        setEmployees(employees.filter(emp => emp.id !== id));
    };

    return (
        <div className='emp-manager'>
            <UpdateEmployee employees={employees} onUpdateEmployee={handleUpdateEmployee} />
            <ViewEmployees employees={employees} onUpdate={handleUpdateEmployee} onDelete={handleDeleteEmployee} />
        </div>
    );
}

export default EmployeeManager;
