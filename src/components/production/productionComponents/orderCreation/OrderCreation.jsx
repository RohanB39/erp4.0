import React, { useState, useEffect } from 'react';

import { getFirestore, collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';

import style from './orderCreation.module.css'

function OrderCreation() {
    const [productionOrderId, setProductionOrderId] = useState('');
    const [productionOrderDate, setProductionOrderDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [assembelyCell, setAssembelyCell] = useState('');
    const [completionWarehouse, setCompletionWarehouse] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [productionStatus, setProductionStatus] = useState('Pending');
    const [progressStatus, setProgressStatus] = useState('Completed Product Order');

    const [finishedGoods, setFinishedGoods] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [requiredMaterials, setRequiredMaterials] = useState([]);
    const [excessBuffer, setExcessBuffer] = useState('');
    const [machines, setMachines] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState('');


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
            const { rawMaterials } = selectedProduct;
            // Map to create an array of objects with id, quantity, unit, and requiredQuantity
            const materialsWithQuantities = rawMaterials.map(material => ({
                id: material.id,
                quantity: material.quantity,
                unit: material.unit,
                requiredQuantity: 0
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
            requiredQuantity: material.quantity * plannedQuantity,
        }));
        setRequiredMaterials(updatedMaterials);
    };

    const handleBufferChange = (e) => {
        const bufferValue = e.target.value;
        const bufferPercentage = parseFloat(bufferValue) || 0;
        setExcessBuffer(bufferValue); // Store the raw input value for display

        // Apply the buffer to each material's requiredQuantity
        const updatedMaterials = requiredMaterials.map(material => {
            const baseRequiredQuantity = material.quantity * quantity; // Base required quantity based on planned quantity
            const newRequiredQuantity = baseRequiredQuantity * (1 + bufferPercentage / 100); // Apply the buffer or 0%
            return {
                ...material,
                requiredQuantity: newRequiredQuantity // Set the new required quantity with buffer
            };
        });

        setRequiredMaterials(updatedMaterials); // Update the state with the new values
    };

    useEffect(() => {
        const fetchMachines = async () => {
            const db = getFirestore();
            const machinesCollection = collection(db, 'Machines');
            const activeMachinesQuery = query(machinesCollection, where('machineStatus', '==', 'Active'));
            const machinesSnapshot = await getDocs(activeMachinesQuery);
            const activeMachinesList = machinesSnapshot.docs.map(doc => ({
                id: doc.id,
                machineName: doc.data().machineName,
            }));
            setMachines(activeMachinesList);
        };

        fetchMachines();
    }, []);

    const handleMachineChange = (e) => {
        setSelectedMachine(e.target.value);
    };




    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const db = getFirestore();

            // Prepare the data to be saved in Firestore
            const productionOrderData = {
                productionOrderId,
                productionOrderDate,
                quantity: parseFloat(quantity),
                startDate,
                endDate,
                assembelyCell,
                completionWarehouse,
                createdBy,
                productionStatus,
                progressStatus,
                selectedProductId,
                selectedMachine,
                excessBuffer: parseFloat(excessBuffer) || 0,
                requiredMaterials: requiredMaterials.map(material => ({
                    id: material.id,
                    requiredQuantity: material.requiredQuantity,
                    unit: material.unit
                })),
            };

            // Set the document in the "Production_Orders" collection with the document ID as "productionOrderId"
            await setDoc(doc(db, 'Production_Orders', productionOrderId), productionOrderData);

            // Reset form (optional)
            alert('Production Order created successfully');
            setProductionOrderId('');
            setProductionOrderDate('');
            setQuantity('');
            setStartDate('');
            setEndDate('');
            setAssembelyCell('');
            setCompletionWarehouse('');
            setCreatedBy('');
            setProductionStatus('Pending');
            setProgressStatus('Completed Product Order');
            setSelectedProductId('');
            setRequiredMaterials([]);
            setSelectedMachine('');
            setExcessBuffer('');
        } catch (error) {
            console.error('Error creating production order: ', error);
            alert('Failed to create production order');
        }
    };

    return (
        <div className={style.OrderCreationWrapper}>
            <div className={style.orderCreationContainer}>
                <div className={style.title}>
                    <i class="ri-task-line"></i>
                    <h5>Production Order Creation</h5>
                </div>
                <hr className='hr' />
                <form onSubmit={handleSubmit} className={style.orderForm}>
                    <div className={style.orderSearch}>
                        <div className={style.orderNum}>
                            <label>Production Order ID:</label>
                            <input type="text" value={productionOrderId} readOnly />
                        </div>
                        <div className={style.vendorInfo}>
                            <label>Production Order Date:</label>
                            <input
                                type="date"
                                value={productionOrderDate}
                                onChange={(e) => setProductionOrderDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <hr className='hr' />

                    <div className={style.fgdd}>
                        <div className={style.fgddDiv}>

                            <label>Select Finished Product:</label>
                            <select onChange={handleProductChange} value={selectedProductId} required>
                                <option value="">Select Product</option>
                                {finishedGoods.map(good => (
                                    <option key={good.id} value={good.id}>
                                        {good.FGname} {/* Assuming FGname is the product name */}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input type='text' placeholder='ID' value={selectedProductId} readOnly />
                    </div>
                    <br />
                    <div>
                        <table className={style.vendorTable}>
                            <thead className={style.vendorTableHeader}>
                                <tr>
                                    <th>ID</th>
                                    <th>Quantity per piece</th>
                                    <th>Required Total Quantity</th>
                                </tr>
                            </thead>
                            <tbody className={style.vendorTableBody}>
                                {requiredMaterials.map((material, index) => (
                                    <tr key={index}>
                                        <td>{material.id}</td>
                                        <td>{material.quantity} {material.unit}</td>
                                        <td>{material.requiredQuantity.toFixed(2)} {material.unit} {/* Updated to use requiredQuantity */}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                    <br />
                    <div className={style.vendorInfo}>
                        <label>Planned Quantity:</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            required
                        />
                        <label>Excess Material Buffer:</label>
                        <input
                            type="number"
                            value={excessBuffer}
                            onChange={handleBufferChange}
                            placeholder='eg 20%'
                            required
                        />
                        <label>Machine Assignment:</label>
                        <select value={selectedMachine} onChange={handleMachineChange} required>
                            <option value="" disabled>Select Machine</option>
                            {machines.map(machine => (
                                <option key={machine.id} value={machine.machineName}>
                                    {machine.machineName}
                                </option>
                            ))}
                        </select>

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

                    <button type="submit" className={style.orderSubmitBtn}>Create Production Order</button>
                </form>
            </div>
        </div>
    );
}

export default OrderCreation;
