import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../../firebase/FirebaseConfig';
import style from './materialAllocation.module.css'

const MaterialAllocation = () => {
    const [orders, setOrders] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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
                id: doc.id,
                productId: data.selectedProductId,
                productionOrderId: data.productionOrderId,
                requiredMaterials: data.requiredMaterials, // Array with material IDs and quantities
            });
        });

        setOrders(fetchedOrders);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    // Function to handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtered orders based on the search term
    const filteredOrders = orders.filter(order =>
        order.productId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={style.materialAllocation}>
            <div className={style.materialPage}>
                <div className={style.title}>
                    <i class="ri-task-line"></i>
                    <h4>Store Approved Orders</h4>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search by Product ID"
                        value={searchTerm}
                        onChange={handleSearch}
                        className='sarch'
                    />
                </div>
            </div>
            <hr className='hr' />
            {/* Search bar */}
            <div>
                <table className={style.materialTable}>
                    <thead className={style.materialTableHeader}>
                        <tr>
                            <th>Sr No</th>
                            <th>Product ID</th>
                            <th>Production Order ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={style.materialTableBody}>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => (
                                <React.Fragment key={order.id}>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{order.productId}</td>
                                        <td>{order.productionOrderId}</td>
                                        <td>
                                            <button onClick={() => toggleRow(order.id)} className={style.btn}>
                                                {expandedRows.includes(order.id) ? 'Hide Materials' : 'Show Materials'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRows.includes(order.id) && (
                                        <tr className={style.expandedRow}>
                                            <td colSpan="4">
                                                <table className={style.expandedTable}>
                                                    <thead className={style.expandedTableHeader}>
                                                        <tr>
                                                            <th>Material ID</th>
                                                            <th>Required Quantity</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className={style.expandedTableBody}>
                                                        {order.requiredMaterials.map((material, matIndex) => (
                                                            <tr key={`${order.id}-${matIndex}`}>
                                                                <td>{material.id}</td>
                                                                <td>{material.requiredQuantity} {material.unit}</td>
                                                                <td>Material Allocated By Store</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className={style.errorMessage}>No orders found with Material Allocated status.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaterialAllocation;
