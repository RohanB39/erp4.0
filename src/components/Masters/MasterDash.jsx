import React, { useState, useMemo, useEffect } from 'react';
import './masters.css';
import DataTable from '../Masters/Subpages/DataTable';
import { AiOutlineClose } from "react-icons/ai";
import { MdEdit, MdDelete } from "react-icons/md";
import CustomerPopup from './customer/customerPopup/CustomerPopup.jsx';
import { fireDB, doc, updateDoc, collection, getDocs, addDoc, deleteDoc, query, where, auth } from '../firebase/FirebaseConfig.js';
import VendorPopup from './vendor/vendorPopup/VendorPopup.jsx';
import ItemsPopup from './items/itemsPopup/ItemsPopup.jsx';
import RawMaterialsPopup from './rawMaterial/rawMaterialPopup/RawMaterialsPopup.jsx';
import SemiFinishedPopup from './semiFinished/semiFinishedPopup/SemiFinishedPopup.jsx';
import FinishedPopup from './finished/finishedPopup/FinishedPopup.jsx';
import FGPopup from './FGProducts/FGPopup/FGPopup.jsx';

function MasterDash() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentTable, setCurrentTable] = useState('customer');
    const [formData, setFormData] = useState({ name: '', email: '', description: '' });
    const [data, setData] = useState({
        customer: [],
        vendor: [],
        items: [],
        finishedGoods: [],
        rawMaterial: [],
        semiFinished: [],
        finished: []
    });
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const getAddButtonLabel = () => {
        switch (currentTable) {
            case 'customer':
                return "+ Add Customer";
            case 'vendor':
                return "+ Add Vendor";
            case 'items':
                return "+ Add Item";
            case 'rawMaterial':
                return "+ Add Raw Materials";
            case 'semiFinished':
                return "+ Add Semi Finished Materials";
            case 'finished':
                return "+ Add Finished Materials";
            case 'finishedGoods':
                return "+Add FG"
            default:
                return "+ Add";
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (currentTable === 'customer') {
                    const querySnapshot = await getDocs(collection(fireDB, 'customers'));
                    const customers = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.data().customerNumber || doc.id
                    }));
                    setData(prevData => ({ ...prevData, customer: customers }));
                } else if (currentTable === 'vendor') {
                    const querySnapshot = await getDocs(collection(fireDB, 'Vendors'));
                    const vendors = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }));
                    setData(prevData => ({ ...prevData, vendor: vendors }));
                } else if (currentTable === 'items') {
                    const querySnapshot = await getDocs(collection(fireDB, 'Items'));
                    const items = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }));
                    setData(prevData => ({ ...prevData, items: items }));
                } else if (currentTable === 'rawMaterial') {
                    const itemsQuery = query(
                        collection(fireDB, 'Items'),
                        where('materialType', '==', 'Raw Material')
                    );
                    const querySnapshot = await getDocs(itemsQuery);
                    const items = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }));
                    setData(prevData => ({ ...prevData, rawMaterial: items }));
                } else if (currentTable === 'semiFinished') {
                    const itemsQuery = query(
                        collection(fireDB, 'Items'),
                        where('materialType', '==', 'Semi Finished Material')
                    );
                    const querySnapshot = await getDocs(itemsQuery);
                    const items = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }));
                    setData(prevData => ({ ...prevData, semiFinished: items }));
                } else if (currentTable === 'finished') {
                    const itemsQuery = query(
                        collection(fireDB, 'Items'),
                        where('materialType', '==', 'Finished Material')
                    );
                    const querySnapshot = await getDocs(itemsQuery);
                    const items = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }));
                    setData(prevData => ({ ...prevData, finished: items }));
                }else if (currentTable === 'finishedGoods') {
                    try {
                        const querySnapshot = await getDocs(collection(fireDB, 'Finished_Goods'));
                        const FG = querySnapshot.docs.map(doc => ({
                            ...doc.data(),
                            id: doc.id
                        }));
                        setData(prevData => ({ ...prevData, finishedGoods: FG }));
                    } catch (error) {
                        console.error("Error fetching Finished Goods: ", error);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [currentTable]);

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = (row) => {
        setFormData(row);
        setIsFormVisible(true);
    };

    const handleDelete = async (row) => {
        try {
            if (currentTable === 'customer') {
                await deleteDoc(doc(fireDB, 'customers', row.id));
            } else if (currentTable === 'vendor') {
                await deleteDoc(doc(fireDB, 'vendors', row.id));
            } else if (currentTable === 'items') {
                await deleteDoc(doc(fireDB, 'items', row.id));
            } else if (currentTable === 'finishedGoods') {
                await deleteDoc(doc(fireDB, 'Finished_Goods', row.id));
            }
            setData((prevData) => {
                const newData = { ...prevData };
                newData[currentTable] = newData[currentTable].filter(item => item.id !== row.id);
                return newData;
            });
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            const collectionRef = collection(fireDB, currentTable);

            if (formData.id) {
                const docRef = doc(collectionRef, formData.id);
                await updateDoc(docRef, formData);
                setData((prevData) => {
                    const newData = { ...prevData };
                    newData[currentTable] = newData[currentTable].map(item =>
                        item.id === formData.id ? formData : item
                    );
                    return newData;
                });
            } else {
                const docRef = await addDoc(collectionRef, formData);
                formData.id = docRef.id;
                setData((prevData) => {
                    const newData = { ...prevData };
                    newData[currentTable].push(formData);
                    return newData;
                });
            }
            setFormData({ name: '', email: '', description: '' });
            setIsFormVisible(false);
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    const handleSaveCustomer = (customer) => {
        setData((prevData) => {
            const newData = { ...prevData };
            newData.customer.push(customer);
            return newData;
        });
        setIsPopupVisible(false);
    };

    const actionColumn = {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
            <div>
                <button onClick={() => handleEdit(row.original)}><MdEdit /></button>
                <button onClick={() => handleDelete(row.original)}><MdDelete /></button>
            </div>
        ),
    };

    const formatAddress = (address) => {
        if (typeof address === 'object') {
            return `${address.country}, ${address.state}, ${address.district}, ${address.taluka}, ${address.pincode}`;
        }
        return address;
    };

    const columns = useMemo(() => {
        switch (currentTable) {
            case 'customer':
                return [
                    {
                        Header: 'Sr/No',
                        accessor: 'id',
                        Cell: ({ row }) => row.index + 1
                    },
                    { Header: 'CID', accessor: 'uniqueID' },
                    { Header: 'Name', accessor: 'name' },
                    { Header: 'Shipping Address', accessor: 'shippingAddress', Cell: ({ value }) => formatAddress(value) },
                    { Header: 'Billing Address', accessor: 'billingAddress', Cell: ({ value }) => formatAddress(value) },
                    { Header: 'Phone NO.', accessor: 'phoneNumber' },
                    actionColumn
                ];
            case 'vendor':
                return [
                    {
                        Header: 'Sr/No',
                        accessor: 'id',
                        Cell: ({ row }) => row.index + 1
                    },
                    { Header: 'VID', accessor: 'uniqueID' },
                    { Header: 'Name', accessor: 'name' },
                    { Header: 'Shipping Address', accessor: 'shippingAddress', Cell: ({ value }) => formatAddress(value) },
                    { Header: 'Billing Address', accessor: 'billingAddress', Cell: ({ value }) => formatAddress(value) },
                    { Header: 'Phone NO.', accessor: 'phoneNumber' },
                    actionColumn
                ];
            case 'items':
                return [
                    {
                        Header: 'Sr/No',
                        accessor: 'id',
                        Cell: ({ row }) => row.index + 1
                    },
                    { Header: 'MID', accessor: 'materialId' },
                    { Header: 'Name', accessor: 'materialName' },
                    { Header: 'Type', accessor: 'materialType' },
                    { Header: 'Status', accessor: 'status' },
                    actionColumn
                ];
            case 'rawMaterial':
                return [
                    {
                        Header: 'Sr/No',
                        accessor: 'id',
                        Cell: ({ row }) => row.index + 1
                    },
                    { Header: 'MID', accessor: 'materialId' },
                    { Header: 'Name', accessor: 'materialName' },
                    { Header: 'Quantity', accessor: 'qty' },
                    { Header: 'Status', accessor: 'status' },
                    actionColumn
                ];
            case 'semiFinished':
                return [
                    {
                        Header: 'Sr/No',
                        accessor: 'id',
                        Cell: ({ row }) => row.index + 1
                    },
                    { Header: 'MID', accessor: 'materialId' },
                    { Header: 'Name', accessor: 'materialName' },
                    { Header: 'Quantity', accessor: 'qty' },
                    { Header: 'Status', accessor: 'status' },
                    actionColumn
                ];
            case 'finished':
                return [
                    {
                        Header: 'Sr/No',
                        accessor: 'id',
                        Cell: ({ row }) => row.index + 1
                    },
                    { Header: 'MID', accessor: 'materialId' },
                    { Header: 'Name', accessor: 'materialName' },
                    { Header: 'Quantity', accessor: 'qty' },
                    { Header: 'Status', accessor: 'status' },
                    actionColumn
                ];
            case 'finishedGoods':
                return [
                    {
                        Header: 'Sr/No',
                        accessor: 'id',
                        Cell: ({ row }) => row.index + 1
                    },
                    { Header: 'FGID', accessor: 'uniqueID'},
                    { Header: 'Name', accessor: 'FGname'},
                    { Header: 'Status', accessor: 'status'},
                    { Header: 'Customer', accessor: 'customerID'},
                    actionColumn
                ];
            default:
                return [];
        }
    }, [currentTable]);

    const getHeader = () => {
        switch (currentTable) {
            case 'customer':
                return "Customer Table";
            case 'vendor':
                return "Vendor Table";
            case 'items':
                return "Items Table";
            case 'rawMaterial':
                return "Raw Material Table";
            case 'semiFinished':
                return "Semi-Finished Goods Table";
            case 'finished':
                return "Finished Goods Table";
            case 'finishedGoods':
                return "FG Table";
            default:
                return "Table";
        }
    };

    return (
        <>
            <div className="master-container">
                <div className="master-header" id='main'>
                    <div className='h3'>
                        <h3>Master Analysis</h3>
                        <p>See your latest Master Analysis</p>
                    </div>
                    <div className='buttons'>
                        <button onClick={() => setCurrentTable('customer')}>Total Customer</button>
                        <button onClick={() => setCurrentTable('vendor')}>Total Vendor</button>
                        <button onClick={() => setCurrentTable('items')}>Total Items</button>
                        <button onClick={() => setCurrentTable('finishedGoods')}>Finished Goods</button>
                    </div>
                </div>
            </div>

            <div className="master-cards-item" id='main'>
                <div className="single-card-item" onClick={() => setCurrentTable('rawMaterial')}>
                    <div>
                        <h3>Raw Material</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia commodi quam accusantium?</p>
                    </div>
                </div>
                <div className="single-card-item" onClick={() => setCurrentTable('semiFinished')}>
                    <div>
                        <h3>Semi Finished</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia commodi quam accusantium?</p>
                    </div>
                </div>
                <div className="single-card-item" onClick={() => setCurrentTable('finished')}>
                    <div>
                        <h3>Finished</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia commodi quam accusantium?</p>
                    </div>
                </div>
            </div>

            <div className="customer-list" id="main">
                <div className="customer-section">
                    <div className="title">
                        <h3>{getHeader()}</h3>
                        <button className='button primary-button' onClick={() => setIsPopupVisible(true)}>
                            {getAddButtonLabel()}
                        </button>
                    </div>
                    <div className="content">
                        <DataTable data={data[currentTable]} columns={columns} />
                    </div>
                </div>
            </div>

            {isPopupVisible && currentTable === 'customer' && (
                <CustomerPopup
                    onClose={() => setIsPopupVisible(false)}
                />
            )}

            {isPopupVisible && currentTable === 'vendor' && (
                <VendorPopup
                    onClose={() => setIsPopupVisible(false)}
                />
            )}

            {isPopupVisible && currentTable === 'items' && (
                <ItemsPopup
                    onClose={() => setIsPopupVisible(false)}
                />
            )}
            {isPopupVisible && currentTable === 'rawMaterial' && (
                <RawMaterialsPopup
                    onClose={() => setIsPopupVisible(false)}
                />
            )}
            {isPopupVisible && currentTable === 'semiFinished' && (
                <SemiFinishedPopup
                    onClose={() => setIsPopupVisible(false)}
                />
            )}
            {isPopupVisible && currentTable === 'finished' && (
                <FinishedPopup
                    onClose={() => setIsPopupVisible(false)}
                />
            )}
            {isPopupVisible && currentTable === 'finishedGoods' && (
                <FGPopup
                    onClose={() => setIsPopupVisible(false)}
                />
            )}
        </>
    );
}

export default MasterDash;
