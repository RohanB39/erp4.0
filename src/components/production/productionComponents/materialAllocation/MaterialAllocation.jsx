import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../../firebase/FirebaseConfig';

const MaterialAllocation = () => {
    const [orders, setOrders] = useState([]);
    
    // Initialize Firestore
    const db = getFirestore(app);

    // Function to fetch data from Firestore
    const fetchOrders = async () => {
        const q = query(
            collection(db, 'Production_Orders'),
            where('progressStatus', '==', 'Material Allocated')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedOrders = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            fetchedOrders.push({
                productId: data.selectedProductId,
                productionOrderId: data.productionOrderId,
                requiredMaterials: data.requiredMaterials, // Array with material IDs and quantities
            });
        });

        setOrders(fetchedOrders);
    };

    useEffect(() => {
        fetchOrders();
    }, []); // Fetch data on component mount

    return (
        <div className='main'>
            <div className='grn-page'>
                <h4>Store Approved Orders</h4>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Sr No</th>
                            <th>Product ID</th>
                            <th>Production Order ID</th>
                            <th>Material IDs</th>
                            <th>Required Quantity</th>
                            <th>Approval Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order, index) => (
                                order.requiredMaterials.map((material, matIndex) => (
                                    <tr key={`${index}-${matIndex}`}>
                                        <td>{index + 1}</td>
                                        <td>{order.productId}</td>
                                        <td>{order.productionOrderId}</td>
                                        <td>{material.id}</td>
                                        <td>{material.requiredQuantity}</td>
                                        <td>Material Allocated</td>
                                    </tr>
                                ))
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No orders found with Material Allocated status.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaterialAllocation;
