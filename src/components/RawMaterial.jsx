import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";

import './customerlist.css'

const data = [
    {
        id: 1,
        name: "lorem lorem lorem",
        Quantity: 12345,
        Status: "In Stock",

    },
    {
        id: 2,
        name: "lorem lorem lorem",
        Quantity: 12345,
        Status: "In Stock",

    },
    {
        id: 3,
        name: "lorem lorem lorem",
        Quantity: 12345,
        Status: "In Stock",

    },
    {
        id: 4,
        name: "lorem lorem lorem",
        Quantity: 12345,
        Status: "In Stock",

    },
    {
        id: 5,
        name: "lorem lorem lorem",
        Quantity: 12345,
        Status: "In Stock",

    },
    {
        id: 6,
        name: "lorem lorem lorem",
        Quantity: 12345,
        Status: "Out Of Stock",

    },
    {
        id: 7,
        name: "lorem lorem lorem",
        Quantity: 12345,
        Status: "In Stock",

    },
    {
        id: 8,
        name: "lorem lorem lorem",
        Quantity: 12345,
        Status: "Out Of Stock",

    },













];

const columns = [
    {
        Header: "ID",
        accessor: "id",
    },
    {
        Header: "Name",
        accessor: "name",
    },
    {
        Header: "Quantity",
        accessor: "Quantity",
    },
    {
        Header: "Status",
        accessor: "Status",
    },




    {
        Header: "Actions",
        Cell: ({ row }) => (
            <button className="delete-btn">Delete</button>
        ),
    },
];

function RawMaterial() {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        nextPage,
        previousPage,
        state: { pageIndex = 0, pageSize = 4 },
        pageCount
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 4 },
        },
        useSortBy,
        usePagination
    );

    const handleDelete = (id) => {
        // Write your delete logic here
        console.log("Deleting row with ID:", id);
    };

    return (
        <div className="main customerList" id="main">
            <div className="table-container">
                <div className="table-title">
                    <h3>Raw Materials </h3>
                    {/* <button className="table-btn">Add More</button> */}
                </div>

                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr key={row.id} {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td key={cell.id} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={previousPage}>Prev</button>
                    <div>
                        <span>{pageIndex + 1} of {pageCount}</span>
                    </div>
                    <button onClick={nextPage}>Next</button>
                </div>
            </div>
        </div>
    );
}

export default RawMaterial;
