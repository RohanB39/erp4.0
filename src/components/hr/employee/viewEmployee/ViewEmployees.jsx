import React, { useState } from 'react';

function ViewEmployees({ employees, onUpdate, onDelete }) {
    const [editedEmployee, setEditedEmployee] = useState(null);

    const handleUpdate = (employee) => {
        setEditedEmployee(employee);
    };

    const handleSave = () => {
        onUpdate(editedEmployee);
        setEditedEmployee(null);
    };

    const handleCancel = () => {
        setEditedEmployee(null);
    };

    const handleDelete = (id) => {
        onDelete(id);
    };

    return (
        <div className='emp main'id='main'>
            <h2>Employee List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Position</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.id}</td>
                            <td>
                                {editedEmployee && editedEmployee.id === employee.id ? (
                                    <input
                                        type="text"
                                        value={editedEmployee.name}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })}
                                    />
                                ) : (
                                    employee.name
                                )}
                            </td>
                            <td>
                                {editedEmployee && editedEmployee.id === employee.id ? (
                                    <input
                                        type="email"
                                        value={editedEmployee.email}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                                    />
                                ) : (
                                    employee.email
                                )}
                            </td>
                            <td>
                                {editedEmployee && editedEmployee.id === employee.id ? (
                                    <input
                                        type="text"
                                        value={editedEmployee.position}
                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, position: e.target.value })}
                                    />
                                ) : (
                                    employee.position
                                )}
                            </td>
                            <td>
                                {editedEmployee && editedEmployee.id === employee.id ? (
                                    <>
                                        <button onClick={handleSave}>Save</button>
                                        <button onClick={handleCancel}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                      
                                        <button onClick={() => onDelete(employee.id)}>Delete</button>
                                        
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewEmployees;
