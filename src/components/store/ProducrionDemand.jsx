import React, { useMemo, useEffect, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import style from './Store.module.css'

const ProducrionDemand = () => {
    const [productionDemandMaterials, setProductionDemandMaterials] = useState([]);
    const fetchData = async () => {
        const db = getFirestore();
        const productionDemandRef = collection(db, 'Production_Orders');

        try {
            //fetching production demand
            const productionDemandQuery = query(
                productionDemandRef,
                where('progressStatus', '==', 'Completed Product Order'),
            );
            const productionDemandSnapshot = await getDocs(productionDemandQuery);
            const productionDemandMaterial = productionDemandSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProductionDemandMaterials(productionDemandMaterial);
        } catch (error) {
            console.error("Error fetching materials: ", error);
        }
    };

    const productionDemandMaterialColumns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'productionOrderId',
            },
            {
                Header: 'MID',  // For displaying Material IDs
                accessor: 'requiredMaterials',  // Access the requiredMaterials array
                Cell: ({ row }) => {
                    const requiredMaterials = row.original.requiredMaterials || [];
                    return (
                        <div>
                            {requiredMaterials.map((material, index) => (
                                <span key={index}>
                                    {material.id}
                                    {index < requiredMaterials.length - 1 && ', '}
                                </span>
                            ))}
                        </div>
                    );
                },
            },
            {
                Header: 'Product Id',
                accessor: 'selectedProductId',
            },
            {
                Header: 'Requested Quantity',
                accessor: 'requestedQuantity',
                Cell: ({ row }) => {
                    const requestedQuantity = row.original.requestedQuantity || [];
                    return (
                        <div>
                            {requestedQuantity.map((material, index) => (
                                <span key={index}>
                                    {material.requiredQuantity}
                                    {index < requiredMaterials.length - 1 && ', '}
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
        getTableProps: getProductionDemandTableProps,
        getTableBodyProps: getProductionDemandTableBodyProps,
        headerGroups: ProductiondemandHeaderGroups,
        page: ProductiondemandPage,
        prepareRow: prepareProductionDemandRow,
        canPreviousPage: canPreviousProductionDemandPage,
        canNextPage: canNextProductionDemandPage,
        pageOptions: ProductiondemandPageOptions,
        pageCount: ProductiondemandPageCount,
        nextPage: nextProductionDemandPage,
        previousPage: previousProductionDemandPage,
        setPageSize: setProductionDemandPageSize,
        state: { pageIndex: ProductiondemandPageIndex, pageSize: ProductiondemandPageSize },
    } = useTable(
        {
            columns: productionDemandMaterialColumns,
            data: demandMaterials,
            initialState: { pageIndex: 0 },
        },
        usePagination
    );
    return (
        <>
            <div className={style.storeContainer}>
                <div className={style.stockHeader}>
                    <h3>Production Demand</h3>
                    <input type="text" placeholder='Search stock' />
                </div>
                <div className={style.stockList}>
                    <table {...getProductionDemandTableProps()} className={style.stockTable}>
                        <thead className={style.stockTableHeader}>
                            {ProductiondemandHeaderGroups.map(headerGroup => {
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
                            {ProductiondemandPage.map(row => {
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
                    <div className='d-flex'>
                        <button onClick={() => previousProductionDemandPage()} disabled={!canPreviousProductionDemandPage}>
                            {'<'}
                        </button>
                        <span>
                            {ProductiondemandPageIndex + 1} of {ProductiondemandPageOptions.length}
                        </span>
                        <button onClick={() => nextProductionDemandPage()} disabled={!canNextProductionDemandPage}>
                            {'>'}
                        </button>
                    </div>
                    <div>
                        <select
                            value={ProductiondemandPageSize}
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
        </>
    )
}

export default ProducrionDemand