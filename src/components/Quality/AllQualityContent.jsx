import React, { useMemo, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import './quality.css'

function AllQualityContent() {
    const [data, setData] = useState([
        { srNo: 1, itemName: 'Item 1', status: 'Approved' },
        { srNo: 2, itemName: 'Item 2', status: 'Hold' },
        { srNo: 3, itemName: 'Item 3', status: 'Rejected' },
    
    ]);

    const columns = useMemo(
        () => [
            { Header: 'Sr No', accessor: 'srNo' },
            { Header: 'Item Name', accessor: 'itemName' },
            { Header: 'Status', accessor: 'status' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <div>
                        <button onClick={() => handleEdit(row.index)}>Edit</button>
                        <button onClick={() => handleDelete(row.index)}>Delete</button>
                    </div>
                ),
            },
        ],
        []
    );

    const handleEdit = (index) => {
        const newItemName = prompt('Enter new item name:', data[index].itemName);
        if (newItemName) {
            const updatedData = data.map((item, i) =>
                i === index ? { ...item, itemName: newItemName } : item
            );
            setData(updatedData);
        }
    };

    const handleDelete = (index) => {
        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 5 }, 
        },
        usePagination
    );

    return (
        <div className='qualityTable'>
            {/* <table {...getTableProps()}>
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
            </table> */}
            <div>

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
    );
}

export default AllQualityContent;
