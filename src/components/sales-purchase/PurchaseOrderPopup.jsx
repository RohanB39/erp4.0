import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { fireDB } from '../FirebaseConfig';
import './invoicepopup.css';
import { IoCloseSharp } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';  // For generating unique PO ID

const PurchaseOrderPopup = ({ isOpen, onClose, currentUserId }) => {
    const [userData, setUserData] = useState({});
    const [vendorSearch, setVendorSearch] = useState('');
    const [vendorList, setVendorList] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [shippingAddress, setShippingAddress] = useState('');
    const [poDate, setPoDate] = useState('');
    const [poId, setPoId] = useState('');
    const [itemSearch, setItemSearch] = useState('');
    const [itemList, setItemList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    // Fetch current user details from "users" collection
    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUserId) return;
            const userQuery = query(collection(fireDB, "users"), where("userId", "==", currentUserId));
            const querySnapshot = await getDocs(userQuery);
            const userData = querySnapshot.docs.map(doc => doc.data())[0];
            setUserData(userData);
        };
        fetchUserData();
        setPoId(uuidv4()); // Generate PO ID
    }, [currentUserId]);

    // Fetch vendors based on search input
    useEffect(() => {
        const fetchVendors = async () => {
            const vendorQuery = query(collection(fireDB, "Vendors"));
            const querySnapshot = await getDocs(vendorQuery);
            const vendors = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).filter(vendor => vendor.name.toLowerCase().includes(vendorSearch.toLowerCase()));
            setVendorList(vendors);
        };
        fetchVendors();
    }, [vendorSearch]);

    // Fetch items based on search input
    useEffect(() => {
        const fetchItems = async () => {
            const itemQuery = query(collection(fireDB, "Items"));
            const querySnapshot = await getDocs(itemQuery);
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).filter(item => item.name.toLowerCase().includes(itemSearch.toLowerCase()));
            setItemList(items);
        };
        fetchItems();
    }, [itemSearch]);

    const handleVendorSelect = (vendor) => {
        setSelectedVendor(vendor);
        setVendorSearch(vendor.name);
    };

    const handleItemSelect = (item) => {
        setSelectedItem(item);
        setItemSearch(item.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPurchaseOrder = {
            userId: currentUserId,
            userDetails: userData,
            vendorDetails: selectedVendor,
            shippingAddress,
            poDate,
            poId,
            items: [
                {
                    item: selectedItem,
                    quantity,
                    price
                }
            ]
        };

        try {
            await addDoc(collection(fireDB, "purchaseOrders"), newPurchaseOrder);
            console.log("Purchase Order added successfully!");
            onClose();
        } catch (error) {
            console.error("Error adding Purchase Order: ", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className='invoice-header'>
                    <h3>Create Purchase Order</h3>
                    <button type="button" onClick={onClose}><IoCloseSharp /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* User Information */}
                    <div>
                        <label>Company Name:</label>
                        <input type="text" value={userData.companyName || ''} readOnly />
                    </div>
                    <div>
                        <label>Contact Number:</label>
                        <input type="text" value={userData.contactNumber || ''} readOnly />
                    </div>
                    <div>
                        <label>GST Number:</label>
                        <input type="text" value={userData.gstNumber || ''} readOnly />
                    </div>

                                        {/* Vendor Searchable Dropdown */}
                                        <div>
                        <label>Select Vendor:</label>
                        <input
                            type="text"
                            value={vendorSearch}
                            onChange={(e) => setVendorSearch(e.target.value)}
                            placeholder="Search vendor..."
                            required
                        />
                        {vendorList.length > 0 && (
                            <ul className="dropdown">
                                {vendorList.map((vendor) => (
                                    <li key={vendor.id} onClick={() => handleVendorSelect(vendor)}>
                                        {vendor.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {selectedVendor && (
                        <div>
                            <label>Vendor ID:</label>
                            <input type="text" value={selectedVendor.id} readOnly />
                            <label>Vendor Address:</label>
                            <input type="text" value={selectedVendor.address} readOnly />
                        </div>
                    )}

                    {/* Shipping Address */}
                    <div>
                        <label>Shipping Address:</label>
                        <input
                            type="text"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            required
                        />
                    </div>

                    {/* PO Date */}
                    <div>
                        <label>Date:</label>
                        <input
                            type="date"
                            value={poDate}
                            onChange={(e) => setPoDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* PO ID (Auto-generated) */}
                    <div>
                        <label>PO ID:</label>
                        <input type="text" value={poId} readOnly />
                    </div>

                    {/* Item Searchable Dropdown */}
                    <div>
                        <label>Select Item:</label>
                        <input
                            type="text"
                            value={itemSearch}
                            onChange={(e) => setItemSearch(e.target.value)}
                            placeholder="Search item..."
                            required
                        />
                        {itemList.length > 0 && (
                            <ul className="dropdown">
                                {itemList.map((item) => (
                                    <li key={item.id} onClick={() => handleItemSelect(item)}>
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {selectedItem && (
                        <div>
                            <label>Item ID:</label>
                            <input type="text" value={selectedItem.id} readOnly />
                        </div>
                    )}

                    {/* Quantity and Price */}
                    <div>
                        <label>Quantity:</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Submit Purchase Order</button>
                </form>
            </div>
        </div>
    );
};

export default PurchaseOrderPopup;

