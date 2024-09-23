import React, { useState, useEffect } from 'react';
import './orderCreation.css';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

function OrderCreation() {
    const [materials, setMaterials] = useState([]);
    const [productionOrderId, setProductionOrderId] = useState('');
    const [productionOrderDate, setProductionOrderDate] = useState('');
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [productName, setProductName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [actualAmount, setActualAmount] = useState('');
    const [assembelyCell, setAssembelyCell] = useState('');
    const [completionWarehouse, setCompletionWarehouse] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [materialLocation, setMaterialLocation] = useState('');
    const [productionStatus, setProductionStatus] = useState('Pending');
    const [progressStatus, setProgressStatus] = useState('Completed Product Order');

    // Generate production order ID on component mount
    useEffect(() => {
        const generateProductionId = () => {
            const date = new Date();
            const formattedDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            setProductionOrderId(`${formattedDate}-${randomDigits}`);
        };
        generateProductionId();
    }, []);

    // Fetch approved materials from Firestore
    const fetchApprovedMaterials = async () => {
        const db = getFirestore();
        const materialsRef = collection(db, 'Demand_Material');
        const q = query(materialsRef, where('status', '==', 'Approved'));
        const querySnapshot = await getDocs(q);
        const materials = [];
        querySnapshot.forEach((doc) => {
            const materialData = doc.data();
            materials.push({ id: doc.id, ...materialData });
        });
        return materials;
    };

    useEffect(() => {
        const loadMaterials = async () => {
            const approvedMaterials = await fetchApprovedMaterials();
            setMaterials(approvedMaterials);
        };
        loadMaterials();
    }, []);

    // Fetch material location from Store_Racks collection based on selectedMaterialId
    useEffect(() => {
        const fetchMaterialLocation = async () => {
            const selectedMaterial = materials.find(material => material.id === selectedMaterialId);
            if (!selectedMaterial) return;

            const db = getFirestore();
            const storeRacksRef = collection(db, 'Store_Racks');
            const querySnapshot = await getDocs(storeRacksRef);

            let foundLocation = 'Location not found';
            let found = false;

            querySnapshot.forEach((doc) => {
                const { products } = doc.data();
                products.forEach((product) => {
                    if (product.id === selectedMaterial.selectedMaterialId) {
                        foundLocation = product.pLocation;
                        found = true;
                    }
                });
            });
            setMaterialLocation(foundLocation);
        };

        fetchMaterialLocation();
    }, [selectedMaterialId, materials]);




    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const db = getFirestore();
        const orderData = {
            productionOrderId,
            productionOrderDate,
            selectedMaterialId,
            quantity,
            productName,
            startDate,
            endDate,
            actualAmount,
            assembelyCell,
            completionWarehouse,
            createdBy,
            materialLocation,
            productionStatus, 
            progressStatus, 
        };
    
        try {
            await setDoc(doc(db, 'Production_Orders', productionOrderId), orderData);
            console.log('Order created successfully:', orderData);
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };
    

    return (
        <div className='main subProductionOrder' id='main'>
            <div className='grn-page'>
                <h5>Production Order Creation</h5>
                <form onSubmit={handleSubmit} className='grnForm'>
                    <div className='grnSerch'>
                        <div className='grnNum'>
                            <label>Production Order ID:</label>
                            <input
                                type="text"
                                value={productionOrderId}
                                readOnly
                            />
                        </div>
                        <div className="vendorInfo">
                            <label>Production Order Date:</label>
                            <input
                                type="date"
                                value={productionOrderDate}
                                onChange={(e) => setProductionOrderDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <hr />

                    <div className="custom-dropdown serchVendor">
                        <label>Material:</label>
                        <select
                            value={selectedMaterialId}
                            onChange={(e) => setSelectedMaterialId(e.target.value)}
                            required
                        >
                            <option value="">Select Material</option>
                            {materials.map((material) => (
                                <option key={material.id} value={material.id}>
                                    {material.selectedItem || 'Unknown'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <br />

                    <label>Quantity Requested:</label>
                    <input
                        type='text'
                        value={materials.find(material => material.id === selectedMaterialId)?.quantityRequested || 'Unknown'}
                        readOnly
                    />

                    <div className="vendorInfo">
                        <label>Planned Quantity:</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                        <label>Actual Amount:</label>
                        <input
                            type="number"
                            value={actualAmount}
                            onChange={(e) => setActualAmount(e.target.value)}
                            required
                        />

                        <label>Assembly Cell:</label>
                        <select
                            value={assembelyCell}
                            onChange={(e) => setAssembelyCell(e.target.value)}
                            required
                        >
                            <option value="">Select Production Plant</option>
                            <option value="Plant 1">Plant 1</option>
                            <option value="Plant 2">Plant 2</option>
                            <option value="Plant 3">Plant 3</option>
                            <option value="Plant 4">Plant 4</option>
                            <option value="Plant 5">Plant 5</option>
                        </select>

                        <label>Completion Warehouse:</label>
                        <select
                            value={completionWarehouse}
                            onChange={(e) => setCompletionWarehouse(e.target.value)}
                            required
                        >
                            <option value="">Select Completion Warehouse</option>
                            <option value="Warehouse 1">Warehouse 1</option>
                            <option value="Warehouse 2">Warehouse 2</option>
                            <option value="Warehouse 3">Warehouse 3</option>
                            <option value="Warehouse 4">Warehouse 4</option>
                            <option value="Warehouse 5">Warehouse 5</option>
                        </select>

                        <label>Created By:</label>
                        <input
                            type="text"
                            value={createdBy}
                            onChange={(e) => setCreatedBy(e.target.value)}
                            required
                        />

                        <label>Material Location:</label>
                        <input
                            type="text"
                            value={materialLocation}
                            readOnly
                        />

                        <label>Product Name:</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                        />

                        <label>Start Date:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />

                        <label>End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />

                        <label>Production Status:</label>
                        <input
                            type="text"
                            value={productionStatus}
                            readOnly
                        />

                        <label>Progress Status:</label>
                        <input
                            type="text"
                            value={progressStatus}
                            readOnly
                        />
                    </div>

                    <button type='submit' className='grnBtn'>
                        Create Order
                    </button>
                </form>
            </div>
        </div>
    );
}

export default OrderCreation;
