import React, { useState } from 'react';

const AssemblyPopup = ({ rowData, onClose }) => {
  const [workers, setWorkers] = useState(['']); // Array to hold workers
  const [cycleTime, setCycleTime] = useState(''); // State for cycle time

  // Function to handle adding a worker
  const handleAddWorker = () => {
    setWorkers([...workers, '']); // Add a new empty input for a worker
  };

  // Function to handle removing a worker
  const handleRemoveWorker = (index) => {
    const newWorkers = workers.filter((_, i) => i !== index);
    setWorkers(newWorkers); // Remove worker at the specified index
  };

  // Function to handle input change for workers
  const handleWorkerChange = (index, value) => {
    const newWorkers = [...workers];
    newWorkers[index] = value; // Update the specific worker input
    setWorkers(newWorkers);
  };

  // Function to handle cycle time change
  const handleCycleTimeChange = (event) => {
    setCycleTime(event.target.value); // Update the cycle time
  };

  // Calculate quantities based on cycle time
  const cycleInSeconds = Number(cycleTime);
  const perHrQty = cycleInSeconds > 0 ? Math.round(3600 / cycleInSeconds) : 0;
  const perDayQty = cycleInSeconds > 0 ? Math.round(perHrQty * 24) : 0; // Assuming 24 hours

  // Calculate time required for the production quantity
  const productionQuantity = rowData?.productionQuantity || 0;

  // Calculate total time required based on cycle time and production quantity
  const totalTimeRequiredInHours = perHrQty > 0 ? (productionQuantity / perHrQty) : 0; // Total time required in hours
  const totalTimeRequiredInDays = perDayQty > 0 ? (productionQuantity / perDayQty) : 0; // Total time required in days

  // Divide by the number of workers if there are any workers
  const numberOfWorkers = workers.length || 1; // Prevent division by zero
  const timeRequiredInHours = totalTimeRequiredInHours / numberOfWorkers; // Time required per worker in hours
  const timeRequiredInDays = totalTimeRequiredInDays / numberOfWorkers; // Time required per worker in days

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

      <button onClick={onClose}>Start</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AssemblyPopup;
