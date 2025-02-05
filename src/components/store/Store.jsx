import React, { useMemo, useEffect, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import style from './Store.module.css'
import EditStoreProduct from './editStoreProduct/EditStoreProduct';
import DemandMaterialEdit from '../production/demandMaterial/DemandMaterialEdit';
import EditDemandMaterialPopup from '../store/editDemandMaterialPopup/EditDemandMaterialPopup';
import { fireDB } from '../firebase/FirebaseConfig';
import { IoIosSearch } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { VscClose } from "react-icons/vsc";
import { BsCheck2Square } from "react-icons/bs";


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
                        <span onClick={() => handleEdit(row.original)}><CiEdit className={style.editBtn} /></span>
                    </div>
                ),
            },
        ],
        []
    );

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
                        <span onClick={() => handleDemandMaterialEdit(row.original)}><CiEdit className={style.editBtn} /></span>
                        <span onClick={() => handleApprove(row.original)}><BsCheck2Square className={style.approveBtn} /></span>
                        <span onClick={() => handleReject(row.original)}><VscClose className={style.rejectBtn} /></span>
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

    const handleEditt = (rowData) => {
        // Implement the edit functionality
        console.log('Edit row data:', rowData);
    };


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
                        <span onClick={() => handleProductionDemandMaterialEdit(row.original)}><CiEdit className={style.editBtn} /></span>
                        <span onClick={() => handleProductionDemandApprove(row.original)}><BsCheck2Square className={style.approveBtn} /></span>
                        <span onClick={() => handleReject(row.original)}><VscClose className={style.rejectBtn} /></span>
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

    return (
        <>
            <div className={style.storeContainer}>
                <div>
                    <div className={style.storeHeader}>
                        <div>
                            <i className="bi bi-graph-up"></i>
                            <h3>Store Analysis</h3>
                        </div>
                        <p>Analyze store performance with detailed insights on inventory levels, sales trends, and product demand. This data helps optimize stock management and improve overall store efficiency.</p>



                    </div>
                </div>
                <hr />
            </div>
            <div className={style.totalStock} >
                <div className={style.totalStockContent}>
                    <div className={style.stockHeader}>
                        <div>
                            <div className={style.stockTitle}>
                                <i className="bi bi-box-seam"></i>
                                <h3>Demand Material</h3>
                            </div>
                            <p>Track and manage material demand based on current production needs, stock availability, and future forecasts. </p>
                        </div>
                        <div className={style.searchinputWrapper}>

                            <input type="text" placeholder='Search stock' />
                            <IoIosSearch className={style.searchIcon} />
                        </div>

                    </div>
                    <div className={style.stockList}>
                        <table className={style.stockTable} {...getDemandTableProps()} >
                            <thead className={style.stockTableHeader}>
                                {demandHeaderGroups.map(headerGroup => {
                                    const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                                    return (
                                        <tr key={headerGroupKey} {...headerGroupProps}>
                                            {headerGroup.headers.map(column => {
                                                const { key: columnKey, ...columnProps } = column.getHeaderProps();
                                                return (
                                                    <th key={columnKey} {...columnProps}>
                                                        {column.render('Header')}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </thead>
                            <tbody {...getDemandTableBodyProps()}>
                                {demandPage.map(row => {
                                    prepareDemandRow(row);
                                    const { key: rowKey, ...rowProps } = row.getRowProps();
                                    return (
                                        <tr key={rowKey} {...rowProps}>
                                            {row.cells.map(cell => {
                                                const { key: cellKey, ...cellProps } = cell.getCellProps();
                                                return (
                                                    <td key={cellKey} {...cellProps}>
                                                        {cell.render('Cell')}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    </div>
                    <div className={style.pagination}>
                        <div className={style.paginationCount}>
                            <span onClick={() => previousIncomingPage()} disabled={!canPreviousDemandPage}>
                                {'<'}
                            </span>
                            <span>
                                {demandPageIndex + 1} of {demandPageOptions.length}
                            </span>
                            <span onClick={() => nextIncomingPage()} disabled={!canNextDemandPage}>
                                {'>'}
                            </span>
                        </div>
                        <div className={style.select}>
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
                <hr className='hr' />

                <div className={style.totalStockContent}>
                    <div className={style.stockHeader}>
                        <div>
                            <div className={style.stockTitle}>
                                <i className="bi bi-arrow-down-circle"></i>
                                <h3>Incoming Material</h3>
                            </div>
                            <p>Monitor and manage the receipt of materials to ensure timely deliveries and maintain optimal inventory levels.</p>

                        </div>
                        <div className={style.searchinputWrapper}>

                            <input type="text" placeholder='Search stock' />
                            <IoIosSearch className={style.searchIcon} />
                        </div>
                    </div>
                    <div className={style.stockList}>
                        <table {...getIncomingTableProps()} className={style.stockTable}>
                            <thead className={style.stockTableHeader}>
                                {incomingHeaderGroups.map(headerGroup => {
                                    const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps(); // Extract key
                                    return (
                                        <tr key={headerGroupKey} {...headerGroupProps}>
                                            {headerGroup.headers.map(column => {
                                                const { key: columnKey, ...columnProps } = column.getHeaderProps(); // Extract key
                                                return (
                                                    <th key={columnKey} {...columnProps}>
                                                        {column.render('Header')}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </thead>
                            <tbody {...getIncomingTableBodyProps()}>
                                {incomingPage.map(row => {
                                    prepareIncomingRow(row);
                                    const { key: rowKey, ...rowProps } = row.getRowProps(); // Extract key
                                    return (
                                        <tr key={rowKey} {...rowProps}>
                                            {row.cells.map(cell => {
                                                const { key: cellKey, ...cellProps } = cell.getCellProps(); // Extract key
                                                return (
                                                    <td key={cellKey} {...cellProps}>
                                                        {cell.render('Cell')}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    </div>
                    <div className={style.pagination}>
                        <div className={style.paginationCount}>
                            <span onClick={() => previousIncomingPage()} disabled={!canPreviousIncomingPage}>
                                {'<'}
                            </span>
                            <span>
                                {incomingPageIndex + 1} of {incomingPageOptions.length}
                            </span>
                            <span onClick={() => nextIncomingPage()} disabled={!canNextIncomingPage}>
                                {'>'}
                            </span>
                        </div>
                        <div className={style.select}>
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
                <hr className='hr' />

                <div className={style.totalStockContent}>
                    <div className={style.stockHeader}>
                        <div>
                            <div className={style.stockTitle}>
                                <i className="bi bi-box-seam"></i>
                                <h3>Warehouse</h3>
                            </div>
                            <p>Efficiently manage inventory, storage, and material flow to support smooth operations and timely dispatches.</p>

                        </div>
                        <div className={style.searchinputWrapper}>

                            <input type="text" placeholder='Search stock' />
                            <IoIosSearch className={style.searchIcon} />
                        </div>
                    </div>
                    <div className={style.stockList}>
                        <table {...getWarehouseTableProps()} className={style.stockTable}>
                            <thead className={style.stockTableHeader}>
                                {warehouseHeaderGroups.map(headerGroup => {
                                    const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps(); // Extract key
                                    return (
                                        <tr key={headerGroupKey} {...headerGroupProps}>
                                            {headerGroup.headers.map(column => {
                                                const { key: columnKey, ...columnProps } = column.getHeaderProps(); // Extract key
                                                return (
                                                    <th key={columnKey} {...columnProps}>
                                                        {column.render('Header')}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </thead>
                            <tbody {...getWarehouseTableBodyProps()}>
                                {warehousePage.map(row => {
                                    prepareWarehouseRow(row);
                                    const { key: rowKey, ...rowProps } = row.getRowProps(); // Extract key
                                    return (
                                        <tr key={rowKey} {...rowProps}>
                                            {row.cells.map(cell => {
                                                const { key: cellKey, ...cellProps } = cell.getCellProps(); // Extract key
                                                return (
                                                    <td key={cellKey} {...cellProps}>
                                                        {cell.render('Cell')}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    </div>
                    <div className={style.pagination}>
                        <div className={style.paginationCount}>
                            <span onClick={() => previousWarehousePage()} disabled={!canPreviousWarehousePage}>
                                {'<'}
                            </span>
                            <span>
                                {warehousePageIndex + 1} of {warehousePageOptions.length}
                            </span>
                            <span onClick={() => nextWarehousePage()} disabled={!canNextWarehousePage}>
                                {'>'}
                            </span>
                        </div>
                        <div className={style.select}>
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
                <hr className='hr' />

                <div className="total-stock-content">
                    <div className={style.stockHeader}>
                        <div>
                            <div className={style.stockTitle}>
                                <i className="bi bi-gear"></i>
                                <h3>Production Demand</h3>
                            </div>
                            <p>Monitor and manage the production demand to align with manufacturing schedules, resource availability, and market requirements.</p>

                        </div>
                        <div className={style.searchinputWrapper}>

                            <input type="text" placeholder='Search stock' />
                            <IoIosSearch className={style.searchIcon} />
                        </div>
                    </div>
                    <div className={style.stockList}>
                        <table {...getProductionDemandTableProps()} className={style.stockTable}>
                            <thead className={style.stockTableHeader}>
                                {productionDemandHeaderGroups.map(headerGroup => {
                                    const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps(); // Extract key
                                    return (
                                        <tr key={headerGroupKey} {...headerGroupProps}>
                                            {headerGroup.headers.map(column => {
                                                const { key: columnKey, ...columnProps } = column.getHeaderProps(); // Extract key
                                                return (
                                                    <th key={columnKey} {...columnProps}>
                                                        {column.render('Header')}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </thead>
                            <tbody {...getProductionDemandTableBodyProps()}>
                                {productionDemandPage.map(row => {
                                    prepareProductionDemandRow(row);
                                    const { key: rowKey, ...rowProps } = row.getRowProps(); // Extract key
                                    return (
                                        <tr key={rowKey} {...rowProps}>
                                            {row.cells.map(cell => {
                                                const { key: cellKey, ...cellProps } = cell.getCellProps(); // Extract key
                                                return (
                                                    <td key={cellKey} {...cellProps}>
                                                        {cell.render('Cell')}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    </div>
                    <div className={style.pagination}>
                        <div className={style.paginationCount}>
                            <span onClick={() => previousProductionDemandPage()} disabled={!canPreviousProductionDemandPage}>
                                {'<'}
                            </span>
                            <span>
                                {productionDemandPageIndex + 1} of {productionDemandPageOptions.length}
                            </span>
                            <span onClick={() => nextProductionDemandPage()} disabled={!canNextProductionDemandPage}>
                                {'>'}
                            </span>
                        </div>
                        <div className={style.select}>
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
        </>
    );
};

export default Store;
