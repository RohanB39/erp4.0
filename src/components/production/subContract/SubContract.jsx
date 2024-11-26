import React, { useMemo, useState } from 'react';
import { useTable, usePagination } from 'react-table';


import style from './subContract.module.css'

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
        <div className={style.subContractWrapper}>
            <div className={style.info}>
                <h3>Production</h3> <span>/</span>
                <p>Sub Contract</p>
            </div>
            <hr className='hr' />
            <div className={style.contactTable}>

                <div className={style.contractSearch}>
                    <input type="text" placeholder='Search' />
                </div>

                <div className={style.contactItemList}>
                    <table {...getTableProps()} className={style.contractTable}>
                        <thead className={style.contractTableHeader}>
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
                        <tbody {...getTableBodyProps()} className={style.contractTableBody}>
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

export default SubContract;
