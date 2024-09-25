import React, { useEffect, useState } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";
import AssignMachinePopup from '../machineAssignment/machineAssignPopup/AssignMachinePopup'; 
import './machineAssignment.css';

const MachineAssignment = () => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); 

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialsCollection = collection(fireDB, 'Production_Orders');
        const q = query(materialsCollection, where('progressStatus', '==', 'Completed Material Allocation'));
        const snapshot = await getDocs(q);
        const fetchedMaterials = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMaterials(fetchedMaterials);
      } catch (error) {
        console.error('Error fetching materials: ', error);
      }
    };

    fetchMaterials();
  }, []);

  const handleAssignMachine = (material) => {
    setSelectedMaterial(material); 
    setIsPopupOpen(true); 
  };

  const closePopup = () => {
    setIsPopupOpen(false); 
    setSelectedMaterial(null); 
  };

  return (
    <div id='main' className='main'>
      <h4>Machine Assignment</h4>
      <div>
        {materials.length > 0 ? (
          materials.map(material => (
            <div key={material.materialId} className="material-input">
              <label htmlFor={`materialId-${material.materialId}`}>Material ID</label>
              <input 
                id={`materialId-${material.materialId}`}
                type="text" 
                value={material.materialId} 
                readOnly 
                placeholder="Material ID" 
              />
              
              <label htmlFor={`productName-${material.materialId}`}>Product Name</label>
              <input 
                id={`productName-${material.materialId}`} 
                type="text" 
                value={material.productName} 
                readOnly 
                placeholder="Product Name" 
              />
              
              <label htmlFor={`quantity-${material.materialId}`}>Quantity</label>
              <input 
                id={`quantity-${material.materialId}`} 
                type="text" 
                value={material.quantity} 
                readOnly 
                placeholder="Quantity" 
              />
              
              <label htmlFor={`assemblyCell-${material.materialId}`}>Assembly Cell</label>
              <input 
                id={`assemblyCell-${material.materialId}`} 
                type="text" 
                value={material.assembelyCell} 
                readOnly 
                placeholder="Assembly Cell" 
              />
              
              <button className='grnBtn' onClick={() => handleAssignMachine(material)}>Assign Machine</button>
            </div>
          ))
        ) : (
          <p>No materials found with the status "Completed Material Allocation".</p>
        )}
      </div>

      {/* Render the popup component */}
      <AssignMachinePopup 
        material={selectedMaterial} 
        isOpen={isPopupOpen} 
        onClose={closePopup} 
      />
    </div>
  );
}

export default MachineAssignment;
