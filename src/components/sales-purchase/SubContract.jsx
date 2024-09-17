import React, { useMemo, useState } from 'react';
import { useTable, usePagination } from 'react-table';

function SubContract() {
    const data = useMemo(() => [
        // Sample data
        {
            processNumber: 1,
            jobWorkNumber: 'JW001',
            stage: 'Initial',
            status: 'Active',
            fgItemId: 'FG001',
            fgName: 'Item A',
            fgUom: 'pcs',
            targetQuantity: 100,
            completedQuantity: 50,
            creationDate: '2023-01-01',
            createdBy: 'User1'
        },
        {
            processNumber: 2,
            jobWorkNumber: 'JW002',
            stage: 'Middle',
            status: 'Inactive',
            fgItemId: 'FG002',
            fgName: 'Item B',
            fgUom: 'pcs',
            targetQuantity: 200,
            completedQuantity: 150,
            creationDate: '2023-01-02',
            createdBy: 'User2'
        },
        // Add more data as needed
    ], []);

    const columns = useMemo(() => [
        {
            Header: 'Process No.',
            accessor: 'processNumber',
        },
        {
            Header: 'Job Work No.',
            accessor: 'jobWorkNumber',
        },
        {
            Header: 'Stage',
            accessor: 'stage',
        },
        {
            Header: 'Status',
            accessor: 'status',
        },
        {
            Header: 'FG Item ID',
            accessor: 'fgItemId',
        },
        {
            Header: 'FG Name',
            accessor: 'fgName',
        },
        {
            Header: 'FG UOM',
            accessor: 'fgUom',
        },
        {
            Header: 'Target Qty.',
            accessor: 'targetQuantity',
        },
        {
            Header: 'Completed Qty.',
            accessor: 'completedQuantity',
        },
        {
            Header: 'Creation Date',
            accessor: 'creationDate',
        },
        {
            Header: 'Created By',
            accessor: 'createdBy',
        },
    ], []);

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
            initialState: { pageIndex: 0, pageSize: 2 },
        },
        usePagination
    );

    return (
        <div className="allproduction">
            <div className="info">
                <h3>Production</h3>
                <p>Sub Contract</p>
            </div>
            <div className="allproduction-table">
                <div className="allproduction-table-header">
                    <div className='productionsearch'>
                        <input type="text" placeholder='Search' />
                    </div>
                </div>
                <div className="production-item-list">
                    <table {...getTableProps()} className="table">
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

export default SubContract;
