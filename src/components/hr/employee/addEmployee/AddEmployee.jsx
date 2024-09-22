import React, { useState } from 'react';

function AddEmployee({ onClose, onAddEmployee }) {
    const [employee, setEmployee] = useState({
        id: '',
        name: '',
        position: '',
        status: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({
            ...employee,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddEmployee(employee);
        onClose();
    };

    return (
        <div className="popup-container">
            <div className="popup-content">
                <h3>Add People To Our Firm</h3>
                <form onSubmit={handleSubmit}>

                    <label>
                        Full Name:
                    </label>
                    <input type="text" name="name" value={employee.name} onChange={handleChange} required placeholder='Your Good Name'/>
                    <div className='d-flex gap-2'>

                        <label>
                            Department:
                            <input type="text" name="position" value={employee.position} onChange={handleChange} required placeholder='Sales'/>
                        </label>
                        <label>
                            Salary:
                            <input type="num" name="status" value={employee.status} onChange={handleChange} required placeholder='3,50,000'/>
                        </label>
                    </div>
                    <label>
                        Employee Id:
                    </label>
                    <input type="text" name="id" value={employee.id} onChange={handleChange} required placeholder='Enter Your Employee id'/>
                    <div className="employee-btns">

                    <button type="submit">Add</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default AddEmployee
