import React, { useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import style from './workOrder.module.css'

function WorkOrders() {
    const data = useMemo(
        () => [
            { id: 1, itemName: 'Item A', uom: 'pcs', quantity: 100, buyer: 'Buyer 1', documentNumber: 'DOC123', orderType: 'Type A', processNumber: 'PROC123', processStage: 'Stage 1', documentDate: '2023-01-01', deliveryDate: '2023-01-15', createdBy: 'User A' },
            { id: 2, itemName: 'Item B', uom: 'pcs', quantity: 200, buyer: 'Buyer 2', documentNumber: 'DOC124', orderType: 'Type B', processNumber: 'PROC124', processStage: 'Stage 2', documentDate: '2023-02-01', deliveryDate: '2023-02-15', createdBy: 'User B' },
            // Add more work orders as needed
            { id: 3, itemName: 'Item C', uom: 'pcs', quantity: 150, buyer: 'Buyer 3', documentNumber: 'DOC125', orderType: 'Type C', processNumber: 'PROC125', processStage: 'Stage 3', documentDate: '2023-03-01', deliveryDate: '2023-03-15', createdBy: 'User C' },
            { id: 4, itemName: 'Item D', uom: 'pcs', quantity: 250, buyer: 'Buyer 4', documentNumber: 'DOC126', orderType: 'Type D', processNumber: 'PROC126', processStage: 'Stage 4', documentDate: '2023-04-01', deliveryDate: '2023-04-15', createdBy: 'User D' },
            { id: 5, itemName: 'Item E', uom: 'pcs', quantity: 300, buyer: 'Buyer 5', documentNumber: 'DOC127', orderType: 'Type E', processNumber: 'PROC127', processStage: 'Stage 5', documentDate: '2023-05-01', deliveryDate: '2023-05-15', createdBy: 'User E' }
        ],
        []
    );

    const columns = useMemo(
        () => [
            { Header: 'Item ID', accessor: 'id' },
            { Header: 'Item Name', accessor: 'itemName' },
            { Header: 'UOM', accessor: 'uom' },
            { Header: 'Quantity', accessor: 'quantity' },
            { Header: 'Buyer', accessor: 'buyer' },
            { Header: 'Document Number', accessor: 'documentNumber' },
            { Header: 'Order Type', accessor: 'orderType' },
            { Header: 'Process Number', accessor: 'processNumber' },
            { Header: 'Process Stage', accessor: 'processStage' },
            { Header: 'Document Date', accessor: 'documentDate' },
            { Header: 'Delivery Date', accessor: 'deliveryDate' },
            { Header: 'Created By', accessor: 'createdBy' }
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        usePagination
    );

    return (
        <div className={style.allproduction}>
            <div className={style.info}>
                <h3>Production</h3> <span>/</span>
                <p>Work Orders</p>
            </div>
            <div className={style.allproductionTable}>
                <div className={style.allproductionTableHeader}>
                    <div className={style.productionsearch}>
                        <input type="text" placeholder='Search' />
                    </div>
                </div>

                <div className={style.productionItemList}>
                    <table {...getTableProps()} className={style.productionItemTable}>
                        <thead className={style.productionItemTableHeader}>
                            {headerGroups.map((headerGroup, headerGroupIndex) => (
                                <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${headerGroupIndex}`}>
                                    {headerGroup.headers.map((column, columnIndex) => (
                                        <th {...column.getHeaderProps()} key={`column-${columnIndex}`}>
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()} className={style.productionItemTableBody}>
                            {page.map((row, rowIndex) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} key={`row-${rowIndex}`}>
                                        {row.cells.map((cell, cellIndex) => (
                                            <td {...cell.getCellProps()} key={`cell-${rowIndex}-${cellIndex}`}>
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>


                </div>
                <div className={style.pagination}>

                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </button>
                    <span>


                        {pageIndex + 1} of {pageOptions.length}

                    </span>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </button>



                </div>
            </div>
        </div>
    );
}

export default WorkOrders;
