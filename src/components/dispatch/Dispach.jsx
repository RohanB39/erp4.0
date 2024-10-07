import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTable, usePagination } from 'react-table';
import { collection, getDocs, query, where, getFirestore } from 'firebase/firestore';
import { fireDB } from '../firebase/FirebaseConfig';
import './dispach.css';

function Dispach() {
  // Since there's no dispatch data yet, use dummy data or keep it empty
  const [dispatchData, setDispatchData] = useState([]);
  const [productionOrdersData, setProductionOrdersData] = useState([]); 

  const [productionOrders, setProductionOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const db = getFirestore(); 

  useEffect(() => {
    const fetchDispatchOrInventory = async () => {
      const q = query(
        collection(db, "Production_Orders"),
        where("dispatchOrInventory", "==", "Inventory")
      );
      const querySnapshot = await getDocs(q);
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      setProductionOrders(orders);
    };

    fetchDispatchOrInventory();
  }, [db]);

  // Handle selection change
  const handleSelectChange = (e) => {
    setSelectedOrder(e.target.value);
  };

  // Handle Add button click
  const handleAddClick = () => {
    if (selectedOrder) {
      console.log("Selected Production Order ID:", selectedOrder);
      // You can now use the selectedOrder ID for further actions
    } else {
      alert("Please select a production order");
    }
  };

  useEffect(() => {
    const fetchProductionOrders = async () => {
      try {
        const productionOrdersCollection = collection(fireDB, 'Production_Orders');
        const productionQuery = query(productionOrdersCollection, where('dispatchOrInventory', '==', 'Dispatch'));
        const querySnapshot = await getDocs(productionQuery);
        const fetchedData = querySnapshot.docs.map(doc => doc.data());
        setProductionOrdersData(fetchedData);
      } catch (error) {
        console.error('Error fetching production orders: ', error);
      }
    };

    fetchProductionOrders();
  }, []);

  // Columns for Dispatch Details Table
  const dispatchColumns = useMemo(
    () => [
      {
        Header: 'Sr No.',
        accessor: (row, index) => index + 1
      },
      {
        Header: 'Date of Dispatch',
        accessor: 'date'
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

  // Columns for Dispatch Operations Table
  const productionOrdersColumns = useMemo(
    () => [
      {
        Header: 'Sr No.',
        accessor: (row, index) => index + 1
      },
      {
        Header: 'Production Order ID',
        accessor: 'productionOrderId'
      },
      {
        Header: 'Product ID',
        accessor: 'selectedProductId'
      },
      {
        Header: 'Quantity',
        accessor: 'quantity'
      },
    ],
    []
  );

  // Dispatch Details Table configuration
  const {
    getTableProps: getDispatchTableProps,
    getTableBodyProps: getDispatchTableBodyProps,
    headerGroups: dispatchHeaderGroups,
    page: dispatchPage,
    nextPage: nextDispatchPage,
    previousPage: previousDispatchPage,
    canNextPage: canNextDispatchPage,
    canPreviousPage: canPreviousDispatchPage,
    pageOptions: dispatchPageOptions,
    state: { pageIndex: dispatchPageIndex },
    prepareRow: prepareDispatchRow
  } = useTable(
    {
      columns: dispatchColumns,
      data: dispatchData, // Currently empty or you can add some dummy data here
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    usePagination
  );

  // Dispatch Operations Table configuration
  const {
    getTableProps: getProductionTableProps,
    getTableBodyProps: getProductionTableBodyProps,
    headerGroups: productionHeaderGroups,
    page: productionPage,
    nextPage: nextProductionPage,
    previousPage: previousProductionPage,
    canNextPage: canNextProductionPage,
    canPreviousPage: canPreviousProductionPage,
    pageOptions: productionPageOptions,
    state: { pageIndex: productionPageIndex },
    prepareRow: prepareProductionRow
  } = useTable(
    {
      columns: productionOrdersColumns,
      data: productionOrdersData,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    usePagination
  );

  return (
    <>
      <div className="dispach-container">
        <div id="main">
          <div className="dispach-title">
            <div>
              <h3>Overview of Dispatch Items</h3>
              <p>See the updated items for dispatch work here.</p>
            </div>
            <div>
              <Link to={'/DispachInvoice'}>
                <button>Create Invoice</button>
              </Link>
              <Link to={'/Packging'}>
                <button>Packaging</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch Details Table */}
      <div className="dispach-table-container" id="main">
        <div>
          <h4>Dispatch Details</h4>
        </div>
        <div className="dispach-table">
          <table {...getDispatchTableProps()} className="table">
            <thead>
              {dispatchHeaderGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getDispatchTableBodyProps()}>
              {dispatchPage.map(row => {
                prepareDispatchRow(row);
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
          <button onClick={() => previousDispatchPage()} disabled={!canPreviousDispatchPage}>
            {'<'}
          </button>
          <span>
            {dispatchPageIndex + 1} of {dispatchPageOptions.length}
          </span>
          <button onClick={() => nextDispatchPage()} disabled={!canNextDispatchPage}>
            {'>'}
          </button>
        </div>

      {/* Dispatch Operations Table */}
        <div>
          <h4>Dispatch Operations</h4>
        </div>
        <div>
      <h3>Select a Production Order</h3>
      <select value={selectedOrder} onChange={handleSelectChange}>
        <option value="">-- Select Production Order --</option>
        {productionOrders.map((order) => (
          <option key={order.id} value={order.id}>
            {order.id} - {order.someOtherField} {/* Replace with relevant data */}
          </option>
        ))}
      </select>

      <button onClick={handleAddClick}>Add</button>
    </div>
        <div className="dispach-table">
          <table {...getProductionTableProps()} className="table">
            <thead>
              {productionHeaderGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getProductionTableBodyProps()}>
              {productionPage.map(row => {
                prepareProductionRow(row);
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
          <button onClick={() => previousProductionPage()} disabled={!canPreviousProductionPage}>
            {'<'}
          </button>
          <span>
            {productionPageIndex + 1} of {productionPageOptions.length}
          </span>
          <button onClick={() => nextProductionPage()} disabled={!canNextProductionPage}>
            {'>'}
          </button>
        </div>
      </div>
    </>
  );
}

export default Dispach;
