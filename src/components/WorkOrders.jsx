import React, { useMemo } from 'react';
import { useTable, usePagination } from 'react-table';

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
        <div className="allproduction">
            <div className="info">
                <h3>Production</h3>
                <p>Work Orders</p>
            </div>
            <div className="allproduction-table">
                <div className="allproduction-table-header">
                    <div className='productionsearch'>
                        <input type="text" placeholder='Search' />
                    </div>
                </div>
                <div className="production-item-list">
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row);
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
                <div className="pagination">

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
