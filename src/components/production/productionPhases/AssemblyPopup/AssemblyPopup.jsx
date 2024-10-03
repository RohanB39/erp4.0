import React from 'react';

const AssemblyPopup = ({ rowData, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Assembly Details</h2>
        
        {/* Display data if passed */}
        {rowData && (
          <div>
            <p>Production Order ID: {rowData.poid}</p>
            <p>Machine Name: {rowData.machineName}</p>
            {/* Add more details as needed */}
          </div>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AssemblyPopup;
