import React from 'react';
import './payitem.css';

function PayItem() {
    const handleEdit = (item) => {
        // Add logic for editing item
        alert(`Editing ${item.name}`);
    };

    const handleDelete = (item) => {
        // Add logic for deleting item
        alert(`Deleting ${item.name}`);
    };

    const payItems = [
        { name: 'Leave balance amount', category: 'Monthly remuneration', amount: '$5' },
        { name: 'Arrears of salary', category: 'Additional remuneration', amount: '$8' },
        { name: 'Gratuity', category: 'Monthly remuneration', amount: '$20' }
    ];

    return (
        <div className="payitem-container">
            <h2>Payroll Items</h2>
            <table className="payitem-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Default/Unit Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {payItems.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.amount}</td>
                            <td>
                                <button onClick={() => handleEdit(item)} className="action-button edit-button">Edit</button>
                                <button onClick={() => handleDelete(item)} className="action-button delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PayItem;
