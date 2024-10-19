import React from 'react';
import './editIncomingPopup.css';

const EditExistingPopup = ({ rowData, onClose }) => {
    return (
        <div className="popup-data">
          <div className="popup-content">
            <h2>Edit Product</h2>
            <p>ID: {rowData?.materialId}</p>
            <p>Name: {rowData?.materialName}</p>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      );
}

export default EditExistingPopup