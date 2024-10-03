import React, { useState } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const AssemblyPopup = ({ rowData, onClose }) => {
  const [workers, setWorkers] = useState(['']);
  const [cycleTime, setCycleTime] = useState('');
  const handleAddWorker = () => {
    setWorkers([...workers, '']);
  };

  const handleRemoveWorker = (index) => {
    const newWorkers = workers.filter((_, i) => i !== index);
    setWorkers(newWorkers); 
  };

  const handleWorkerChange = (index, value) => {
    const newWorkers = [...workers];
    newWorkers[index] = value;
    setWorkers(newWorkers);
  };

  const handleCycleTimeChange = (event) => {
    setCycleTime(event.target.value);
  };

  const cycleInSeconds = Number(cycleTime);
  const perHrQty = cycleInSeconds > 0 ? Math.round(3600 / cycleInSeconds) : 0;
  const perDayQty = cycleInSeconds > 0 ? Math.round(perHrQty * 24) : 0;
  const productionQuantity = rowData?.productionQuantity || 0;
  const totalTimeRequiredInHours = perHrQty > 0 ? (productionQuantity / perHrQty) : 0;
  const totalTimeRequiredInDays = perDayQty > 0 ? (productionQuantity / perDayQty) : 0;
  const numberOfWorkers = workers.length || 1;
  const timeRequiredInHours = totalTimeRequiredInHours / numberOfWorkers;
  const timeRequiredInDays = totalTimeRequiredInDays / numberOfWorkers;

  const handleStart = async () => {
    const productionOrderId = rowData?.poid;
    const orderDocRef = doc(fireDB, 'Production_Orders', productionOrderId);
    try {
      await updateDoc(orderDocRef, {
        assemblyWorkers: workers,
        assemblyCycleTimePerWorker: cycleTime,
        assemblyPerHourQuantity: perHrQty,
        assemblyPerDayQuantity: perDayQty,
        assemblyStartTimestamp: serverTimestamp(),
        productionStatus: 'Assembly Start',
        progressStatus: 'Assembly started'
      });
      alert('Assembly started');
      onClose();
    } catch (error) {
      console.error('Error starting assembly:', error);
    }
  };

  return (
    <div className="popup">
      <h2>Start Assembly</h2>
      {rowData && (
        <div>
          <p>Production Order Id: {rowData.poid}</p>
          <p>Machine Name: {rowData.machineName}</p>
          <p>Production Quantity: {rowData.productionQuantity}</p>
        </div>
      )}

      <h3>Workers</h3>
      {workers.map((worker, index) => (
        <div key={index} className="worker-input">
          <input
            type="text"
            value={worker}
            onChange={(e) => handleWorkerChange(index, e.target.value)}
            placeholder={`Worker ${index + 1}`}
          />
          <button onClick={() => handleRemoveWorker(index)}>x</button>
        </div>
      ))}
      <button onClick={handleAddWorker}>Add Worker</button>

      <h3>Cycle Time (in seconds)</h3>
      <input
        type="number"
        value={cycleTime}
        onChange={handleCycleTimeChange}
        placeholder="Cycle Time (seconds)"
      />
      <p>Per Hour Quantity: {perHrQty}</p>
      <p>Per Day Quantity: {perDayQty}</p>
      
      {timeRequiredInHours < 12 ? (
        <p>{timeRequiredInHours > 0 ? `Time required: ${timeRequiredInHours.toFixed(2)} hours per worker` : 'Insufficient cycle time'}</p>
      ) : (
        <p>{timeRequiredInDays > 0 ? `Time required: ${timeRequiredInDays.toFixed(2)} days per worker` : 'Insufficient cycle time'}</p>
      )}

      <button onClick={handleStart}>Start</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AssemblyPopup;
