// MaterialAllocation.jsx
import React, { useState, useEffect } from 'react';

function MaterialAllocation() {
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        // Fetch materials from an API or database
        // Example fetch function
        const fetchMaterials = async () => {
            const response = await fetch('/api/materials');
            const data = await response.json();
            setMaterials(data);
        };

        fetchMaterials();
    }, []);

    return (
        <div className='main' id='main'>
            <h5>Material Allocation</h5>
            <ul>
                {materials.map(material => (
                    <li key={material.id}>{material.name} - {material.quantity}</li>
                ))}
            </ul>
        </div>
    );
}

export default MaterialAllocation;
