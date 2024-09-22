import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";

import './itemsList.css'

const data = [
    {
        id: 1,
        name: "john",
        Details: "lorem lorem lorem lorem lor ",
        Price: 30000,
        Category: "Steel",
        Type: "Metalic",
    },
    {
        id: 2,
        name: "john",
        Details: "lorem lorem lorem lorem lor ",
        Price: 40000,
        Category: "Steel",
        Type: "Metalic",
    },
    {
        id: 3,
        name: "john",
        Details: "lorem lorem lorem lorem lor ",
        Price: 30000,
        Category: "Steel",
        Type: "Metalic",
    },
    {
        id: 4,
        name: "john",
        Details: "lorem lorem lorem lorem lor ",
        Price: 50000,
        Category: "Steel",
        Type: "Metalic",
    },
    {
        id: 5,
        name: "john",
        Details: "lorem lorem lorem lorem lor ",
        Price: 6000,
        Category: "Steel",
        Type: "Metalic",
    },
    {
        id: 6,
        name: "john",
        Details: "lorem lorem lorem lorem lor ",
        Price: 30000,
        Category: "Steel",
        Type: "Metalic",
    },
    {
        id: 7,
        name: "john",
        Details: "lorem lorem lorem lorem lor ",
        Price: 30000,
        Category: "Steel",
        Type: "Metalic",
    },
    {
        id: 8,
        name: "john",
        Details: "lorem lorem lorem lorem lor ",
        Price: 30000,
        Category: "Steel",
        Type: "Metalic",
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
        Header: "Details",
        accessor: "Details",
    },

    {
        Header: "Price",
        accessor: "Price",
    },
    {
        Header: "Category",
        accessor: "Category",
    },
    {
        Header: "Type",
        accessor: "Type",
    },
    {
        Header: "Actions",
        Cell: ({ row }) => (
            <button className="delete-btn">Delete</button>
        ),
    },
];

function ItemList() {
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
                    <h3>Item Lists</h3>
                    <button className="table-btn">    <i class="bi bi-plus-lg px-2"></i>Add Item</button>
                </div>
                <div className="filter">
                    <div>

                        <select name="Category" id="">

                            <option value="Category1">Category1</option>
                            <option value="Category2">Category2</option>
                            <option value="Category3">Category3</option>
                        </select>
                    </div>
                    <div>
                        <select name="Type" id="">

                            <option value="Type 1">Type 1</option>
                            <option value="Type 2">Type 2</option>
                            <option value="Type 3">Type 3</option>
                        </select>
                    </div>
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
                <div className="btn">
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

export default ItemList;
