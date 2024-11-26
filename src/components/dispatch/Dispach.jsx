import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTable, usePagination } from 'react-table';
import { collection, getDocs, query, where, getFirestore } from 'firebase/firestore';
import { fireDB } from '../firebase/FirebaseConfig';

import style from './dispach.module.css';
import EditInvoicePopup from './editDispatchInvoicePopup/EditInvoicePopup';
import EditDirectdispatchPopup from './editDirectDispatchPopup/EditDirectdispatchPopup';
import PaymentUpdatePopup from './paymentUpdatePopup/PaymentUpdatePopup';
function Dispach() {
  const [dispatchData, setDispatchData] = useState([]);
  const [productionOrdersData, setProductionOrdersData] = useState([]);
  const [dispatchInvoicedata, setDispatchInvoicedata] = useState([]);
  const [productionOrders, setProductionOrders] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDDPopup, setisDDPopup] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedDD, setselectedDD] = useState(null);
  const db = getFirestore();
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    const fetchProductionOrders = async () => {
      try {
        const productionOrdersCollection = collection(fireDB, 'Production_Orders');
        const productionQuery = query(productionOrdersCollection, where('dispatchOrInventory', '==', 'Dispatch'));
        const querySnapshot = await getDocs(productionQuery);

        const fetchedData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const dispatchData = data.dispatchData || []; // Default to empty array if not present

          // Ensure dispatchData has elements before accessing the first element
          const dispatchInfo = dispatchData.length > 0 ? dispatchData[0] : {};

          return {
            ...data,
            dispatchInvoiceNo: dispatchInfo.invoiceNo, // Set invoiceNo from the first dispatchData
            dispatchCustomerName: dispatchInfo.customerName, // Set customerName from the first dispatchData
          };
        });

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

  const DirectDispatchEditHandle = (row) => {
    setselectedDD(row);
    setisDDPopup(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedInvoice(null);
  };

  const closeDD = () => {
    setisDDPopup(false);
    setisDDPopup(null);
  };

  const handlePaymentUpdate = (rowData) => {
    setSelectedRowData(rowData);
    setIsPaymentPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPaymentPopupOpen(false);
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
      },
      {
        Header: 'Payment',
        Cell: ({ row }) => (
          <button
            onClick={() => handlePaymentUpdate(row.original)}
          >
            <i className="ri-refresh-line"></i>
          </button>
        )
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
        Header: 'Invoice Number',
        accessor: 'dispatchInvoiceNo', // Access the invoice number from the fetched data
      },
      {
        Header: 'Customer Name',
        accessor: 'dispatchCustomerName', // Access the customer name from the fetched data
      },
      {
        Header: 'Quantity',
        accessor: 'quantity'
      },
      {
        Header: 'Status',
        accessor: 'dispatchOrInventory'
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <button onClick={() => DirectDispatchEditHandle(row)}><i className="ri-edit-2-fill"></i></button>
        ),
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
        Header: 'FG ID',
        accessor: (row) => row.FGItem.map(item => item.FGID).join(', '),
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
          <button onClick={() => handleEdit(row)}><i className="ri-edit-2-fill"></i></button>
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
      <div className={style.dispatchWrapper}>
        <div className={style.dispachHeader}>
          <div className={style.dispachHead}>

            <div className={style.dispachTitle}>
              <i className="ri-send-plane-line"></i>
              <h3>Overview of Dispatch Items</h3>
            </div>
            <p>See the updated items for dispatch work here.</p>
          </div>


          <div className={style.dispachBtns}>
            <Link to={'/DispachInvoice'}>
              <button><i className="ri-file-add-line"></i> Create Invoice</button>
            </Link>
            <Link to={'/Packging'}>
              <button><i className="ri-red-packet-line"></i> Packaging</button>
            </Link>
          </div>

        </div>
        <hr className='hr' />



        {/* Dispatch Details Table */}
        <div className={style.dispachTableContainer} >
          <div className={style.title}>
            <div>

              <i className="ri-file-list-line"></i>
              <h4>Dispatch Details</h4>
            </div>
          </div>
          <div className={style.dispachTable}>
            <table {...getDispatchTableProps()} className={style.table}>
              <thead className={style.dispachTableHeader}>
                {dispatchHeaderGroups.map((headerGroup, headerGroupIndex) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${headerGroupIndex}`}>
                    {headerGroup.headers.map((column, columnIndex) => (
                      <th {...column.getHeaderProps()} key={`column-${columnIndex}`}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getDispatchTableBodyProps()} className={style.dispachTableBody}>
                {dispatchPage.map((row, rowIndex) => {
                  prepareDispatchRow(row);
                  return (
                    <tr {...row.getRowProps()} key={`row-${rowIndex}`}>
                      {row.cells.map((cell, cellIndex) => (
                        <td {...cell.getCellProps()} key={`cell-${rowIndex}-${cellIndex}`}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
          <div className={style.pagination}>
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
          <hr className='hr' />
          <div className={style.title}>
            <div>

              <i className="ri-send-plane-line"></i>
              <h4>Dispatch Orders</h4>
            </div>

          </div>
          <div className={style.dispachTable}>
            <table {...getProductionTableProps()} className={style.table}>
              <thead className={style.dispachTableHeader}>
                {productionHeaderGroups.map((headerGroup, headerGroupIndex) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${headerGroupIndex}`}>
                    {headerGroup.headers.map((column, columnIndex) => (
                      <th {...column.getHeaderProps()} key={`column-${columnIndex}`}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getProductionTableBodyProps()} className={style.dispachTableBody}>
                {productionPage.map((row, rowIndex) => {
                  prepareProductionRow(row);
                  return (
                    <tr {...row.getRowProps()} key={`row-${rowIndex}`}>
                      {row.cells.map((cell, cellIndex) => (
                        <td {...cell.getCellProps()} key={`cell-${rowIndex}-${cellIndex}`}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
          <div className={style.pagination}>
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

          <hr className='hr' />
          <div className={style.title}>
            <div>

              <i className="ri-receipt-line"></i>
              <h4>Invoices</h4>
            </div>
          </div>
          <div className={style.dispachTable}>
            <table {...getInvoiceTableProps()} className={style.table}>
              <thead className={style.dispachTableHeader}>
                {InvoiceHeaderGroups.map((headerGroup, headerGroupIndex) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${headerGroupIndex}`}>
                    {headerGroup.headers.map((column, columnIndex) => (
                      <th {...column.getHeaderProps()} key={`column-${columnIndex}`}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getInvoiceTableBodyProps()} className={style.dispachTableBody}>
                {InvoicePage.map((row, rowIndex) => {
                  prepareInvoiceRow(row);
                  return (
                    <tr {...row.getRowProps()} key={`row-${rowIndex}`}>
                      {row.cells.map((cell, cellIndex) => (
                        <td {...cell.getCellProps()} key={`cell-${rowIndex}-${cellIndex}`}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
          <div className={style.pagination}>
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
          {
            isPopupOpen && (
              <EditInvoicePopup
                invoice={selectedInvoice}
                onClose={closePopup}
              />
            )
          }
          {
            isDDPopup && (
              <EditDirectdispatchPopup
                invoice={selectedDD}
                onClose={closeDD}
              />
            )
          }
          {
            isPaymentPopupOpen && (
              <PaymentUpdatePopup
                rowData={selectedRowData}
                onClose={handleClosePopup}
              />
            )
          }

        </div>
      </div>
    </>
  );
}

export default Dispach;
