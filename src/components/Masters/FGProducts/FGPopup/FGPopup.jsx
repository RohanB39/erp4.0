import React, { useState, useEffect } from "react";
import "./fgpopup.css";
import { fireDB } from '../../../firebase/FirebaseConfig';
import { doc, getDoc, collection, getDocs, query, where, setDoc } from "firebase/firestore";

const FGPopup = ({ onClose }) => {
    const [FGname, setFGName] = useState("");
    const [uniqueID, setUniqueID] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [customerUniqueID, setCustomerUniqueID] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [rawMaterials, setRawMaterials] = useState([]);
    const [rawMaterialSelections, setRawMaterialSelections] = useState([{ id: Date.now(), value: "", quantity: "" }]);
    const [rawUniqueIDs, setRawUniqueIDs] = useState({});
    const [unit, setUnit] = useState("Nos");
    const [weightOfgoods, setWeightOfgoods] = useState("");
    const [unitOfgoods, setUnitOfGoods] = useState("Nos");

    useEffect(() => {
        const generateUniqueID = (FGname) => {
            const initials = FGname.split(' ').map(word => word.charAt(0).toLowerCase()).join('');
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            return `${initials}.FG@${randomDigits}`;
        };
        setUniqueID(generateUniqueID(FGname));
    }, [FGname]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const customerCollection = collection(fireDB, "customers");
                const customerSnapshot = await getDocs(customerCollection);
                const customerList = customerSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCustomers(customerList);
            } catch (error) {
                console.error("Error fetching customers: ", error);
            }
        };

        const fetchRawMaterials = async () => {
            try {
                const rawMaterialQuery = query(
                    collection(fireDB, "Items"),
                    where("materialType", "==", "Raw Material")
                );
                const rawMaterialSnapshot = await getDocs(rawMaterialQuery);
                const rawMaterialList = rawMaterialSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRawMaterials(rawMaterialList);
            } catch (error) {
                console.error("Error fetching raw materials: ", error);
            }
        };

        fetchCustomers();
        fetchRawMaterials();
    }, []);

    const formatAddress = (address) => {
        if (address && typeof address === 'object') {
            return `${address.address}, ${address.taluka}, ${address.district}, ${address.state}, ${address.country} - ${address.pincode}`;
        }
        return "";
    };

    const handleCustomerSelect = async (customerId) => {
        setSelectedCustomer(customerId);
        if (customerId) {
            try {
                const customerDoc = doc(fireDB, "customers", customerId);
                const customerSnapshot = await getDoc(customerDoc);
                if (customerSnapshot.exists()) {
                    const customerData = customerSnapshot.data();
                    setCustomerUniqueID(customerData.uniqueID || "");
                    setCustomerAddress(formatAddress(customerData.shippingAddress || {}));
                } else {
                    setCustomerUniqueID("");
                    setCustomerAddress("");
                }
            } catch (error) {
                console.error("Error fetching customer data: ", error);
            }
        } else {
            setCustomerUniqueID("");
            setCustomerAddress("");
        }
    };

    const handleRawMaterialSelect = async (id, rawMaterialID) => {
        const newUniqueIDs = { ...rawUniqueIDs, [id]: "" };
        setRawMaterialSelections((prevSelections) =>
            prevSelections.map((selection) => {
                if (selection.id === id) {
                    newUniqueIDs[id] = rawMaterialID; 
                    return { ...selection, value: rawMaterialID };
                }
                return selection;
            })
        );

        setRawUniqueIDs(newUniqueIDs); 

        if (rawMaterialID) {
            try {
                const rawDoc = doc(fireDB, "Items", rawMaterialID);
                const rawSnapShot = await getDoc(rawDoc);
                if (rawSnapShot.exists()) {
                    const rawData = rawSnapShot.data();
                    setRawUniqueIDs((prev) => ({ ...prev, [id]: rawData.materialId || "" }));
                } else {
                    setRawUniqueIDs((prev) => ({ ...prev, [id]: "" }));
                }
            } catch (error) {
                console.error("Error fetching raw material data: ", error);
            }
        } else {
            setRawUniqueIDs((prev) => ({ ...prev, [id]: "" }));
        }
    };


    const addRawMaterialSelection = () => {
        setRawMaterialSelections((prev) => [...prev, { id: Date.now(), value: "", quantity: "" }]);
    };

    const removeRawMaterialSelection = (id) => {
        setRawMaterialSelections((prev) => prev.filter((selection) => selection.id !== id));
        const newUniqueIDs = { ...rawUniqueIDs };
        delete newUniqueIDs[id];
        setRawUniqueIDs(newUniqueIDs);
    };

    const handleQuantityChange = (id, quantity) => {
        setRawMaterialSelections((prev) =>
            prev.map((selection) => {
                if (selection.id === id) {
                    return { ...selection, quantity: quantity };
                }
                return selection;
            })
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finishedGoodData = {
            FGname,
            uniqueID,
            customerID: customerUniqueID,
            customerAddress,
            rawMaterials: rawMaterialSelections.map(selection => ({
                id: rawUniqueIDs[selection.id],
                quantity: selection.quantity,
                unit : "KG",
            })),
            weightOfgoods,
            unitOfgoods,
            unit,
            status:"Active",
            createdAt: new Date(),
        };

        try {
            const docRef = doc(fireDB, "Finished_Goods", uniqueID);
            await setDoc(docRef, finishedGoodData);
            setSuccessMessage("Finished Goods created successfully!");
            setFGName("");
            setUniqueID("");
            setCustomerUniqueID("");
            setCustomerAddress("");
            setRawMaterialSelections([{ id: Date.now(), value: "", quantity: "" }]);
            setWeightOfgoods("");
            setUnit("Nos");
            setUnitOfGoods("Nos");
            setRawUniqueIDs({});
        } catch (error) {
            console.error("Error saving finished goods: ", error);
            setSuccessMessage("Error saving finished goods.");
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="form-head">
                    <h3>Create Finished Goods</h3>
                    <button onClick={onClose}>×</button>
                </div>
                <hr />
                <div className="customer-id">
                    <span>FG ID : </span> {uniqueID}
                </div>
                {successMessage && <div className="success-message">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input
                            className="nameInput"
                            type="text"
                            placeholder="Enter Product Name"
                            value={FGname}
                            onChange={(e) => setFGName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="NameID">
                        <select
                            className="nameInput"
                            value={selectedCustomer}
                            onChange={(e) => handleCustomerSelect(e.target.value)}
                            required
                        >
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            className="nameInput"
                            value={customerUniqueID}
                            placeholder="Customer ID"
                            readOnly
                        />
                    </div>

                    <div className="NameID">
                        <textarea
                            className="nameInput"
                            value={customerAddress}
                            readOnly
                            rows="4"
                            placeholder="Shipping Address will appear here"
                        />
                    </div>

                    {rawMaterialSelections.map((selection) => (
                        <div key={selection.id} className="rawmaterial">
                            <select
                                className="nameInput"
                                value={selection.value} // Ensure value is bound to the selected material ID
                                onChange={(e) => handleRawMaterialSelect(selection.id, e.target.value)}
                                required
                            >
                                <option value="">Select Raw Material</option>
                                {rawMaterials.map((rawMaterial) => (
                                    <option key={rawMaterial.id} value={rawMaterial.id}>
                                        {rawMaterial.materialName}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                className="nameInput"
                                value={rawUniqueIDs[selection.id] || ""}
                                placeholder="Raw Material ID"
                                readOnly
                            />
                            <input
                                type="number"
                                className="nameInput"
                                value={selection.quantity}
                                onChange={(e) => handleQuantityChange(selection.id, e.target.value)}
                                placeholder="Quantity"
                                required
                            />
                            <button type="button" onClick={addRawMaterialSelection}>
                                +
                            </button>
                            <button type="button" onClick={() => removeRawMaterialSelection(selection.id)}>
                                -
                            </button>
                        </div>
                    ))}
                    <div className="qty">
                        <select value={unit} onChange={(e) => setUnit(e.target.value)} required>
                            <option value="Nos">Nos</option>
                            <option value="KG">KG</option>
                            <option value="GRAM">GRAM</option>
                            <option value="METER">METER</option>
                            <option value="FEET">FEET</option>
                            <option value="MILLILITERS">MILLILITERS</option>
                            <option value="LITERS">LITERS</option>
                        </select>
                    </div>

                    <div className="weight">
                        <input
                            type="number"
                            className="nameInput"
                            value={weightOfgoods}
                            onChange={(e) => setWeightOfgoods(e.target.value)}
                            placeholder="Enter Weight Of FG"
                            required
                        />
                        <select value={unitOfgoods} onChange={(e) => setUnitOfGoods(e.target.value)} required>
                            <option value="Nos">Nos</option>
                            <option value="KG">KG</option>
                            <option value="GRAM">GRAM</option>
                            <option value="METER">METER</option>
                            <option value="FEET">FEET</option>
                            <option value="MILLILITERS">MILLILITERS</option>
                            <option value="LITERS">LITERS</option>
                        </select>
                    </div>
                    <button type="submit">Create Finished Goods</button>
                </form>
            </div>
        </div>
    );
};

export default FGPopup;
