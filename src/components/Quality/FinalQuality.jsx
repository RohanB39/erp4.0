import React, { useMemo, useState } from 'react';
import { useTable } from 'react-table';
import './quality.css'

function FinalQuality() {
    const [data, setData] = useState([
        { itemName: 'Item 1', status: 'approved' },
        { itemName: 'Item 2', status: 'hold' },
        { itemName: 'Item 3', status: 'pass' },
    ]);

    const columns = useMemo(() => [
        { Header: 'Item Name', accessor: 'itemName' },
        { Header: 'Approved', accessor: 'approved' },
        { Header: 'Hold', accessor: 'hold' },
        { Header: 'Pass', accessor: 'pass' },
        {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => {
                const handleActionClick = () => {
                    const newData = data.map((item, index) => {
                        if (index === row.index) {
                            if (item.status === 'approved') item.status = 'hold';
                            else if (item.status === 'hold') item.status = 'pass';
                            else if (item.status === 'pass') item.status = 'approved';
                        }
                        return item;
                    });
                    setData(newData);
                };

                const getButtonLabel = (status) => {
                    if (status === 'approved') return 'Send to Hold';
                    if (status === 'hold') return 'Send to Pass';
                    if (status === 'pass') return ' Approved';
                    return '';
                };

                return (
                    <button onClick={handleActionClick}>
                        {getButtonLabel(row.original.status)}
                    </button>
                );
            }
        }
    ], [data]);

    const modifiedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            approved: item.status === 'approved' ? 'Yes' : 'No',
            hold: item.status === 'hold' ? 'Yes' : 'No',
            pass: item.status === 'pass' ? 'Yes' : 'No',
        }));
    }, [data]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: modifiedData });

    return (
        <div className='qualityTable'>
            <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th
                                    {...column.getHeaderProps()}
                                  
                                >
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td
                                        {...cell.getCellProps()}
                                      
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default FinalQuality;
