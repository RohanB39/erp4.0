import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import "./demandMaterialPopup.css";

const DemandMaterialEdit = ({ item, onClose, onSave }) => {
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [requestedQuantity, setRequestedQuantity] = useState('');
    const [message, setMessage] = useState('');
    const [rackId, setRackId] = useState('');

    const fetchAllRacks = async () => {
        const db = getFirestore();
        const racksCollection = collection(db, 'Store_Racks');
        const racksSnapshot = await getDocs(racksCollection);
        const racks = [];

        racksSnapshot.forEach((doc) => {
            racks.push({ id: doc.id, ...doc.data() });
        });

        return racks;
    };

    const fetchProductDetails = async () => {
        const racks = await fetchAllRacks();
        console.log('Fetched Racks:', racks);

        let productFound = false;

        for (const rack of racks) {
            if (rack.products && Array.isArray(rack.products)) {
                console.log(`Checking Rack: ${rack.id}`);
                const product = rack.products.find(product => product.id === item?.selectedMaterialId);
                if (product) {
                    setProductName(product.materialName || '');
                    setQuantity(product.quantity || '');
                    setRackId(rack.id);
                    productFound = true;
                    break;
                }
            } else {
                console.warn(`Rack ${rack.id} has no products or is not an array.`);
            }
        }

        if (!productFound) {
            setMessage('No product found for the selected Material ID.');
        }
    };

    useEffect(() => {
        if (item?.selectedMaterialId) {
            setProductName('');
            setQuantity('');
            setMessage('');
            fetchProductDetails();
            setRequestedQuantity(item?.quantityRequested || '');
        }
    }, [item?.selectedMaterialId]);

    const handleSave = async () => {
        const db = getFirestore();
        if(requestedQuantity > quantity){
            alert("Requested quantity exceeds available stock");
            return;
        }

        const updatedQuantity = quantity - requestedQuantity;
        if (updatedQuantity < 0) {
            setMessage('Error: Requested quantity exceeds available stock.');
            return;
        }

        try {
            const rackRef = doc(db, 'Store_Racks', rackId);
            const rackSnapshot = await getDoc(rackRef);

            if (rackSnapshot.exists()) {
                const rackData = rackSnapshot.data();
                const updatedProducts = rackData.products.map(product => {
                    if (product.id === item?.selectedMaterialId) {
                        return {
                            ...product,
                            quantity: updatedQuantity
                        };
                    }
                    return product;
                });

                updateDoc(rackRef, { products: updatedProducts });
                const demandMaterialRef = doc(db, 'Demand_Material', item?.id);
                await updateDoc(demandMaterialRef, { status: 'Approved', approvedQty: requestedQuantity  });
                setMessage('Product quantity updated and status set to "Approved"!');
                alert("Ok");
            } else {
                setMessage('Error: Rack not found.');
            }
        } catch (error) {
            console.error('Error updating Firestore:', error);
            setMessage('Error updating product quantity and status.');
        }
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
                    <label>Material ID:</label>
                    <input type="text" value={item?.selectedMaterialId || 'N/A'} readOnly />
                </div>

                <div>
                    <label>Product Name:</label>
                    <input type="text" value={productName || 'N/A'} readOnly />
                </div>

                <div>
                    <label>Quantity In Stock:</label>
                    <input type="text" value={quantity || 'N/A'} readOnly />
                </div>

                <div>
                    <label>Requested Quantity:</label>
                    <input
                        type="text"
                        value={requestedQuantity}
                        onChange={(e) => setRequestedQuantity(e.target.value)} 
                    />
                </div>

                {message && <div className="message">{message}</div>} 

                <div>
                    <button onClick={handleSave}>Approve</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default DemandMaterialEdit;
