import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, updateDoc, doc } from "firebase/firestore";
import { fireDB } from '../../../../firebase/FirebaseConfig';
import './AssignMachinePopup.css'; 

const AssignMachinePopup = ({ material, isOpen, onClose }) => {
  const [machines, setMachines] = useState([]);                                      
  const [selectedMachine, setSelectedMachine] = useState(null); 
  const [cycle, setCycle] = useState(''); 
  const [machineTime, setMachineTime] = useState(''); 
  const [materialName, setMaterialName] = useState(''); 

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const machinesCollection = collection(fireDB, 'Machines');
        const q = query(machinesCollection, where('machineStatus', '==', 'Active')); 
        const snapshot = await getDocs(q);
        const fetchedMachines = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMachines(fetchedMachines); 
      } catch (error) {
        console.error('Error fetching machines: ', error);
      }
    };

    if (isOpen) {
      fetchMachines(); 
    }
  }, [isOpen]);

  const fetchMaterialName = async (materialId) => {
    try {
      const itemsCollection = collection(fireDB, 'Items');
      const q = query(itemsCollection, where('materialId', '==', materialId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const fetchedItem = snapshot.docs[0].data(); 
        setMaterialName(fetchedItem.materialName || ''); 
      } else {
        setMaterialName(''); 
      }
    } catch (error) {
      console.error('Error fetching material name:', error);
    }
  };

  const handleMachineSelect = (machineId) => {
    const selected = machines.find(machine => machine.id === machineId);
    setSelectedMachine(selected); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMachine) return;

    try {

      await addDoc(collection(fireDB, 'Assign_Machines'), {
        materialId: material.materialId,
        productName: material.productName,
        machineId: selectedMachine.id,
        machineName: selectedMachine.machineName,
        machineType: selectedMachine.selectedMachineType,
        cycle: cycle,
        machineTime: machineTime,
        status: 'Machine Assigned',
      });


      const productionOrderDocRef = doc(fireDB, 'Production_Orders', material.id);
      await updateDoc(productionOrderDocRef, {
        progressStatus: 'Machine assignment done'
      });

      console.log('Machine assignment successful!');
      onClose(); 
    } catch (error) {
      console.error('Error assigning machine:', error);
    }
  };

  useEffect(() => {
    if (material?.materialId) {
      fetchMaterialName(material.materialId); 
    }
  }, [material?.materialId]);

  return isOpen ? (
    <div className="popup-overlay">
      <div className="popup-content">
        <h4>Assign Machine</h4>
        <form onSubmit={handleSubmit}>
          <label htmlFor="materialId">Material ID</label>
          <input 
            type="text" 
            id="materialId" 
            value={material?.materialId || ''} 
            readOnly 
          />

          <label htmlFor="materialName">Material Name</label>
          <input 
            type="text" 
            id="materialName" 
            value={materialName || 'Not Found'} 
            readOnly 
          />

          <label htmlFor="productName">Product Name</label>
          <input 
            type="text" 
            id="productName" 
            value={material?.productName || ''} 
            readOnly 
          />

          <label htmlFor="machineName">Select Machine</label>
          <select 
            id="machineName" 
            onChange={(e) => handleMachineSelect(e.target.value)} 
            required
          >
            <option value="">-- Select a Machine --</option>
            {machines.map(machine => (
              <option key={machine.id} value={machine.id}>
                {machine.machineName}
              </option>
            ))}
          </select>

          {selectedMachine && (
            <>
              <label htmlFor="selectedMachineName">Machine Name</label>
              <input 
                type="text" 
                id="selectedMachineName" 
                value={selectedMachine?.machineName || ''} 
                readOnly 
              />

              <label htmlFor="selectedMachineType">Machine Type</label>
              <input 
                type="text" 
                id="selectedMachineType" 
                value={selectedMachine?.selectedMachineType || ''} 
                readOnly 
              />
            </>
          )}

          <label htmlFor="cycle">Cycle</label>
          <input 
            type="text" 
            id="cycle" 
            value={cycle} 
            onChange={(e) => setCycle(e.target.value)} 
            placeholder="Enter Cycle" 
            required 
          />

          <label htmlFor="machineTime">Machine Time (in minutes)</label>
          <input 
            type="text" 
            id="machineTime" 
            value={machineTime} 
            onChange={(e) => setMachineTime(e.target.value)} 
            placeholder="Enter Machine Time" 
            required 
          />

          <button type="submit">Assign</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  ) : null;
};

export default AssignMachinePopup;
