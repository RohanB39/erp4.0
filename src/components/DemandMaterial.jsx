import React, { useState, useEffect } from 'react';
import './demandmaterial.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './FirebaseConfig'; // Adjust the import according to your setup

const generateUniqueId = () => {
  return 'DM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const DemandMaterial = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');

  const departments = [
    'Production', 'Maintenance'
  ];

  const priorities = ['High', 'Medium', 'Low'];

  useEffect(() => {
    const id = generateUniqueId();
    setUniqueId(id);

    const currentDate = new Date().toISOString().split('T')[0];
    setRequestDate(currentDate);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const db = getFirestore(app);
      try {
        const itemsCollection = collection(db, 'Items');
        const itemSnapshot = await getDocs(itemsCollection);
        const itemList = itemSnapshot.docs.map(doc => doc.data());

        // Filter items where status includes "Stored"
        const storedItems = itemList.filter(item => item.status.includes('Stored'));

        setItems(storedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleDateChange = (event) => {
    setRequestDate(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setSelectedPriority(event.target.value);
  };

  const handleItemChange = (event) => {
    setSelectedItem(event.target.value);
  };

  return (
    <div className='dm'>
      <h1>Demand Material</h1>
      <div>
        <label htmlFor="uniqueId">DM ID:</label>
        <input
          type="text"
          id="uniqueId"
          value={uniqueId}
          readOnly
        />
      </div>

      <div>
        <label htmlFor="requestDate">Date:</label>
        <input
          type="date"
          id="requestDate"
          value={requestDate}
          onChange={handleDateChange}
        />
      </div>

      <div>
        <label htmlFor="department">Department:</label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
        >
          <option value="" disabled>Select Department</option>
          {departments.map(department => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="priority">Priority Level:</label>
        <select
          id="priority"
          value={selectedPriority}
          onChange={handlePriorityChange}
        >
          <option value="" disabled>Select Priority</option>
          {priorities.map(priority => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="item">Select Item:</label>
        <select
          id="item"
          value={selectedItem}
          onChange={handleItemChange}
        >
          <option value="" disabled>Select Item</option>
          {items.map(item => (
            <option key={item.materialName} value={item.materialName}>
              {item.materialName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default DemandMaterial;
