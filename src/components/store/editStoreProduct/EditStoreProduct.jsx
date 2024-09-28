import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import Select from 'react-select';
import "./editStoreProduct.css";

const EditStoreProduct = ({ item, onClose, onSave }) => {
    const [rackOptions, setRackOptions] = useState([]);
    const [selectedRack, setSelectedRack] = useState(null);
    const [rackInput, setRackInput] = useState('');
    const [quantity, setQuantity] = useState('Loading...');  // Loading state for quantity

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

    const fetchQuantity = async () => {
        const db = getFirestore();
        const purchaseOrdersRef = collection(db, 'Purchase_Orders');

        try {
            console.log("Fetching quantity for material ID:", item.id);

            const snapshot = await getDocs(purchaseOrdersRef);
            const matchingDoc = snapshot.docs.find(doc => doc.data().materialId === item.id);

            if (matchingDoc) {
                const orderData = matchingDoc.data();
                console.log("Matching document found:", orderData);

                if (orderData.quantity !== undefined) {
                    setQuantity(orderData.quantity);
                } else {
                    console.error("No 'quantity' field found in the matching document");
                    setQuantity('Not Available');
                }
            } else {
                console.error("No matching Purchase Order document found for material ID:", item.id);
                setQuantity('Not Available');
            }
        } catch (error) {
            console.error("Error fetching quantity:", error);
            setQuantity('Error fetching data');
        }
    };

    useEffect(() => {
        fetchRacks();
        if (item?.id) {
            fetchQuantity();
        } else {
            console.log("Item ID is missing, cannot fetch quantity");
        }
    }, [item]);

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

    const saveProductToRack = async (rackId) => {
        const db = getFirestore();
        const rackRef = doc(db, 'Store_Racks', rackId);  // Reference to the selected rack document
    
        const productData = {
            id: item.id,
            materialName: item.materialName,
            quantity: quantity,
            pLocation: selectedRack.value
        };
    
        try {
            console.log(`Attempting to save product to rack ${rackId}:`, productData);  // Log before saving
    
            // Check if the rack document exists
            const rackDoc = await getDoc(rackRef);
            if (!rackDoc.exists()) {
                console.error(`Rack document ${rackId} does not exist.`);
                return; // Early return if the document doesn't exist
            }
    
            // Use arrayUnion to add product data to the "products" field in the rack document
            await updateDoc(rackRef, {
                products: arrayUnion(productData) // Append product data to the array
            });
    
            console.log(`Product successfully saved to rack ${rackId}`);
        } catch (error) {
            console.error('Error saving product to rack:', error);  // Log any errors
        }
    };
    
    

    const handleSave = async () => {
        if (selectedRack) {
            console.log('Save changes for item:', item, 'Rack Location:', selectedRack);

            // Update material status in 'Items' collection
            await updateMaterialStatus(selectedRack.label);

            // Save product data to selected rack in 'Store_Racks' collection
            await saveProductToRack(selectedRack.value);

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
                    <label>Product Quantity:</label>
                    <input type="text" value={quantity} readOnly /> {/* Display fetched quantity */}
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
                    <button onClick={handleSave}>Approve</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default EditStoreProduct;
