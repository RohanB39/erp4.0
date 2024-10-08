// ModalForm.js
import React from 'react';
import './modalform.css';

import { IoClose } from "react-icons/io5";

function ModalForm({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className='modal-header'>

                <h2>Create New Production</h2>
                <button type="button" onClick={onClose}><IoClose /></button>
                </div>
                <form>
                    <label>
                        Reference No:
                    </label>
                        <input type="text" name="referenceNo" />
                    <label>
                        Process No:
                    </label>
                        <input type="text" name="processNo" />
                  
                    <button type="submit">Submit</button>
              
                </form>
            </div>
        </div>
    );
}

export default ModalForm;
