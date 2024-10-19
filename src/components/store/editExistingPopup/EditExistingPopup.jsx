import { React, useState, useEffect } from 'react';
import Select from 'react-select';
import { getFirestore, collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import './editIncomingPopup.css';

const EditExistingPopup = ({ rowData, onClose }) => {
    const [rackOptions, setRackOptions] = useState([]);
    const [selectedRack, setSelectedRack] = useState(null);
    const [rackInput, setRackInput] = useState('');
    const [existingRackLocation, setExistingRackLocation] = useState('');
    const [existingQuantity, setExistingQuantity] = useState('');

    // Fetch racks and compare product IDs
    const fetchRacks = async () => {
        const db = getFirestore();
        const racksRef = collection(db, 'Store_Racks');
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
        const db = getFirestore();

        try {
            // 1) Update the "Items" collection
            const itemDocRef = doc(db, 'Items', rowData.materialId); // Find document by materialId
            await updateDoc(itemDocRef, {
                GrnInvoicePrice: increment(rowData.GrnInvoicePrice), // Increment the price
            });

            // 2) Update the quantity in "Store_Racks"
            const racksRef = collection(db, 'Store_Racks');
            const racksSnapshot = await getDocs(racksRef);

            racksSnapshot.forEach(async rackDoc => {
                const products = rackDoc.data().products;
                const foundProduct = products.find(product => product.id === rowData.materialId);

                if (foundProduct) {
                    const updatedProducts = products.map(product => {
                        if (product.id === rowData.materialId) {
                            return {
                                ...product,
                                quantity: product.quantity + rowData.quantityReceived, // Add the quantity
                            };
                        }
                        return product;
                    });

                    const rackDocRef = doc(db, 'Store_Racks', rackDoc.id);
                    await updateDoc(rackDocRef, { products: updatedProducts });
                }
            });

            // 3) Update the "Purchase_Orders" status
            const purchaseOrderDocRef = doc(db, 'Purchase_Orders', rowData.id); // Find by Purchase Order ID
            await updateDoc(purchaseOrderDocRef, {
                status: 'Stored', // Update status to Stored
            });

            alert('Save successful!');

            // Optionally, close the popup
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
