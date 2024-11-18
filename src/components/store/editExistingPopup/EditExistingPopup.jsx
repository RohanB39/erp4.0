import { React, useState, useEffect } from 'react';
import Select from 'react-select';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import './editIncomingPopup.css';

const EditExistingPopup = ({ rowData, onClose }) => {
    const [rackOptions, setRackOptions] = useState([]);
    const [selectedRack, setSelectedRack] = useState(null);
    const [rackInput, setRackInput] = useState('');
    const [existingRackLocation, setExistingRackLocation] = useState('');
    const [existingQuantity, setExistingQuantity] = useState('');
    const fetchRacks = async () => {
        const racksRef = collection(fireDB, 'Store_Racks');
        try {
            const snapshot = await getDocs(racksRef);
            let matchedRack = null;
            let foundLocation = '';
            let foundQuantity = '';
            const racks = snapshot.docs.map(doc => {
                const products = doc.data().products;
                const foundProduct = products.find(product => product.id === rowData.materialId);
                if (foundProduct) {
                    matchedRack = doc.id;
                    foundLocation = foundProduct.pLocation;
                    foundQuantity = foundProduct.quantity;
                }
                return {
                    value: doc.id,
                    label: doc.id,
                };
            });
            setRackOptions(racks);
            if (matchedRack) {
                setSelectedRack({ value: matchedRack, label: matchedRack });
                setExistingRackLocation(foundLocation);
                setExistingQuantity(foundQuantity);
            }
        } catch (error) {
            console.error("Error fetching racks: ", error);
        }
    };
    useEffect(() => {
        if (rowData?.materialId) {
            fetchRacks();
        }
    }, [rowData]);
    const handleSave = async () => {
        try {
            const itemDocRef = doc(fireDB, 'Items', rowData.materialId); 
            await updateDoc(itemDocRef, {
                GrnInvoicePrice: increment(rowData.GrnInvoicePrice),
            });
            const racksRef = collection(fireDB, 'Store_Racks');
            const racksSnapshot = await getDocs(racksRef);
            racksSnapshot.forEach(async rackDoc => {
                const products = rackDoc.data().products;
                const foundProduct = products.find(product => product.id === rowData.materialId);
                if (foundProduct) {
                    const updatedProducts = products.map(product => {
                        if (product.id === rowData.materialId) {
                            return {
                                ...product,
                                quantity: product.quantity + rowData.quantityReceived,
                            };
                        }
                        return product;
                    });
                    const rackDocRef = doc(fireDB, 'Store_Racks', rackDoc.id);
                    await updateDoc(rackDocRef, { products: updatedProducts });
                }
            });
            const purchaseOrderDocRef = doc(fireDB, 'Purchase_Orders', rowData.id); 
            await updateDoc(purchaseOrderDocRef, {
                status: 'Stored', 
            });
            alert('Save successful!');
            onClose();
        } catch (error) {
            console.error("Error updating documents: ", error);
        }
    };

    return (
        <div className="popup-data">
            <div className="popup-content">
                <h2>Edit Product</h2>
                <p>Purchase Order ID: {rowData?.id}</p>
                <p>Material ID: {rowData?.materialId}</p>
                <p>Material Name: {rowData?.materialName}</p>
                <p>Incoming Quantity: {rowData?.quantityReceived}</p>
                <p>Total Amount: {rowData?.GrnInvoicePrice}</p>

                {/* Display existing product location and quantity */}
                {existingRackLocation && (
                    <div>
                        <p><strong>Existing Material Location:</strong> {existingRackLocation}</p>
                        <p><strong>Available Quantity:</strong> {existingQuantity}</p>
                    </div>
                )}

                {/* Select a new rack location */}
                <div>
                    <label>Select a New Rack Location:</label>
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

                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default EditExistingPopup;
