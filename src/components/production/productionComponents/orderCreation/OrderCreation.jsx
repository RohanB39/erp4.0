import React, { useState, useEffect } from 'react';
import './orderCreation.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

function OrderCreation() {
    const [productionOrderId, setProductionOrderId] = useState('');
    const [productionOrderDate, setProductionOrderDate] = useState('');
    const [quantity, setQuantity] = useState(''); // Planned quantity
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [actualAmount, setActualAmount] = useState('');
    const [assembelyCell, setAssembelyCell] = useState('');
    const [completionWarehouse, setCompletionWarehouse] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [productionStatus, setProductionStatus] = useState('Pending');
    const [progressStatus, setProgressStatus] = useState('Completed Product Order');

    const [finishedGoods, setFinishedGoods] = useState([]); // State for finished goods
    const [selectedProductId, setSelectedProductId] = useState(''); // Selected product ID
    const [requiredMaterials, setRequiredMaterials] = useState([]); // Store materials as an array of objects

    // For generating unique Order ID
    useEffect(() => {
        const generateProductionId = () => {
            const date = new Date();
            const formattedDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            setProductionOrderId(`${formattedDate}-${randomDigits}`);
        };
        generateProductionId();
    }, []);

    // Fetch finished goods from Firestore
    useEffect(() => {
        const fetchFinishedGoods = async () => {
            const db = getFirestore();
            const finishedGoodsCollection = collection(db, 'Finished_Goods');
            const finishedGoodsSnapshot = await getDocs(finishedGoodsCollection);
            const finishedGoodsList = finishedGoodsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setFinishedGoods(finishedGoodsList);
        };

        fetchFinishedGoods();
    }, []);

    // Fetch required material when a product is selected
    const handleProductChange = async (e) => {
        const selectedId = e.target.value;
        setSelectedProductId(selectedId);

        const selectedProduct = finishedGoods.find(good => good.id === selectedId);
        if (selectedProduct) {
            const { rawMaterials } = selectedProduct; // Assuming rawMaterials is an array of objects
            // Map to create an array of objects with id, quantity, unit, and requiredQuantity
            const materialsWithQuantities = rawMaterials.map(material => ({
                id: material.id, // Extracting material ID
                quantity: material.quantity, // Extracting material quantity
                unit: material.unit, // Extracting unit field
                requiredQuantity: 0 // Initialize requiredQuantity to 0
            }));

            // Set the required materials as an array of objects
            setRequiredMaterials(materialsWithQuantities);
        } else {
            // Reset the required materials if no product is selected
            setRequiredMaterials([]);
        }
    };

    // Calculate required quantities based on planned quantity
    const handleQuantityChange = (e) => {
        const plannedQuantity = e.target.value;
        setQuantity(plannedQuantity);

        // Update required quantities
        const updatedMaterials = requiredMaterials.map(material => ({
            ...material,
            requiredQuantity: material.quantity * plannedQuantity, // Multiply quantity by planned quantity
        }));
        setRequiredMaterials(updatedMaterials);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Your submit logic goes here
    };

    return (
        <div className='main'>
            <div className='grn-page'>
                <h5>Production Order Creation</h5>
                <form onSubmit={handleSubmit} className='grnForm'>
                    <div className='grnSerch'>
                        <div className='grnNum'>
                            <label>Production Order ID:</label>
                            <input type="text" value={productionOrderId} readOnly />
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

                    <div className="FGDD">
                        <label>Select Finished Product:</label>
                        <select onChange={handleProductChange} value={selectedProductId} required>
                            <option value="">Select Product</option>
                            {finishedGoods.map(good => (
                                <option key={good.id} value={good.id}>
                                    {good.FGname} {/* Assuming FGname is the product name */}
                                </option>
                            ))}
                        </select>
                        <input type='text' placeholder='ID' value={selectedProductId} readOnly /> {/* Fetch the id of that selected product */}
                    </div>
                    <br />
                    <div className="">
                        <table className='vendorTable'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Quantity per piece</th>
                                    <th>Required Total Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requiredMaterials.map((material, index) => (
                                    <tr key={index}>
                                        <td>{material.id}</td>
                                        <td>{material.quantity} {material.unit}</td>
                                        <td>{material.quantity * quantity} {material.unit} </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <div className="vendorInfo">
                        <label>Planned Quantity:</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
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
                        <label>Production Status:</label>
                        <input
                            type="text"
                            value={productionStatus}
                            onChange={(e) => setProductionStatus(e.target.value)}
                            required
                        />
                        <label>Progress Status:</label>
                        <input
                            type="text"
                            value={progressStatus}
                            onChange={(e) => setProgressStatus(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className='submit-button'>Create Production Order</button>
                </form>
            </div>
        </div>
    );
}

export default OrderCreation;
