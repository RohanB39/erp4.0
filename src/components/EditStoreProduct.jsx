import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import Select from 'react-select';
import "./editStoreProduct.css";

const EditStoreProduct = ({ item, onClose, onSave }) => {
    const [rackOptions, setRackOptions] = useState([]);
    const [selectedRack, setSelectedRack] = useState(null);
    const [rackInput, setRackInput] = useState('');
    const fetchRacks = async () => {
        const db = getFirestore();
        const racksRef = collection(db, 'Store_Racks');
        try {
            const snapshot = await getDocs(racksRef);
            const racks = snapshot.docs.map(doc => ({
                value: doc.id,      
                label: doc.id       
            }));
            setRackOptions(racks);
        } catch (error) {
            console.error("Error fetching racks: ", error);
        }
    };

    useEffect(() => {
        fetchRacks();
    }, []);

    const updateMaterialStatus = async (rackId) => {
        const db = getFirestore();
        const materialRef = doc(db, 'Items', item.id);  

        try {
            
            await updateDoc(materialRef, {
                status: `Stored ${rackId}` 
            });
            console.log(`Status updated to: Stored ${rackId}`);
        } catch (error) {
            console.error('Error updating material status:', error);
        }
    };

    // Handle Save button click
    const handleSave = async () => {
        if (selectedRack) {
            console.log('Save changes for item:', item, 'Rack Location:', selectedRack);
            await updateMaterialStatus(selectedRack.label);  
            onSave(selectedRack.value);  
        }
        onClose();
    };

    return (
        <div className="edit-popup">
            <div className="edit-popup-content">
                <h2>Edit Store Product</h2>
                <div>
                    <label>ID:</label>
                    <input type="text" value={item?.id} readOnly />
                </div>
                <div>
                    <label>Product Name:</label>
                    <input type="text" defaultValue={item?.materialName} readOnly />
                </div>
                <div>
                    <label>Enter Rack Location:</label>
                    <Select
                        options={rackOptions}
                        onChange={setSelectedRack}
                        placeholder="Select a rack location"
                        value={selectedRack}
                        onInputChange={setRackInput}
                        inputValue={rackInput}
                        isClearable
                        noOptionsMessage={() => "No racks found"}
                    />
                </div>
                <div>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default EditStoreProduct;
