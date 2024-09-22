// ExportModal.jsx
import React from 'react';
import './ExportModal.css'; // Add your own styles for the modal

const ExportModal = ({ onClose, onExport }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Export Data</h3>
                <p>Choose the format you want to export:</p>
                <button onClick={() => { onExport('pdf'); onClose(); }}>Export as PDF</button>
                <button onClick={() => { onExport('excel'); onClose(); }}>Export as Excel</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default ExportModal;
