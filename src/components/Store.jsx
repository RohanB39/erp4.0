import React, { useMemo, useEffect, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import './Store.css';
import EditStoreProduct from './EditStoreProduct';

const Store = () => {
    const [incomingStock, setIncomingStock] = useState([]);
    const [warehouseStock, setWarehouseStock] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    const fetchData = async () => {
        const db = getFirestore();
        const materialsRef = collection(db, 'Items');
        
        try {
            const incomingQuery = query(
                materialsRef, 
                where('status', '==', 'QC Approved'),
                // where('materialLocation', '==', null)
            );
            const incomingSnapshot = await getDocs(incomingQuery);
            const incomingMaterials = incomingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setIncomingStock(incomingMaterials);
    
            const warehouseQuery = query(
                materialsRef, 
                // where('status', '==', 'QC Approved'),
                where('materialLocation', '!=', null) 
            );
            const warehouseSnapshot = await getDocs(warehouseQuery);
            const warehouseMaterials = warehouseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWarehouseStock(warehouseMaterials);
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

    const handleSaveLocation = async (item, location) => {
        const db = getFirestore();
        const itemRef = doc(db, 'Items', item.id);

        try {
            // Update the item's location
            await updateDoc(itemRef, { materialLocation: location });
            // Move item from incomingStock to warehouseStock
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
                accessor: 'materialLocation', // Adjusted to 'materialLocation'
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
                accessor: 'quantityReceived', // Adjusted to show total quantity
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
                        <div className='store-tabs'>
                            <h2>Re-Order Level <span>20</span></h2>
                            <h2>Maximum Level <span>100</span></h2>
                            <h2>Total Stock <span className='active'>250</span></h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="total-stock" id="main">
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
        </>
    );
};

export default Store;
