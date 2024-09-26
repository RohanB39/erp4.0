import React, { useState } from 'react';
import { getFirestore, doc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';
import './editdemandmaterialpopup.css';

const EditDemandMaterialPopup = ({ material, onClose, onSave }) => {
    const [materials, setMaterials] = useState(material.requiredMaterials);
    const db = getFirestore();

    const handleQuantityChange = (id, newQuantity) => {
        const quantity = newQuantity === '' ? '' : Number(newQuantity);
        setMaterials((prevMaterials) =>
            prevMaterials.map((mat) =>
                mat.id === id ? { ...mat, requiredQuantity: quantity } : mat
            )
        );
    };

    const handleSave = async () => {
        try {
            const rackCollection = collection(db, 'Store_Racks');
            const rackSnapshot = await getDocs(rackCollection);
            const rackDocs = rackSnapshot.docs;
            const quantityMap = {};
            materials.forEach(mat => {
                if (mat.requiredQuantity > 0) {
                    if (!quantityMap[mat.id]) {
                        quantityMap[mat.id] = 0;
                    }
                    quantityMap[mat.id] += mat.requiredQuantity;
                }
            });
            for (const rackDoc of rackDocs) {
                const products = rackDoc.data().products || [];
                for (const product of products) {
                    if (quantityMap[product.id]) {
                        const updatedQuantity = Number(product.quantity) - quantityMap[product.id];
                        product.quantity = updatedQuantity < 0 ? 0 : updatedQuantity; 
                        await updateDoc(doc(db, 'Store_Racks', rackDoc.id), {
                            products: products
                        });
                    }
                }
            }
            const prodOrderQuery = query(collection(db, 'Production_Orders'), where('productionOrderId', '==', material.productionOrderId));
            const prodOrderSnapshot = await getDocs(prodOrderQuery);

            if (!prodOrderSnapshot.empty) {
                const productionOrderDoc = prodOrderSnapshot.docs[0];
                await updateDoc(doc(db, 'Production_Orders', productionOrderDoc.id), {
                    progressStatus: 'Material Allocated'
                });
            }
            onClose();
        } catch (error) {
            console.error("Error updating quantities or progressStatus: ", error);
        }
    };
    

    return (
        <div className="edit-popup">
            <div className="edit-popup-content">
                <h2>Edit Demand Material</h2>
                <div>
                    <label>Demand Document ID:</label>
                    <input type="text" value={material.productionOrderId} readOnly />
                </div>
                <div>
                    <label>Product ID:</label>
                    <input type="text" value={material.selectedProductId} readOnly />
                </div>
                <div>
                    <label>Required Materials:</label>
                    <table className="MaterialTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Required Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((mat) => (
                                <tr key={mat.id}>
                                    <td>{mat.id}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={mat.requiredQuantity === 0 ? '' : mat.requiredQuantity}
                                            onChange={(e) => handleQuantityChange(mat.id, e.target.value)}
                                            placeholder="Enter quantity"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default EditDemandMaterialPopup;
