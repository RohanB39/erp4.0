import React, { useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import VendorPopup from "./vendorPopup/VendorPopup";
import './vendorList.css';


const data = [
    {
        id: 1,
        name: "John",
        ShippingAddress: "fsasacf cbkshslkvcb cgg",
        BillingNumber: 123456734,
        phone: 91232323,

    },
    {
        id: 2,
        name: "John",
        ShippingAddress: "fsasacf cbkshslkvcb cgg",
        BillingNumber: 123456734,
        phone: 91232323,

    }, {
        id: 3,
        name: "John",
        ShippingAddress: "fsasacf cbkshslkvcb cgg",
        BillingNumber: 123456734,
        phone: 91232323,

    },
    {
        id: 4,
        name: "John",
        ShippingAddress: "fsasacf cbkshslkvcb cgg",
        BillingNumber: 123456734,
        phone: 91232323,

    },
    {
        id: 5,
        name: "John",
        ShippingAddress: "fsasacf cbkshslkvcb cgg",
        BillingNumber: 123456734,
        phone: 91232323,

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
        Header: "Shipping Address",
        accessor: "ShippingAddress",
    },
    {
        Header: "Billing Number",
        accessor: "BillingNumber",
    },
    {
        Header: "Phone Number",
        accessor: "phone",
    },


    {
        Header: "Actions",
        Cell: ({ row }) => (
            <button className="delete-btn">Delete</button>
        ),
    },
];

function VendorList() {
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

        console.log("Deleting row with ID:", id);
    };


    const [showPopup, setShowPopup] = useState(false);

    const handleCreateCustomer = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };


    return (
        <div className="main customerList" id="main">
            <div className="table-container">
                <div className="table-title">
                    <h3>Vendor Lists</h3>
                    <button className="table-btn" onClick={handleCreateCustomer}>
                        <i class="bi bi-plus-lg px-2"></i>
                        Create Vendor
                    </button>
                </div>
                {showPopup && <VendorPopup onClose={handleClosePopup} />}

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

export default VendorList;
