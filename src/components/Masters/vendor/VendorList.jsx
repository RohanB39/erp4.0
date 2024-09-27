import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import VendorPopup from "./vendorPopup/VendorPopup";
import './vendorList.css';

const columns = (handleDeleteCustomer) => [
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
    accessor: "shippingAddress",
    Cell: ({ value }) => (
      <div>
        <div>{value.address}</div>
        <div>{value.country}</div>
        <div>{value.state}</div>
        <div>{value.district}</div>
        <div>{value.taluka}</div>
        <div>{value.pincode}</div>
        <div>{value.phoneNumber}</div>
        <div>{value.fax}</div>
      </div>
    ),
  },
  {
    Header: "Billing Address",
    accessor: "billingAddress",
    Cell: ({ value }) => (
      <div>
        <div>{value.address}</div>
        <div>{value.country}</div>
        <div>{value.state}</div>
        <div>{value.district}</div>
        <div>{value.taluka}</div>
        <div>{value.pincode}</div>
        <div>{value.phoneNumber}</div>
        <div>{value.fax}</div>
      </div>
    ),
  },
  {
    Header: "Phone Number",
    accessor: "phoneNumber",
  },
  {
    Header: "Actions",
    Cell: ({ row }) => (
      <button className="delete-btn" onClick={() => handleDeleteCustomer(row.original.id)}>Delete</button>
    ),
  },
];

function CustomerList() {
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(fireDB, "Vendors"));
      const customers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(customers);
    };

    fetchData();
  }, []);

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteDoc(doc(db, "customers", id));
      setData(prevData => prevData.filter(customer => customer.id !== id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

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
      columns: useMemo(() => columns(handleDeleteCustomer), []),
      data,
      initialState: { pageIndex: 0, pageSize: 4 },
    },
    useSortBy,
    usePagination
  );

  const handleCreateCustomer = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSaveCustomer = async (customer) => {
    try {
      await addDoc(collection(db, "customers"), customer);
      setShowPopup(false);
      // Fetch data again after adding a new customer
      const querySnapshot = await getDocs(collection(db, "customers"));
      const customers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(customers);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="main customerList" id="main">
      <div className="table-container">
        <div className="table-title">
          <h3>Vendor Lists</h3>
          <button className="table-btn" onClick={handleCreateCustomer}>
            <i className="bi bi-plus-lg px-2"></i>
            Create Vendor
          </button>
        </div>    


        {showPopup && <VendorPopup onClose={handleClosePopup} onSave={handleSaveCustomer} />}

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
                    <td key={cell.column.id} {...cell.getCellProps()}>{cell.render("Cell")}</td>
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

export default CustomerList;
