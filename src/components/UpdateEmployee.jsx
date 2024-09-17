import React, { useState } from 'react';

function UpdateEmployee({ employees, onUpdateEmployee }) {
    const [searchName, setSearchName] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');

    const handleSearch = () => {
        const employee = employees.find(emp => emp.name.toLowerCase() === searchName.toLowerCase());
        if (employee) {
            setSelectedEmployee(employee);
            setName(employee.name);
            setEmail(employee.email);
            setPosition(employee.position);
        } else {
            alert('Employee not found');
            setSelectedEmployee(null);
            setName('');
            setEmail('');
            setPosition('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateEmployee({ ...selectedEmployee, name, email, position });
        setSearchName('');
        setName('');
        setEmail('');
        setPosition('');
        setSelectedEmployee(null);
    };

    return (
        <div className='ue'>
            <h2>Update Employee</h2>
            <div className='search-box'>
                <input
                    type="text"
                    placeholder="Search Employee by Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <button onClick={handleSearch} className='search'>Search</button>
            </div>
            {selectedEmployee && (
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </label>
                    <label>
                        Email:
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Position:
                        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required />
                    </label>
                    <button type="submit">Update Employee</button>
                </form>
            )}
            
        </div>
    );
}

export default UpdateEmployee;
