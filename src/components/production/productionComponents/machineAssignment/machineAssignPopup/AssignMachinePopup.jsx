import React, { useEffect, useState } from 'react';
import './AssignMachinePopup.css';
import { fireDB } from '../../../../firebase/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AssignMachinePopup = ({ material, isOpen, onClose }) => {
  const [productionQuantity, setProductionQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (material?.productionOrderId) {
      try {
        // Reference to the Firestore document
        const docRef = doc(fireDB, 'Production_Orders', material.productionOrderId);
        
        // Fetch the document
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          // Prepare data to update the document
          const updateData = {
            productionQuantity: productionQuantity,
            stopTime: getCurrentTime(),
            currentDate: getCurrentDate(),
            progressStatus: 'Production Completed',
            productionStatus: 'Production Phase 1 complete',
          };

          // Update the document
          await updateDoc(docRef, updateData);
          alert('Production Completed');
          onClose();
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    } else {
      console.error('No productionOrderId available');
    }
  };

  useEffect(() => {
    // Optional: You can perform actions when material changes
  }, [material]);

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour12: true, timeZone: 'Asia/Kolkata' });
  }
  function getCurrentDate() {
    const now = new Date();
    return now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  return isOpen ? (
    <div className="popup-overlay">
      <div className="popup-content">
        <h4>Stop Machine</h4>
        <form onSubmit={handleSubmit}>
          <div className='MachineAssignmentPopup'>
            <div>
              <label htmlFor="materialId">Machine Name</label>
              <input
                type="text"
                id="materialId"
                value={material?.selectedMachine || 'Not Assigned'}
                readOnly
              />

              <label htmlFor="materialName">Planned Quantity</label>
              <input
                type="text"
                id="materialName"
                value={material?.quantity || 'Not Found'}
                readOnly
              />

              <label htmlFor="productName">FG ID</label>
              <input
                type="text"
                id="productName"
                value={material?.selectedProductId || 'Not Found'}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="productionQuantity">Production Quantity</label>
              <input
                type="text"
                id="productionQuantity"
                value={productionQuantity}
                onChange={(e) => setProductionQuantity(e.target.value)}
              />

              <label htmlFor="stopTime">Stop Time</label>
              <input
                type="text"
                id="stopTime"
                value={getCurrentTime()}
                readOnly
              />

              <label htmlFor="productionOrderId">Production Order ID</label>
              <input
                type="text"
                id="productionOrderId"
                value={material?.productionOrderId || 'Not Assigned'}
                readOnly
              />
            </div>
          </div>
          <button type="submit">Stop</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  ) : null;
};

export default AssignMachinePopup;
