import React, { useState, useEffect } from 'react';

import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { app } from '../../firebase/FirebaseConfig';


import style from './demandmaterial.module.css'

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
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [quantityRequested, setQuantityRequested] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [purposeOfDemand, setPurposeOfDemand] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');

  const departments = [
    'Production', 'Maintenance'
  ];

  const priorities = ['High', 'Medium', 'Low'];

  const units = ['kg', 'liters', 'pieces', 'meters'];

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
    const selectedMaterialName = event.target.value;
    const selectedItem = items.find(item => item.materialName === selectedMaterialName);
    if (selectedItem) {
      setSelectedItem(selectedMaterialName);
      setSelectedMaterialId(selectedItem.materialId);
      setSpecifications(selectedItem.specifications);
    }
  };

  const handleQuantityChange = (event) => {
    setQuantityRequested(event.target.value);
  };

  const handleUnitChange = (event) => {
    setSelectedUnit(event.target.value);
  };

  const handlePurposeChange = (event) => {
    setPurposeOfDemand(event.target.value);
  };

  const handleDeliveryLocation = (event) => {
    setDeliveryLocation(event.target.value);
  }

  const handleExpectedDeliveryDate = (e) => {
    setExpectedDeliveryDate(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const db = getFirestore(app);
    const formData = {
      uniqueId,
      requestDate,
      selectedDepartment,
      selectedPriority,
      selectedItem,
      selectedMaterialId,
      specifications,
      quantityRequested,
      selectedUnit,
      purposeOfDemand,
      deliveryLocation,
      expectedDeliveryDate,
      status: "Not Approved"
    };

    try {
      await setDoc(doc(db, 'Demand_Material', uniqueId), formData);
      alert("Demand send to store");
    } catch (error) {
      console.error("Error saving form data to Firebase: ", error);
    }
  };

  return (
    <div className={style.demandMaterialWrapper}>
      <div className={style.demandMaterialContainer}>
        <div className={style.title}>
          <i class="ri-inbox-line"></i>
          <h4>Demand Material</h4>
        </div>
        <hr className='hr' />
        <div className={style.demandHeader}>
          <div>
            <label htmlFor="uniqueId">DM ID : </label>
            <input
              type="text"
              id="uniqueId"
              value={uniqueId}
              readOnly
            />
          </div>

          <div>
            <label htmlFor="requestDate">Date : </label>
            <input
              type="date"
              id="requestDate"
              value={requestDate}
              onChange={handleDateChange}
            />
          </div>

        </div>
        <div className={style.prioritySelections}>
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
        <hr />

        {selectedMaterialId && (
          <div className={style.selectedMaterialid}>
            <p><span>Material ID : </span> {selectedMaterialId}</p>
          </div>
        )}

        {specifications && (
          <div className='selectedMaterialdesc'>
            <p><span>Description:</span>  <br />{specifications}</p>
          </div>
        )}

        <div className={style.quantitySelection}>
          <div>

            <label htmlFor="quantityRequested">Quantity Requested:</label>
            <input
              type="number"
              id="quantityRequested"
              value={quantityRequested}
              onChange={handleQuantityChange}
              placeholder="Enter quantity"
              style={{ marginRight: '10px' }}
              required
            />
          </div>

          <select
            id="unit"
            value={selectedUnit}
            onChange={handleUnitChange}
          >
            <option value="" disabled>Select Unit</option>
            {units.map(unit => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <div className={style.purposeDemand}>
          <label htmlFor="purposeOfDemand">Purpose of Demand:</label>
          <textarea
            id="purposeOfDemand"
            value={purposeOfDemand}
            onChange={handlePurposeChange}
            placeholder="Enter the purpose of the demand"
            rows="2"
            cols="40"
          />
        </div>
        <div className={style.delivery}>
          <div className={style.deliveryLocationSubmtion}>
            <div>
              <label htmlFor='deliveryLocation'>Delivery Location: </label>
              <input type='text' value={deliveryLocation} onChange={handleDeliveryLocation} placeholder='Delivery Location' />
            </div>

            <div>
              <label htmlFor="expectedDeliveryDate">Expected Delivery Date: </label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={handleExpectedDeliveryDate}
                placeholder="Expected Delivery Date"
              />
            </div>
          </div>
          <div>
            <button onClick={handleSubmit} className={style.submitButton}>Submit</button>
          </div>
        </div>


      </div>
    </div>
  );
}

export default DemandMaterial;
