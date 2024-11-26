import React, { useState } from 'react';
import { getFirestore, doc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';
import style from '../editStoreProduct/editStoreProduct.module.css'

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
            alert("Material Approved")
            onClose();
        } catch (error) {
            console.error("Error updating quantities or progressStatus: ", error);
        }
    };


    return (
        <div className={style.editPopup}>
            <div className={style.editPopupContent}>
                <div className={style.popupHeader}>
                    <h2>Edit Demand Material</h2>
                    <button onClick={onClose}>Close</button>
                </div>
                <div className={style.popupDiv}>
                    <label>Demand Document ID:</label>
                    <input type="text" value={material.productionOrderId} readOnly />
                </div>
                <div className={style.popupDiv}>
                    <label>Product ID:</label>
                    <input type="text" value={material.selectedProductId} readOnly />
                </div>
                <div className={style.popupDiv}>
                    <label>Required Materials:</label>
                    <table className={style.popupTable}>
                        <thead className={style.popupHead}>
                            <tr>
                                <th>ID</th>
                                <th>Required Quantity</th>
                            </tr>
                        </thead>
                        <tbody className={style.popupBody}>
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
                    <button className={style.approveBtn} onClick={handleSave}>Approve</button>

                </div>
            </div>
        </div>
    );
};

export default EditDemandMaterialPopup;
