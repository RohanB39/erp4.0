import React from 'react';

const AssemblyPopup = ({ rowData, onClose }) => {
  return (
    <div className="popup">
        <h2>Assembly Details</h2>
        {rowData && (
          <div>
            <p>Production Order ID: {rowData.poid}</p>
            <p>Machine Name: {rowData.machineName}</p>
          </div>
        )}

        
        <button onClick={onClose}>Close</button>
      </div>
  );
};

export default AssemblyPopup;
