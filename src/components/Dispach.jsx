import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTable, usePagination } from 'react-table';

import './dispach.css';

function Dispach() {


    const data = useMemo(
        () => [
            {
                date: '2024-07-26',
                time: '09:00 AM',
                vehicle: 'Auto 1',
                invoiceNo: 'INV125',
                receiptNo: 'REC458'
            },
            {
                date: '2024-07-26',
                time: '10:30 AM',
                vehicle: 'Bike 3',
                invoiceNo: 'INV126',
                receiptNo: 'REC459'
            },
            {
                date: '2024-07-26',
                time: '12:00 PM',
                vehicle: 'Truck 2',
                invoiceNo: 'INV127',
                receiptNo: 'REC460'
            },
            {
                date: '2024-07-26',
                time: '01:00 PM',
                vehicle: 'Van 1',
                invoiceNo: 'INV128',
                receiptNo: 'REC461'
            },
            {
                date: '2024-07-26',
                time: '02:00 PM',
                vehicle: 'Car 4',
                invoiceNo: 'INV129',
                receiptNo: 'REC462'
            },
            {
                date: '2024-07-26',
                time: '03:30 PM',
                vehicle: 'Scooter 5',
                invoiceNo: 'INV130',
                receiptNo: 'REC463'
            },
            {
                date: '2024-07-26',
                time: '04:00 PM',
                vehicle: 'Auto 2',
                invoiceNo: 'INV131',
                receiptNo: 'REC464'
            },
            {
                date: '2024-07-26',
                time: '05:00 PM',
                vehicle: 'Bike 6',
                invoiceNo: 'INV132',
                receiptNo: 'REC465'
            },
            {
                date: '2024-07-26',
                time: '06:00 PM',
                vehicle: 'Truck 3',
                invoiceNo: 'INV133',
                receiptNo: 'REC466'
            },
            {
                date: '2024-07-26',
                time: '07:30 PM',
                vehicle: 'Van 3',
                invoiceNo: 'INV134',
                receiptNo: 'REC467'
            },
            {
                date: '2024-07-26',
                time: '08:00 PM',
                vehicle: 'Car 7',
                invoiceNo: 'INV135',
                receiptNo: 'REC468'
            },
            {
                date: '2024-07-26',
                time: '09:00 PM',
                vehicle: 'Scooter 8',
                invoiceNo: 'INV136',
                receiptNo: 'REC469'
            }
        ],
        []
    );


    const columns = useMemo(
        () => [
            {
                Header: 'Sr No.',
                accessor: (row, index) => index + 1
            },
            {
                Header: 'Date of Dispatch',
                accessor: 'date' // accessor is the "key" in the data
            },
            {
                Header: 'Time of Dispatch',
                accessor: 'time'
            },
            {
                Header: 'Dispatch Vehicle',
                accessor: 'vehicle'
            },
            {
                Header: 'Invoice No.',
                accessor: 'invoiceNo'
            },
            {
                Header: 'Receipt No.',
                accessor: 'receiptNo'
            }
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page, // Instead of rows, we use page
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state: { pageIndex },
        prepareRow
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 } // Display 10 rows per page
        },
        usePagination
    );


    return (
        <>
            <div className="dispach-container">
                <div id='main'>
                    <div className="dispach-title">
                        <div>
                            <h3>Overview of Dispatch Items</h3>
                            <p>See the updated items for dispatch work here.</p>
                        </div>
                        <div>
                          <Link to={'/DispachInvoice'}> <button >Create Invoice</button></Link> 
                        </div>
                    </div>
                </div>
            </div>
            <div className="dispach-table-container" id='main'>
                <div>
                    <h4>Dispatch Details</h4>
                </div>
                <div className='dispach-table'>
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

        </>
    );
}

export default Dispach;
