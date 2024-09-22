import React, { useState, useEffect, useRef } from "react";
import { fireDB } from "../../../firebase/FirebaseConfig";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./itemsPopup.css";

const ItemsPopup = ({ onClose }) => {
    const [uniqueID, setUniqueID] = useState("");
    const [vendorId, setVendorId] = useState("");
    const [vendorName, setVendorName] = useState("");
    const [vendors, setVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [materialType, setMaterialType] = useState("");
    const [materialName, setMaterialName] = useState("");
    const [specifications, setSpecifications] = useState("");
    const [hsnCode, setHsnCode] = useState("");
    const [batchNumber, setBatchNumber] = useState("");
    const [batchDate, setBatchDate] = useState(new Date());
    const [qty, setQty] = useState("");
    const [status] = useState("QC Pending");
    const [unit, setUnit] = useState("Nos");
    const [price, setPrice] = useState("");
    const [totalPrice, setTotalPrice] = useState("");

    const generateUniqueID = (name) => {
        const initials = name.split(' ').map(word => word.charAt(0).toLowerCase()).join('');
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        return `${initials}.mate@${randomDigits}`;
    };

    useEffect(() => {
        if (materialName) {
            const id = generateUniqueID(materialName);
            setUniqueID(id);
        }
    }, [materialName]);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const querySnapshot = await getDocs(collection(fireDB, "Vendors"));
                const vendorList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name
                }));
                setVendors(vendorList);
            } catch (error) {
                console.error("Error fetching vendors: ", error);
            }
        };

        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsDropdownOpen(value.length > 0);
    };

    const handleOptionSelect = (vendor) => {
        setVendorName(vendor.name);
        setVendorId(vendor.id);
        setSearchTerm(vendor.name);
        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullQty = `${qty} ${unit}`;
        try {
            await setDoc(doc(fireDB, "Items", uniqueID), {
                vendorId,
                vendorName,
                materialType,
                materialName,
                specifications,
                hsnCode,
                batchNumber,
                batchDate: batchDate.toISOString(),
                qty: fullQty,
                status,
                perItemPrice: price,
                price: totalPrice,
                materialId: uniqueID
            });
            alert("Item added successfully!");
            onClose();
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    };

    const dropdownRef = useRef();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (qty && price) {
            setTotalPrice((parseFloat(qty) * parseFloat(price)).toFixed(2));
        } else {
            setTotalPrice("");
        }
    }, [qty, price]);
    


    return (
        <div className="popup-overlay">
            <div className="popup-content" ref={dropdownRef}>
                <div className="form-head">
                    <h2>Add Item</h2>
                    <button onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Vendor Id"
                        value={vendorId}
                        readOnly
                    />
                    <div className="custom-dropdown">
                        <input
                            type="text"
                            placeholder="Select Vendor"
                            value={searchTerm}
                            onChange={handleInputChange}
                            onClick={() => setIsDropdownOpen(searchTerm.length > 0)}
                        />
                        {isDropdownOpen && filteredVendors.length > 0 && (
                            <div className="dropdown-options">
                                {filteredVendors.map(vendor => (
                                    <div
                                        key={vendor.id}
                                        className="dropdown-option"
                                        onClick={() => handleOptionSelect(vendor)}
                                    >
                                        {vendor.name}
                                    </div>
                                ))}
                            </div>
                        )}
                        {isDropdownOpen && filteredVendors.length === 0 && (
                            <div className="dropdown-option">
                                No vendors found
                            </div>
                        )}
                    </div>
                    <select
                        value={materialType}
                        onChange={(e) => setMaterialType(e.target.value)}
                        required
                    >
                        <option value="">Select Material Type</option>
                        <option value="Raw Material">Raw Material</option>
                        <option value="Semi Finished Material">Semi Finished Material</option>
                        <option value="Finished Material">Finished Material</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Material Name"
                        value={materialName}
                        onChange={(e) => setMaterialName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Specifications"
                        value={specifications}
                        onChange={(e) => setSpecifications(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="HSN Code"
                        value={hsnCode}
                        onChange={(e) => setHsnCode(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Batch Number"
                        value={batchNumber}
                        onChange={(e) => setBatchNumber(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Quantity"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        required
                    />
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} required>
                        <option value="Nos">Nos</option>
                        <option value="KG">KG</option>
                        <option value="GRAM">GRAM</option>
                        <option value="METER">METER</option>
                        <option value="FEET">FEET</option>
                        <option value="CENTIMETER">CENTIMETER</option>
                        <option value="MILLIMETER">MILLIMETER</option>
                        <option value="LITER">LITER</option>
                        <option value="OTHER">OTHER</option>
                    </select>
                    <input
                        type="hidden"
                        value={status}
                    />
                    <input
                        type="text"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Total Price"
                        value={totalPrice}
                        readOnly
                    />

                    <DatePicker
                        selected={batchDate}
                        onChange={date => setBatchDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className="date-picker"
                        placeholderText="Batch Date"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Material Id"
                        value={uniqueID}
                        readOnly
                    />
                    <button type="submit">Add</button>
                </form>
            </div>

        </div>
    );
};

export default ItemsPopup;
