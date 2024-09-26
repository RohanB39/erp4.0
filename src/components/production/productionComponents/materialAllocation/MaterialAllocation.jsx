import React, { useEffect, useState, useRef } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../../firebase/FirebaseConfig';

const MaterialAllocation = () => {
    const [completedOrders, setCompletedOrders] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const formRef = useRef(null); // Ref to scroll to the form
    const [productionStatus] = useState('Pending');
    const [progressStatus] = useState('Completed Material Allocation');
    const [materialAllocationId, setMaterialAllocationId] = useState('');

    // Generate material allocation ID on component mount
    useEffect(() => {
        const generateMaterialAllocationId = () => {
            const date = new Date();
            const formattedDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            setMaterialAllocationId(`${formattedDate}-${randomDigits}`);
        };
        generateMaterialAllocationId();
    }, []);

    useEffect(() => {
        // Fetch completed product orders
        const fetchCompletedOrders = async () => {
            const db = getFirestore(app);
            const productionOrdersRef = collection(db, 'Production_Orders');
            const q = query(productionOrdersRef, where('progressStatus', '==', 'Completed Product Order'));

            try {
                const querySnapshot = await getDocs(q);
                const orders = [];
                querySnapshot.forEach((doc) => {
                    orders.push({
                        id: doc.id, // Store document ID for future reference
                        productName: doc.data().productName,
                    });
                });
                setCompletedOrders(orders);
            } catch (error) {
                console.error('Error fetching production orders: ', error);
            }
        };

        fetchCompletedOrders();
    }, []);

    const handleProductChange = async (event) => {
        const productId = event.target.value; // Get selected product ID
        setSelectedProduct(productId);

        if (productId) {
            const db = getFirestore(app);
            const docRef = doc(db, 'Production_Orders', productId);

            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setOrderDetails(docSnap.data());
                    // Scroll to form once product is selected
                    formRef.current.scrollIntoView({ behavior: 'smooth' });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching order details: ', error);
            }
        } else {
            setOrderDetails(null);
        }
    };

    const handleAllocateMaterial = async () => {
        if (!orderDetails || !selectedProduct) return; // Don't proceed if orderDetails are not available

        const { productName, materialId, quantityRequested } = orderDetails;
        const db = getFirestore(app);

        try {
            // 1. Update the "progressStatus" in the selected production order
            const productionOrderRef = doc(db, 'Production_Orders', selectedProduct);
            await updateDoc(productionOrderRef, {
                progressStatus: 'Completed Material Allocation',
            });

            // 2. Save data to the "Material_Allocation" collection with materialAllocationId as the document ID
            const materialAllocationRef = doc(db, 'Material_Allocation', materialAllocationId);
            await setDoc(materialAllocationRef, {
                productName,
                materialAllocationId,
                materialId,
                productionStatus,
                progressStatus,
                requestedQuantity: quantityRequested,
            });

            alert('Material allocated and production order updated successfully!');
        } catch (error) {
            console.error('Error allocating material: ', error);
            alert('Failed to allocate material. Please try again.');
        }
    };

    return (
        <div className='main'>
            <div className='grn-page'>
                <h2>Completed Product Orders</h2>
                {completedOrders.length > 0 ? (
                    <select value={selectedProduct} onChange={handleProductChange} className="custom-dropdown serchVendor">
                        <option value="">Select a product</option>
                        {completedOrders.map((order) => (
                            <option key={order.id} value={order.id}>
                                {order.productName}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p>No completed product orders found.</p>
                )}

                {/* Form Section */}
                {selectedProduct && orderDetails && (
                    <div ref={formRef} className='order-details-form'>
                        <h3>Material Allocation for {orderDetails.productName}</h3>
                        <form className='grnForm'>
                            <div className='grnNum'>
                                <label>Material Allocation ID:</label>
                                <input
                                    type="text"
                                    value={materialAllocationId}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label>Material ID:</label>
                                <input type='text' value={orderDetails.materialId} readOnly />
                            </div>
                            <div>
                                <label>Quantity Requested:</label>
                                <input type='text' value={orderDetails.quantityRequested} readOnly />
                            </div>
                            <div>
                                <label>Production Status:</label>
                                <input type='text' value={productionStatus} readOnly />
                            </div>
                            <div>
                                <label>Progress Status:</label>
                                <input type='text' value={progressStatus} readOnly />
                            </div>
                            <button type='button' onClick={handleAllocateMaterial} className='grnBtn'>
                                Allocate Material
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaterialAllocation;
