import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import './finished.css'

const data = [
    {
        id: 1,
        name: "john",
        Status: "Dispached",


    },
    {
        id: 2,
        name: "john",
        Status: "Dispached",


    },
    {
        id: 3,
        name: "john",
        Status: "Preaparing to Dispache",


    },
    {
        id: 4,
        name: "john",
        Status: "Delevered",


    },
    {
        id: 5,
        name: "john",
        Status: "Dispached",


    },
    {
        id: 6,
        name: "john",
        Status: "Preaparing to Dispache",


    },
    {
        id: 7,
        name: "john",
        Status: "Delevered",


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

function Finished() {
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
                    <h3>Finished Goods</h3>
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

export default Finished;
