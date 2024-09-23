import React, { useMemo, useEffect, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import './Store.css';
import EditStoreProduct from './editStoreProduct/EditStoreProduct';
import DemandMaterialEdit from '../production/demandMaterial/DemandMaterialEdit';

const Store = () => {
    const [incomingStock, setIncomingStock] = useState([]);
    const [demandMaterials, setdemandMaterials] = useState([]);
    const [warehouseStock, setWarehouseStock] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDMEditPopup, seisDMEditPopup] = useState(false);
    const [DMSelectedItem, setDMSelectedItem] = useState(null);

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

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsPopupOpen(true);
    };

    const handleDemandMaterialEdit = (item) => {
        setDMSelectedItem(item);
        seisDMEditPopup(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
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
                        <button onClick={() => handleEdit(row.original)}>Edit</button>
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
        </>
    );
};

export default Store;
