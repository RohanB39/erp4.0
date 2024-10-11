import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTable, usePagination } from 'react-table';
import { collection, getDocs, query, where, getFirestore } from 'firebase/firestore';
import { fireDB } from '../firebase/FirebaseConfig';
import './dispach.css';
import EditInvoicePopup from './editDispatchInvoicePopup/EditInvoicePopup';

function Dispach() {
  const [dispatchData, setDispatchData] = useState([]);
  const [productionOrdersData, setProductionOrdersData] = useState([]);
  const [dispatchInvoicedata, setDispatchInvoicedata] = useState([]);
  const [productionOrders, setProductionOrders] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null); 
  const db = getFirestore();

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

  useEffect(() => {
    const fetchDispatchOrders = async () => {
      try {
        const productionOrdersCollection = collection(fireDB, 'Dispatch_Invoices');
        const productionQuery = query(productionOrdersCollection, where('invStatus', '==', 'Dispatched'));
        const querySnapshot = await getDocs(productionQuery);
        const fetchedData = querySnapshot.docs.map(doc => doc.data());
        setDispatchData(fetchedData);
      } catch (error) {
        console.error('Error fetching production orders: ', error);
      }
    };

    fetchDispatchOrders();
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const dispatchInvoices = collection(fireDB, 'Dispatch_Invoices');
        const invoiceQuery = query(dispatchInvoices, where('invStatus', '==', 'Active'));
        const querySnapshot = await getDocs(invoiceQuery);
        const fetchedData = querySnapshot.docs.map(doc => doc.data());
        setDispatchInvoicedata(fetchedData);
      } catch (error) {
        console.error('Error fetching production orders: ', error);
      }
    };

    fetchInvoices();
  }, []);

  const handleEdit = (row) => {
    setSelectedInvoice(row);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedInvoice(null);
  };

  const dispatchColumns = useMemo(
    () => [
      {
        Header: 'Sr No.',
        accessor: (row, index) => index + 1
      },
      {
        Header: 'Date of Dispatch',
        accessor: row => row.dispatchDetails.dispatchDate
      },
      {
        Header: 'Time of Dispatch',
        accessor: row => row.dispatchDetails.dispatchTime 
      },
      {
        Header: 'Dispatch Vehicle',
        accessor: row => row.dispatchDetails.dispatchVehicle
      },
      {
        Header: 'Invoice No.',
        accessor: 'invoiceNo'
      },
      {
        Header: 'Receipt No.',
        accessor: row => row.dispatchDetails.receiptNumber
      },
      {
        Header: 'Customer',
        accessor: 'customer'
      },
      {
        Header: 'Amount',
        accessor: row => `${row.total} Rs`
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
      {
        Header: 'Status',
        accessor: 'dispatchOrInventory'
      },
    ],
    []
  );

  const dispatchInvoiceColumns = useMemo(
    () => [
      {
        Header: 'Sr No.',
        accessor: (row, index) => index + 1
      },
      {
        Header: 'Invoice Number',
        accessor: 'invoiceNo'
      },
      {
        Header: 'Order Number',
        accessor: 'orderNo'
      },
      {
        Header: 'FG Name',
        accessor: (row) => row.FGItem.map(item => item.FGName).join(', '),
      },
      {
        Header: 'Approved Quantity',
        accessor: (row) => row.FGItem.map(item => item.approvedQty).join(', '),
      },
      {
        Header: 'Customer Name',
        accessor: 'customer'
      },
      {
        Header: 'Price',
        accessor: 'total'
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <button onClick={() => handleEdit(row)}>Edit</button>
        ),
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

  const {
    getTableProps: getInvoiceTableProps,
    getTableBodyProps: getInvoiceTableBodyProps,
    headerGroups: InvoiceHeaderGroups,
    page: InvoicePage,
    nextPage: nextInvoicePage,
    previousPage: previousInvoicePage,
    canNextPage: canNextInvoicePage,
    canPreviousPage: canPreviousInvoicePage,
    pageOptions: InvoicePageOptions,
    state: { pageIndex: InvoicePageIndex },
    prepareRow: prepareInvoiceRow
  } = useTable(
    {
      columns: dispatchInvoiceColumns,
      data: dispatchInvoicedata,
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
        <div>
        </div>
        <div>
          <h4>Dispatch Orders</h4>
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


        <div>
          <h4>Invoices</h4>
        </div>
        <div className="dispach-table">
          <table {...getInvoiceTableProps()} className="table">
            <thead>
              {InvoiceHeaderGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getInvoiceTableBodyProps()}>
              {InvoicePage.map(row => {
                prepareInvoiceRow(row);
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
          <button onClick={() => previousInvoicePage()} disabled={!canPreviousInvoicePage}>
            {'<'}
          </button>
          <span>
            {InvoicePageIndex + 1} of {InvoicePageOptions.length}
          </span>
          <button onClick={() => nextInvoicePage()} disabled={!canNextInvoicePage}>
            {'>'}
          </button>
        </div>
        {isPopupOpen && (
          <EditInvoicePopup
            invoice={selectedInvoice}
            onClose={closePopup}
          />
        )}
      </div>
    </>
  );
}

export default Dispach;
