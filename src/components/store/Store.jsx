import React, { useMemo, useEffect, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import './Store.css';
import EditStoreProduct from './editStoreProduct/EditStoreProduct';
import DemandMaterialEdit from '../production/demandMaterial/DemandMaterialEdit';
import EditDemandMaterialPopup from '../store/editDemandMaterialPopup/EditDemandMaterialPopup';
import { fireDB } from '../firebase/FirebaseConfig';
import EditExistingPopup from './editExistingPopup/EditExistingPopup';
import UpdateExistingPaymentPopup from './updateExistingorderPayment/UpdateExistingPaymentPopup';


const Store = () => {
    const [incomingStock, setIncomingStock] = useState([]);
    const [demandMaterials, setdemandMaterials] = useState([]);
    const [warehouseStock, setWarehouseStock] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDMEditPopup, seisDMEditPopup] = useState(false);
    const [DMSelectedItem, setDMSelectedItem] = useState(null);
    const [productionDemandMaterials, setProductionDemandMaterials] = useState([]);
    const [isProductionDemandEditPopupOpen, setProductionDemandEditPopupOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [incomingExistingStock, setIncomingExistingStock] = useState([]);
    const [isExistingIncomingPopupOpen, setExistingIncomingPopupOpen] = useState(false);
    const [editRowData, setEditRowData] = useState(null);
    const [isPaymentStatusPopupOpen, setIsPaymentStatusPopupOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);


    const fetchData = async () => {
        const db = getFirestore();
        const materialsRef = collection(db, 'Items');
        const demandRef = collection(db, 'Demand_Material');
        const racksRef = collection(db, 'Store_Racks');
        try {
            const demandMaterialQuery = query(
                demandRef,
                where('status', '==', 'Not Approved'),
            );
            const demandSnapshot = await getDocs(demandMaterialQuery);
            const demandMaterial = demandSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setdemandMaterials(demandMaterial);


            const incomingQuery = query(
                materialsRef,
                where('status', '==', 'QC Approved'),
                // where('materialLocation', '==', null)
            );
            const incomingSnapshot = await getDocs(incomingQuery);
            const incomingMaterials = incomingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setIncomingStock(incomingMaterials);


            // Fetching warehouse stock from Store_Racks collection
            const racksSnapshot = await getDocs(racksRef);
            const racksData = racksSnapshot.docs.map(doc => {
                const data = doc.data();
                // Check if products exists and is an array
                if (Array.isArray(data.products)) {
                    return data.products.map(product => ({
                        id: product.id,
                        materialName: product.materialName,
                        quantity: product.quantity,
                        rackLocation: product.pLocation,
                    }));
                }
                return []; // Return an empty array if products is undefined or not an array
            }).flat(); // Flatten the array to get a single-level array

            setWarehouseStock(racksData);
        } catch (error) {
            console.error("Error fetching materials: ", error);
        }
    };



    useEffect(() => {
        fetchData();
    }, []);


    const fetchProductionDemandData = async () => {
        const db = getFirestore();
        const productionDemandRef = collection(db, 'Production_Orders');

        try {
            // Fetching production demand
            const productionDemandQuery = query(
                productionDemandRef,
                where('progressStatus', '==', 'Completed Product Order')
            );
            const productionDemandSnapshot = await getDocs(productionDemandQuery);
            const productionDemandMaterial = productionDemandSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProductionDemandMaterials(productionDemandMaterial);
        } catch (error) {
            console.error("Error fetching materials: ", error);
        }
    };

    useEffect(() => {
        fetchProductionDemandData();
    }, []);

    const fetchExistingIncomingStockData = async () => {
        const db = getFirestore();
        const existingIncoming = collection(db, 'Purchase_Orders');

        try {
            // Fetching production demand
            const productionDemandQuery = query(
                existingIncoming,
                where('status', '==', 'QC Approved')
            );
            const productionDemandSnapshot = await getDocs(productionDemandQuery);
            const productionDemandMaterial = productionDemandSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setIncomingExistingStock(productionDemandMaterial);
        } catch (error) {
            console.error("Error fetching materials: ", error);
        }
    };

    useEffect(() => {
        fetchExistingIncomingStockData();
    }, []);

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsPopupOpen(true);
    };

    const handleDemandMaterialEdit = (item) => {
        setDMSelectedItem(item);
        seisDMEditPopup(true);
    };

    const handleProductionDemandMaterialEdit = (material) => {
        setSelectedMaterial(material);
        setProductionDemandEditPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleApprove = async (material) => {
        const selectedMaterialId = material.selectedMaterialId;
        const quantityRequested = material.quantityRequested;
        const documentId = material.id;

        try {
            const storeRacksRef = collection(fireDB, 'Store_Racks');
            const storeRacksSnapshot = await getDocs(storeRacksRef);

            let updated = false;
            for (const docSnapshot of storeRacksSnapshot.docs) {
                const data = docSnapshot.data();
                const products = data.products || [];
                const product = products.find((prod) => prod.id === selectedMaterialId);

                if (product) {
                    const newQuantity = product.quantity - quantityRequested;
                    if (newQuantity < 0) {
                        alert("Stock not available");
                        return;
                    }
                    const storeRackDocRef = doc(fireDB, 'Store_Racks', docSnapshot.id);
                    await updateDoc(storeRackDocRef, {
                        products: products.map((prod) =>
                            prod.id === selectedMaterialId ? { ...prod, quantity: newQuantity } : prod
                        ),
                    });
                    updated = true;

                    alert(`Successfully updated quantity for ${selectedMaterialId}.`);
                    const demandMaterialDocRef = doc(fireDB, 'Demand_Material', documentId);
                    await updateDoc(demandMaterialDocRef, {
                        status: 'Approved'
                    });
                    break;
                }
            }

            if (!updated) {
                alert(`No product found with ID: ${selectedMaterialId}`);
            }

        } catch (error) {
            console.error("Error updating quantity:", error);
            alert("An error occurred while updating the quantity.");
        }
    };


    const handleSaveLocation = async (item, location) => {
        const db = getFirestore();
        const itemRef = doc(db, 'Items', item.id);

        try {
            await updateDoc(itemRef, { materialLocation: location });
            setIncomingStock(prev => prev.filter(i => i.id !== item.id));
            setWarehouseStock(prev => [...prev, { ...item, materialLocation: location }]);
        } catch (error) {
            console.error("Error updating location: ", error);
        }
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedItem(null);
    };


    // Incoming Table 
    const incomingColumns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Product Name',
                accessor: 'materialName',
            },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <div>
                        <button onClick={() => handleEdit(row.original)}>Edit</button>
                    </div>
                ),
            },
        ],
        []
    );

    const {
        getTableProps: getIncomingTableProps,
        getTableBodyProps: getIncomingTableBodyProps,
        headerGroups: incomingHeaderGroups,
        page: incomingPage,
        prepareRow: prepareIncomingRow,
        canPreviousPage: canPreviousIncomingPage,
        canNextPage: canNextIncomingPage,
        pageOptions: incomingPageOptions,
        pageCount: incomingPageCount,
        nextPage: nextIncomingPage,
        previousPage: previousIncomingPage,
        setPageSize: setIncomingPageSize,
        state: { pageIndex: incomingPageIndex, pageSize: incomingPageSize },
    } = useTable(
        {
            columns: incomingColumns,
            data: incomingStock,
            initialState: { pageIndex: 0 },
        },
        usePagination
    );
    // End Incoming Table

    // Existing Incoming Table
    const existingIncomingColumn = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'materialId',
            },
            {
                Header: 'Product Name',
                accessor: 'materialName',
            },
            {
                Header: 'Payments',
                Cell: ({ row }) => (
                    <div>
                        <button onClick={() => handleUpdatePaymentStatus(row.original)}>Payment Status</button>
                    </div>
                ),
            },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <div>
                        <button onClick={() => handleEdittt(row.original)}>Edit</button>
                    </div>
                ),
            },
        ],
        []
    );

    const {
        getTableProps: getExistingIncomingTableProps,
        getTableBodyProps: getExistingIncomingTableBodyProps,
        headerGroups: ExistingIncomingHeaderGroups,
        page: ExistingIncomingPage,
        prepareRow: prepareExistingIncomingRow,
        canPreviousPage: canPreviousExistingIncomingPage,
        canNextPage: canNextExistingIncomingPage,
        pageOptions: ExistingIncomingPageOptions,
        pageCount: ExistingIncomingPageCount,
        nextPage: nextExistingIncomingPage,
        previousPage: previousExistingIncomingPage,
        setPageSize: setExistingIncomingPageSize,
        state: { pageIndex: ExistingIncomingPageIndex, pageSize: ExistingIncomingPageSize },
    } = useTable(
        {
            columns: existingIncomingColumn,
            data: incomingExistingStock,
            initialState: { pageIndex: 0 },
        },
        usePagination
    );
    // Existing Incoming End

    const handleEdittt = (rowData) => {
        setEditRowData(rowData);
        setExistingIncomingPopupOpen(true);
        console.log(rowData);
    };

    const handleUpdatePaymentStatus = (rowData) => {
        setSelectedRowData(rowData); 
        setIsPaymentStatusPopupOpen(true);
    };

    // Function to close the popup
    const closePaymentPopup = () => {
        setIsPaymentStatusPopupOpen(false);
        setSelectedRowData(null);
    };

    // Demand Material
    const demandMaterialColumns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'MID',
                accessor: 'selectedMaterialId'
            },
            {
                Header: 'Product Name',
                accessor: 'selectedItem',
            },
            {
                Header: 'Requested Quantity',
                accessor: 'quantityRequested',
            },
            {
                Header: 'Delivery Location',
                accessor: 'deliveryLocation',
            },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <div>
                        <button onClick={() => handleDemandMaterialEdit(row.original)}>Edit</button>
                        <button onClick={() => handleApprove(row.original)}>Approve</button>
                        <button onClick={() => handleReject(row.original)}>Reject</button>
                    </div>
                ),
            },
        ],
        []
    );

    const {
        getTableProps: getDemandTableProps,
        getTableBodyProps: getDemandTableBodyProps,
        headerGroups: demandHeaderGroups,
        page: demandPage,
        prepareRow: prepareDemandRow,
        canPreviousPage: canPreviousDemandPage,
        canNextPage: canNextDemandPage,
        pageOptions: demandPageOptions,
        pageCount: demandPageCount,
        nextPage: nextDemandPage,
        previousPage: previousDemandPage,
        setPageSize: setDemandPageSize,
        state: { pageIndex: demandPageIndex, pageSize: demandPageSize },
    } = useTable(
        {
            columns: demandMaterialColumns,
            data: demandMaterials,
            initialState: { pageIndex: 0 },
        },
        usePagination
    );
    // Demand Material End

    const handleEditt = (rowData) => {
        // Implement the edit functionality
        console.log('Edit row data:', rowData);
    };



    // Warehouse Table
    const warehouseColumns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Product Name',
                accessor: 'materialName',
            },
            {
                Header: 'Product Location',
                accessor: 'rackLocation',
            },
            {
                Header: 'Reorder Level',
                accessor: 'reorderLevel',
            },
            {
                Header: 'Maximum Level',
                accessor: 'maxLevel',
            },
            {
                Header: 'Total Stock',
                accessor: 'quantity',
            },
        ],
        []
    );

    const {
        getTableProps: getWarehouseTableProps,
        getTableBodyProps: getWarehouseTableBodyProps,
        headerGroups: warehouseHeaderGroups,
        page: warehousePage,
        prepareRow: prepareWarehouseRow,
        canPreviousPage: canPreviousWarehousePage,
        canNextPage: canNextWarehousePage,
        pageOptions: warehousePageOptions,
        pageCount: warehousePageCount,
        nextPage: nextWarehousePage,
        previousPage: previousWarehousePage,
        setPageSize: setWarehousePageSize,
        state: { pageIndex: warehousePageIndex, pageSize: warehousePageSize },
    } = useTable(
        {
            columns: warehouseColumns,
            data: warehouseStock,
            initialState: { pageIndex: 0 },
        },
        usePagination
    );
    // End Warehouse Table

    // Production Demand
    const productionDemandMaterialColumns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'productionOrderId',
            },
            {
                Header: 'Machine',
                accessor: 'selectedMachine',
            },
            {
                Header: 'MID',
                accessor: 'requiredMaterials',
                Cell: ({ row }) => {
                    const requiredMaterials = row.original.requiredMaterials || [];
                    return (
                        <div>
                            {requiredMaterials.map((material, index) => (
                                <span key={index}>
                                    {material.id}<br />
                                </span>
                            ))}
                        </div>
                    );
                },
            },
            {
                Header: 'Requested Quantity',
                accessor: 'requiredQuantities',
                Cell: ({ row }) => {
                    const requiredMaterials = row.original.requiredMaterials || [];
                    return (
                        <div>
                            {requiredMaterials.map((material, index) => (
                                <span key={index}>
                                    {material.requiredQuantity}  {material.unit}<br />
                                </span>
                            ))}
                        </div>
                    );
                },
            },
            {
                Header: 'Delivery Location',
                accessor: 'assembelyCell',
            },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <div>
                        <button onClick={() => handleProductionDemandMaterialEdit(row.original)}>Edit</button>
                        <button onClick={() => handleProductionDemandApprove(row.original)}>Approve</button>
                        <button onClick={() => handleReject(row.original)}>Reject</button>
                    </div>
                ),
            },
        ],
        []
    );

    const {
        getTableProps: getProductionDemandTableProps,
        getTableBodyProps: getProductionDemandTableBodyProps,
        headerGroups: productionDemandHeaderGroups,
        page: productionDemandPage,
        prepareRow: prepareProductionDemandRow,
        canPreviousPage: canPreviousProductionDemandPage,
        canNextPage: canNextProductionDemandPage,
        pageOptions: productionDemandPageOptions,
        pageCount: productionDemandPageCount,
        nextPage: nextProductionDemandPage,
        previousPage: previousProductionDemandPage,
        setPageSize: setProductionDemandPageSize,
        state: { pageIndex: productionDemandPageIndex, pageSize: productionDemandPageSize },
    } = useTable(
        {
            columns: productionDemandMaterialColumns,
            data: productionDemandMaterials,
            initialState: { pageIndex: 0 },
        },
        usePagination
    );
    const handleProductionDemandApprove = async (productionOrder) => {
        const { productionOrderId, requiredMaterials } = productionOrder;

        try {
            const storeRacksSnapshot = await getDocs(collection(fireDB, "Store_Racks"));
            const storeRacksDocs = storeRacksSnapshot.docs;

            // Step 1: Check availability of all required materials before proceeding
            let allMaterialsAvailable = true;

            for (const material of requiredMaterials) {
                let productFound = false;

                for (const rackDoc of storeRacksDocs) {
                    const rackData = rackDoc.data();
                    const { products } = rackData;

                    const product = products.find(product => product.id === material.id);

                    if (product) {
                        productFound = true;

                        // Check if the required quantity exceeds the available stock
                        if (material.requiredQuantity > product.quantity) {
                            allMaterialsAvailable = false; // Set this to false if any material has insufficient stock
                            alert(`Insufficient stock for material ID: ${material.id}. Required: ${material.requiredQuantity}, Available: ${product.quantity}`);
                            break; // No need to continue further for this material
                        }
                    }
                }

                if (!productFound) {
                    alert(`Product with ID: ${material.id} not found in Store_Racks`);
                    return; // Stop if any product is not found
                }

                // If at least one material is not available, stop checking further
                if (!allMaterialsAvailable) {
                    return; // Don't proceed with stock update if any material is unavailable
                }
            }

            // Step 2: If all materials are available, proceed to subtract the required quantities
            if (allMaterialsAvailable) {
                for (const material of requiredMaterials) {
                    for (const rackDoc of storeRacksDocs) {
                        const rackData = rackDoc.data();
                        const { products } = rackData;

                        const product = products.find(product => product.id === material.id);

                        if (product) {
                            // Update product quantities
                            const updatedProducts = products.map(p =>
                                p.id === material.id
                                    ? { ...p, quantity: p.quantity - material.requiredQuantity }
                                    : p
                            );

                            // Update Firestore with the new quantities
                            const rackDocRef = doc(fireDB, "Store_Racks", rackDoc.id);
                            await updateDoc(rackDocRef, { products: updatedProducts });
                            alert(`Updated stock for material ID: ${material.id}`);
                        }
                    }
                }

                // Step 3: After stock update, update the production order status
                const productionOrderRef = doc(fireDB, "Production_Orders", productionOrderId);
                await updateDoc(productionOrderRef, { progressStatus: "Material Allocated" });
                console.log(`Production order ID: ${productionOrderId} status updated to Material Allocated`);
            }
        } catch (error) {
            console.error("Error in updating material allocation:", error);
        }
    };
    // Production Demand End

    return (
        <>
            <div className="store-container">
                <div id="main">
                    <div className="store-header">
                        <div>
                            <h3>Store Analysis</h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum voluptates nostrum hic?</p>
                        </div>
                        <div className='uniSearch'>
                            <input type='search' placeholder='Search Demand,Incoming & Warehouse stock' />
                        </div>
                    </div>
                </div>
            </div>
            <div className="total-stock" id="main">
                <div className="total-stock-content">
                    <div className='stock-header'>
                        <h3>Demand Material</h3>
                        <input type="text" placeholder='Search stock' />
                    </div>
                    <div className="stock-list">
                        <table {...getDemandTableProps()}>
                            <thead>
                                {demandHeaderGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getDemandTableBodyProps()}>
                                {demandPage.map(row => {
                                    prepareDemandRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination d-flex">
                        <div className='d-flex'>
                            <button onClick={() => previousIncomingPage()} disabled={!canPreviousDemandPage}>
                                {'<'}
                            </button>
                            <span>
                                {demandPageIndex + 1} of {demandPageOptions.length}
                            </span>
                            <button onClick={() => nextIncomingPage()} disabled={!canNextDemandPage}>
                                {'>'}
                            </button>
                        </div>
                        <div>
                            <select
                                value={demandPageSize}
                                onChange={e => {
                                    setDemandPageSize(Number(e.target.value));
                                }}
                            >
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="total-stock-content">
                    <div className='stock-header'>
                        <h3>Incoming Stock</h3>
                        <input type="text" placeholder='Search stock' />
                    </div>
                    <div className="stock-list">
                        <table {...getIncomingTableProps()}>
                            <thead>
                                {incomingHeaderGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getIncomingTableBodyProps()}>
                                {incomingPage.map(row => {
                                    prepareIncomingRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination d-flex">
                        <div className='d-flex'>
                            <button onClick={() => previousIncomingPage()} disabled={!canPreviousIncomingPage}>
                                {'<'}
                            </button>
                            <span>
                                {incomingPageIndex + 1} of {incomingPageOptions.length}
                            </span>
                            <button onClick={() => nextIncomingPage()} disabled={!canNextIncomingPage}>
                                {'>'}
                            </button>
                        </div>
                        <div>
                            <select
                                value={incomingPageSize}
                                onChange={e => {
                                    setIncomingPageSize(Number(e.target.value));
                                }}
                            >
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="total-stock-content">
                    <div className='stock-header'>
                        <h3>Existing Stock Orders</h3>
                        <input type="text" placeholder='Search stock' />
                    </div>
                    <div className="stock-list">
                        <table {...getExistingIncomingTableProps()}>
                            <thead>
                                {ExistingIncomingHeaderGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getExistingIncomingTableBodyProps()}>
                                {ExistingIncomingPage.map(row => {
                                    prepareExistingIncomingRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination d-flex">
                        <div className='d-flex'>
                            <button onClick={() => previousExistingIncomingPage()} disabled={!canPreviousExistingIncomingPage}>
                                {'<'}
                            </button>
                            <span>
                                {ExistingIncomingPageIndex + 1} of {ExistingIncomingPageOptions.length}
                            </span>
                            <button onClick={() => nextIncomingPage()} disabled={!canNextExistingIncomingPage}>
                                {'>'}
                            </button>
                        </div>
                        <div>
                            <select
                                value={ExistingIncomingPageSize}
                                onChange={e => {
                                    setIncomingPageSize(Number(e.target.value));
                                }}
                            >
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="total-stock-content">
                    <div className='stock-header'>
                        <h3>Warehouse Stock</h3>
                        <input type="text" placeholder='Search stock' />
                    </div>
                    <div className="stock-list">
                        <table {...getWarehouseTableProps()}>
                            <thead>
                                {warehouseHeaderGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getWarehouseTableBodyProps()}>
                                {warehousePage.map(row => {
                                    prepareWarehouseRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination d-flex">
                        <div className='d-flex'>
                            <button onClick={() => previousWarehousePage()} disabled={!canPreviousWarehousePage}>
                                {'<'}
                            </button>
                            <span>
                                {warehousePageIndex + 1} of {warehousePageOptions.length}
                            </span>
                            <button onClick={() => nextWarehousePage()} disabled={!canNextWarehousePage}>
                                {'>'}
                            </button>
                        </div>
                        <div>
                            <select
                                value={warehousePageSize}
                                onChange={e => {
                                    setWarehousePageSize(Number(e.target.value));
                                }}
                            >
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="total-stock-content">
                    <div className='stock-header'>
                        <h3>Production Demand</h3>
                        <input type="text" placeholder='Search stock' />
                    </div>
                    <div className="stock-list">
                        <table {...getProductionDemandTableProps()}>
                            <thead>
                                {productionDemandHeaderGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getProductionDemandTableBodyProps()}>
                                {productionDemandPage.map(row => {
                                    prepareProductionDemandRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination d-flex">
                        <div className='d-flex'>
                            <button onClick={() => previousProductionDemandPage()} disabled={!canPreviousProductionDemandPage}>
                                {'<'}
                            </button>
                            <span>
                                {productionDemandPageIndex + 1} of {productionDemandPageOptions.length}
                            </span>
                            <button onClick={() => nextProductionDemandPage()} disabled={!canNextProductionDemandPage}>
                                {'>'}
                            </button>
                        </div>
                        <div>
                            <select
                                value={productionDemandPageSize}
                                onChange={e => {
                                    setProductionDemandPageSize(Number(e.target.value));
                                }}
                            >
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            {isPopupOpen && selectedItem && (
                <EditStoreProduct
                    item={selectedItem}
                    onClose={closePopup}
                    onSave={(location) => handleSaveLocation(selectedItem, location)}
                />
            )}
            {isDMEditPopup && (
                <DemandMaterialEdit
                    item={DMSelectedItem}
                    onClose={() => seisDMEditPopup(false)}
                />
            )}
            {isProductionDemandEditPopupOpen && (
                <EditDemandMaterialPopup
                    material={selectedMaterial}
                    onClose={() => setProductionDemandEditPopupOpen(false)}
                />
            )}
            {isExistingIncomingPopupOpen && (
                <EditExistingPopup
                    rowData={editRowData}
                    onClose={() => setExistingIncomingPopupOpen(false)}
                />
            )}
            {isPaymentStatusPopupOpen && (
                <UpdateExistingPaymentPopup 
                    rowData={selectedRowData}
                    onClose={closePaymentPopup}
                />
            )}
        </>
    );
};

export default Store;
