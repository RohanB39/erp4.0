import React, { useState, useEffect } from 'react';
import './orderCreation.css';
import { useTable, usePagination } from 'react-table';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

function OrderCreation() {
    const [materials, setMaterials] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [storeRacks, setStoreRacks] = useState([]);
    const [warehouseStock, setWarehouseStock] = useState([]);

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

    useEffect(() => {
        const genrateProductionId = () => {
            const date = new Date();
            const formattedDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            setProductionOrderId(`${formattedDate}-${randomDigits}`);
        };
        genrateProductionId();
    }, []);

    const fetchMaterials = async () => {

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
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
        });
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
                            {materials.map(material => (
                                <option key={material.id} value={material.id}>
                                    {material.name} ({material.type})
                                </option>
                            ))}
                        </select>
                    </div>
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

                        <label>Assembley Cell:</label>
                        <input
                            type="number"
                            value={assembelyCell}
                            onChange={(e) => setAssembelyCell(e.target.value)}
                            required
                        />

                        <label>Completion Warehouse:</label>
                        <input
                            type="number"
                            value={completionWarehouse}
                            onChange={(e) => setCompletionWarehouse(e.target.value)}
                            required
                        />
                        <label>Created By:</label>
                        <input
                            type="number"
                            value={createdBy}
                            onChange={(e) => setCreatedBy(e.target.value)}
                            required
                        />
                        <label>Material Location:</label>
                        <input
                            type="number"
                            value={createdBy}
                            onChange={(e) => setCreatedBy(e.target.value)}
                            readOnly // this is fetching from Stored Racks
                        />
                        <label>Production Status:</label>
                        <input
                            type="number"
                            value={createdBy}
                            onChange={(e) => setCreatedBy(e.target.value)}
                            readOnly // this is fetching from Stored Racks
                        />
                        <label>Progression Status:</label>
                        <input
                            type="number"
                            value={createdBy}
                            onChange={(e) => setCreatedBy(e.target.value)}
                            readOnly // this is fetching from Stored Racks
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
