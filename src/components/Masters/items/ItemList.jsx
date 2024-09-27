import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
// import CustomerPopup from "./customerPopup/CustomerPopup";

import './itemsList.css'

const columns = (handleDelete) => [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Name",
    accessor: "materialName",
  },
  {
    Header: "Details",
    accessor: "grnNumber",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
      Header: "Category",
      accessor: "hsnCode",
  },
  {
      Header: "Type",
      accessor: "materialType",
  },
  {
    Header: "Actions",
    Cell: ({ row }) => (
      <button className="delete-btn" onClick={() => handleDelete(row.original.id)}>Delete</button>
    ),
  },
];

function CustomerList() {
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(fireDB, "Items"));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(items);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Items", id));
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
      columns: useMemo(() => columns(handleDelete), []),
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
      await addDoc(collection(db, "Items"), customer);
      setShowPopup(false);
      // Fetch data again after adding a new customer
      const querySnapshot = await getDocs(collection(db, "Items"));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(items);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="main customerList" id="main">
      <div className="table-container">
        <div className="table-title">
          <h3>Customer Lists</h3>
          <button className="table-btn" onClick={handleCreateCustomer}>
            <i className="bi bi-plus-lg px-2"></i>
            Create Customer
          </button>
        </div>    


        {showPopup && <CustomerPopup onClose={handleClosePopup} onSave={handleSaveCustomer} />}

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
