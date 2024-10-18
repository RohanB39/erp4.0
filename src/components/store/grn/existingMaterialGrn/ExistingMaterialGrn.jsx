import React, { useState, useEffect } from 'react';
import { fireDB } from "../../../firebase/FirebaseConfig";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import './existingMaterialGrn.css';

const ExistingMaterialGrn = () => {
    const [grnNumber, setGrnNumber] = useState('');
    const [vendorId, setVendorId] = useState('');
    const [vendorName, setVendorName] = useState('');
    const [vendors, setVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [selectedMaterialId, setSelectedMaterialId] = useState(''); // Selected material ID
    const [quantityReceived, setQuantityReceived] = useState('');
    const [GRNDate, setGRNDate] = useState('');
    const [vendorInvoice, setVendorInvoice] = useState('');
    const [GrnInvoicePrice, setGrnInvoicePrice] = useState('');
    const [status, setStatus] = useState('Inward');

    useEffect(() => {
        const generateGrnNumber = () => {
            const date = new Date();
            const formattedDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            setGrnNumber(`${formattedDate}-${randomDigits}`);
        };
        generateGrnNumber();
    }, []);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const querySnapshot = await getDocs(collection(fireDB, "Vendors"));
                const vendorList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    uniqueID: doc.data().uniqueID,
                }));
                setVendors(vendorList);
            } catch (error) {
                console.error("Error fetching vendors: ", error);
            }
        };
        fetchVendors();
    }, []);

    const fetchPurchaseOrders = async (vendorId) => {
        try {
            const q = query(
                collection(fireDB, "Purchase_Orders"),
                where("vendorId", "==", vendorId),
                where("status", "==", "Not Assigned")
            );

            const querySnapshot = await getDocs(q);
            const materialList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                materialName: doc.data().materialName,
            }));
            setPurchaseOrders(materialList);
        } catch (error) {
            console.error("Error fetching purchase orders: ", error);
        }
    };

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);

        if (searchTerm !== '') {
            const filtered = vendors.filter(vendor =>
                vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredVendors(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleVendorSelect = (vendor) => {
        setVendorId(vendor.uniqueID);
        setVendorName(vendor.name);
        setSearchTerm(vendor.name);
        setShowDropdown(false);

        fetchPurchaseOrders(vendor.uniqueID);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMaterialId) {
            alert('Please select a material');
            return;
        }

        try {
            // Reference to the selected material document
            const materialDocRef = doc(fireDB, "Purchase_Orders", selectedMaterialId);

            // Update the document with the new fields
            await updateDoc(materialDocRef, {
                grnNumber,
                vendorInvoice,
                GrnInvoicePrice: parseFloat(GrnInvoicePrice),
                quantityReceived: parseInt(quantityReceived),
                GRNDate,
                status
            });

            alert('GRN updated successfully!');
        } catch (error) {
            console.error("Error updating GRN: ", error);
            alert('Failed to update GRN');
        }
    };

    return (
        <div className='main' id='main'>
            <div className='grn-page'>
                <h4>GRN Form</h4>
            </div>

            <form onSubmit={handleSubmit} className='grnForm'>
                <div className='grnSerch'>
                    <div className='grnNum'>
                        <label htmlFor='grnNumber'>GRN Number:</label>
                        <input
                            type='text'
                            id='grnNumber'
                            value={grnNumber}
                            readOnly
                        />
                    </div>

                    <div className="custom-dropdown serchVendor">
                        <label htmlFor='vendorId'>Search Vendor:</label>
                        <input
                            type='text'
                            placeholder='Select Vendor'
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {showDropdown && filteredVendors.length > 0 && (
                            <ul className="dropdown-list">
                                {filteredVendors.map((vendor) => (
                                    <li
                                        key={vendor.id}
                                        onClick={() => handleVendorSelect(vendor)}
                                        className='dropdown-item'
                                    >
                                        {vendor.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <hr />
                <div className='vendorInfo'>
                    {vendorName && (
                        <>
                            <p><strong>Vendor Name:</strong> {vendorName}</p>
                            <p><strong>Vendor ID:</strong> {vendorId}</p>
                        </>
                    )}
                </div>

                <div className='vendorInfo'>
                    <label htmlFor="materialName">Select Material:</label>
                    <select
                        id="materialName"
                        name="materialName"
                        onChange={(e) => setSelectedMaterialId(e.target.value)}
                    >
                        <option value="">Select Material</option>
                        {purchaseOrders.map((order) => (
                            <option key={order.id} value={order.id}>
                                {order.materialName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='vendorInvoice'>
                    <label htmlFor="vendorInvoice">Vendor Invoice:</label>
                    <input
                        type="text"
                        id="vendorInvoice"
                        value={vendorInvoice}
                        onChange={(e) => setVendorInvoice(e.target.value)}
                        placeholder="Enter Vendor Invoice"
                    />
                </div>

                <div className='grnInvoicePrice'>
                    <label htmlFor="grnInvoicePrice">Invoice Price:</label>
                    <input
                        type="number"
                        id="grnInvoicePrice"
                        value={GrnInvoicePrice}
                        onChange={(e) => setGrnInvoicePrice(e.target.value)}
                        placeholder="Enter Invoice Price"
                    />
                </div>

                <div className='quantityReceived'>
                    <label htmlFor="quantityReceived">Quantity Received:</label>
                    <input
                        type="number"
                        id="quantityReceived"
                        value={quantityReceived}
                        onChange={(e) => setQuantityReceived(e.target.value)}
                        placeholder="Enter Quantity Received"
                    />
                </div>

                <div className='GRNDate'>
                    <label htmlFor="GRNDate">GRN Date:</label>
                    <input
                        type="date"
                        id="GRNDate"
                        value={GRNDate}
                        onChange={(e) => setGRNDate(e.target.value)}
                    />
                </div>

                <div className='statusDropdown'>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Inward">Inward</option>
                        <option value="Hold">Hold</option>
                    </select>
                </div>

                <div className='submitButton'>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default ExistingMaterialGrn;
