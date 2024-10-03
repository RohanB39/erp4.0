import React, { useState } from 'react';
import { fireDB } from '../../../../firebase/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AssemblyStopPopup = ({ isOpen, rowData, onClose }) => {
  const [assembledQuantity, setAssembledQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleStop = async () => {
    if (!assembledQuantity) {
      alert('Please enter assembled quantity.');
      return;
    }

    setIsLoading(true);

    try {
      const docRef = doc(fireDB, 'Production_Orders', rowData.productionOrderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const updateData = {
          assembledQuantity: Number(assembledQuantity),
          assemblyCompleteTime: new Date(),
          productionStatus: 'Assembly Completed',
          progressStatus: 'Assembly End',
        };

        await updateDoc(docRef, updateData);
        alert('Assembly stopped and data updated successfully.');

        onClose(); 
      } else {
        alert('No matching production order found.');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update assembly data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup">
      <h3>Stop Assembly</h3>
      <p><strong>Machine Name:</strong> {rowData.selectedMachine}</p>
      <p><strong>FG ID:</strong> {rowData.selectedProductId}</p>
      <p><strong>Production Order ID:</strong> {rowData.productionOrderId}</p>
      <p><strong>Assembly Start Time:</strong> {rowData.assemblyStartTimestamp ? rowData.assemblyStartTimestamp.toDate().toLocaleString() : 'N/A'}</p>
      <p><strong>Production Quantity:</strong> {rowData.productionQuantity}</p>
      <label htmlFor="assembledQuantity">Assembled Quantity</label>
      <input
        type="number"
        id="assembledQuantity"
        placeholder="Enter assembled quantity"
        value={assembledQuantity}
        onChange={(e) => setAssembledQuantity(e.target.value)}
      />
      <button onClick={handleStop} disabled={isLoading}>
        {isLoading ? 'Stopping...' : 'Stop'}
      </button>

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AssemblyStopPopup;
