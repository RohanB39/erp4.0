import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, fireDB } from '../FirebaseConfig';
import { IoCloseSharp } from "react-icons/io5";
import { Country, State, City } from 'country-state-city';

const PurchaseOrderPopup = ({ isOpen, onClose }) => {
    const [vendorSearch, setVendorSearch] = useState('');
    const [vendorList, setVendorList] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    // PO Date PO ID
    const [poDate, setPoDate] = useState('');
    const [poId, setPoId] = useState('');

    const [itemSearch, setItemSearch] = useState('');
    const [itemList, setItemList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    // Company Info
    const [companyName, setCompanyName] = useState('');
    const [companyContact, setCompanyContact] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');

    const [billingAddress, setBillingAddress] = useState('');
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingState, setShippingState] = useState('');
    const [shippingDistrict, setShippingDistrict] = useState('');
    const [shippingTaluka, setShippingTaluka] = useState('');
    const [shippingPincode, setShippingPincode] = useState('');
    const [shippingStates, setShippingStates] = useState([]);
    const [shippingCities, setShippingCities] = useState([]);

    const [billingCountry, setBillingCountry] = useState('');
    const [billingState, setBillingState] = useState('');
    const [billingDistrict, setBillingDistrict] = useState('');
    const [billingTaluka, setBillingTaluka] = useState('');
    const [billingPincode, setBillingPincode] = useState('');
    const [billingStates, setBillingStates] = useState([]);
    const [billingCities, setBillingCities] = useState([]);
    
    const countryData = Country.getAllCountries();
    const [unit, setUnit] = useState("Nos");

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;

            if (user) {
                try {
                    const userDoc = await getDoc(doc(fireDB, 'users', user.uid));

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setCompanyName(userData.companyName || 'Company name null');
                        setCompanyContact(userData.contactNumber || 'Contact number null');
                        setCompanyAddress(formatAddress(userData));
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                console.log('No user is signed in.');
            }
        };

        fetchUserData();
    }, []);

    // Update shipping states based on selected country
    useEffect(() => {
        if (shippingCountry) {
            setShippingStates(State.getStatesOfCountry(shippingCountry));
        } else {
            setShippingStates([]);
        }
    }, [shippingCountry]);

    // Update shipping cities based on selected state
    useEffect(() => {
        if (shippingState) {
            setShippingCities(City.getCitiesOfState(shippingCountry, shippingState));
        } else {
            setShippingCities([]);
        }
    }, [shippingState, shippingCountry]);

    // Update billing states based on selected country
    useEffect(() => {
        if (billingCountry) {
            setBillingStates(State.getStatesOfCountry(billingCountry));
        } else {
            setBillingStates([]);
        }
    }, [billingCountry]);

    // Update billing cities based on selected state
    useEffect(() => {
        if (billingState) {
            setBillingCities(City.getCitiesOfState(billingCountry, billingState));
        } else {
            setBillingCities([]);
        }
    }, [billingState, billingCountry]);

    const formatAddress = (data) => {
        const { country, state, district, taluka } = data;
        return `${country}, ${state}, ${district}, ${taluka}`;
    };

    // Generate unique PO ID based on vendor and company names
    useEffect(() => {
        const generateUniquePOID = (vendorName, companyName) => {
            const vendorInitials = vendorName.split(' ').map(word => word.charAt(0).toLowerCase()).join('');
            const companyInitials = companyName.split(' ').map(word => word.charAt(0).toLowerCase()).join('');
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            return `${vendorInitials}${companyInitials}PO@${randomDigits}`;
        };

        if (selectedVendor && companyName) {
            setPoId(generateUniquePOID(selectedVendor.name, companyName));
        }
    }, [selectedVendor, companyName]);

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
            })).filter(item => item.materialName && item.materialName.toLowerCase().includes(itemSearch.toLowerCase()));
            setItemList(items);
        };
        fetchItems();
    }, [itemSearch]);

    const handleVendorSelect = async (e) => {
        const selectedVendorId = e.target.value;
        const vendor = vendorList.find(v => v.id === selectedVendorId);
        setSelectedVendor(vendor);

        if (vendor) {
            try {
                const vendorDoc = await getDoc(doc(fireDB, 'Vendors', vendor.id));
                if (vendorDoc.exists()) {
                    const vendorData = vendorDoc.data();
                    const billingAddr = `${vendorData.billingAddress.address}, ${vendorData.billingAddress.country}, ${vendorData.billingAddress.district}, ${vendorData.billingAddress.state}, ${vendorData.billingAddress.taluka}, ${vendorData.billingAddress.pincode}`;
                    setBillingAddress(billingAddr);
                } else {
                    console.log('No such vendor document!');
                }
            } catch (error) {
                console.error('Error fetching vendor data:', error);
            }
        }
    };

    const handleItemSelect = (e) => {
        const selectedItemId = e.target.value;
        const item = itemList.find(i => i.id === selectedItemId);
        setSelectedItem(item);
    };

    const generatePDF = () => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/pdfmake.min.js';
        script.onload = () => {
            const pdfMake = window.pdfMake;
            pdfMake.vfs = window.pdfMake.vfs;

            const docDefinition = {
                content: [
                    { text: 'PURCHASE ORDER', style: 'header' },
                    {
                        columns: [
                            { text: `Company Name: ${companyName}\nDate: ${poDate}\nPO ID: ${poId}` },
                            { text: `Vendor Name: ${selectedVendor ? selectedVendor.name : ''}\nShip To: ${shippingCountry}, ${shippingState}, ${shippingDistrict}, ${shippingTaluka}, ${shippingPincode}` }
                        ]
                    },
                    { text: 'Item Details', style: 'subheader' },
                    {
                        table: {
                            widths: ['*', '*', '*', '*', '*'],
                            body: [
                                ['Item ID', 'Name', 'Quantity', 'Unit Price', 'Total'],
                                [
                                    selectedItem ? selectedItem.id : '',
                                    selectedItem ? selectedItem.materialName : '',
                                    quantity,
                                    price,
                                    (quantity * price).toFixed(2)
                                ]
                            ]
                        }
                    },
                    {
                        text: `Subtotal: ${quantity * price}\nTax: TBD\nShipping: TBD\nGrand Total: ${quantity * price}`,
                        style: 'total'
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 14,
                        margin: [0, 20, 0, 10]
                    },
                    total: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 20, 0, 10]
                    }
                }
            };

            pdfMake.createPdf(docDefinition).download('purchase-order.pdf');
        };
        document.body.appendChild(script);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPurchaseOrder = {
            companyName,
            companyContact,
            companyAddress,
            vendorDetails: selectedVendor || {},
            shippingAddress: {
                country: shippingCountry || '',
                state: shippingState || '',
                district: shippingDistrict || '',
                taluka: shippingTaluka || '',
                pincode: shippingPincode || ''
            },
            poDate,
            poId,
            items: [
                {
                    item: selectedItem || {}, 
                    quantity: quantity || 0,
                    price: price || 0,
                    unit: unit || 'Nos'
                }
            ]
        };
        try {
            await setDoc(doc(fireDB, "Purchase_Orders", poId), newPurchaseOrder);
            alert("Purchase Order added successfully!");
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
                    <div>
                        <label>Company Name:</label>
                        <input type="text" value={companyName} readOnly />
                    </div>
                    <div>
                        <label>Contact Number:</label>
                        <input type="text" value={companyContact} readOnly />
                    </div>
                    <div>
                        <label>Company Address:</label>
                        <textarea type="text" value={companyAddress} readOnly />
                    </div>

                    <div>
                        <label>Select Vendor:</label>
                        <select
                            value={selectedVendor ? selectedVendor.id : ''}
                            onChange={handleVendorSelect}
                            required
                        >
                            <option value="">Select a vendor...</option>
                            {vendorList.map((vendor) => (
                                <option key={vendor.id} value={vendor.id}>
                                    {vendor.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedVendor && (
                        <div>
                            <label>Vendor ID:</label>
                            <input type="text" value={selectedVendor.id} readOnly />
                            <div>
                                <label>Vendor Address:</label>
                                <textarea type="text" value={billingAddress} readOnly />
                            </div>
                        </div>
                    )}

                    <div>
                        <label>Shipping Address:</label>

                        <div>
                            <label>Country:</label>
                            <select
                                value={shippingCountry}
                                onChange={(e) => setShippingCountry(e.target.value)}
                                required
                            >
                                <option value="">Select a country...</option>
                                {countryData.map((country) => (
                                    <option key={country.isoCode} value={country.isoCode}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {shippingCountry && (
                            <div>
                                <label>State:</label>
                                <select
                                    value={shippingState}
                                    onChange={(e) => setShippingState(e.target.value)}
                                    required
                                >
                                    <option value="">Select a state...</option>
                                    {shippingStates.map((state) => (
                                        <option key={state.isoCode} value={state.isoCode}>
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {shippingState && (
                            <div>
                                <label>District:</label>
                                <select
                                    value={shippingDistrict}
                                    onChange={(e) => setShippingDistrict(e.target.value)}
                                    required
                                >
                                    <option value="">Select a district...</option>
                                    {shippingCities.map((city) => (
                                        <option key={city.isoCode} value={city.isoCode}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label>Taluka:</label>
                            <input
                                type="text"
                                value={shippingTaluka}
                                onChange={(e) => setShippingTaluka(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label>Pincode:</label>
                            <input
                                type="text"
                                value={shippingPincode}
                                onChange={(e) => setShippingPincode(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label>PO Date:</label>
                        <input
                            type="date"
                            value={poDate}
                            onChange={(e) => setPoDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>PO ID:</label>
                        <input type="text" value={poId} readOnly />
                    </div>

                    <div>
                        <label>Select Item:</label>
                        <select
                            value={selectedItem ? selectedItem.id : ''}
                            onChange={handleItemSelect}
                            required
                        >
                            <option value="">Select an item...</option>
                            {itemList.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.materialName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Quantity:</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
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

                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button type="submit">Create Purchase Order</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PurchaseOrderPopup;
