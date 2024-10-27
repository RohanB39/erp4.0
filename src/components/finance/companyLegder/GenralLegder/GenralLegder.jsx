import React, { useState, useEffect } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig'; // Import your Firebase config
import { collection, getDocs } from 'firebase/firestore';
import './GenralLegder.css';
import PayableTable from '../../payables/payableTable/PayableTable';
import SaleTable from '../SaleTable/SaleTable';
import PurchaseTable from '../PurchaseTable/PurchaseTable';

const GenralLegder = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [documentType, setDocumentType] = useState('');

  // Function to fetch data from Firestore
  const fetchData = async () => {
    let combinedData = [];

    // Fetch data from Payable_Ledger
    const payableSnapshot = await getDocs(collection(fireDB, 'Payable_Ledger'));
    payableSnapshot.forEach((doc) => {
      combinedData.push({
        id: doc.id,
        date: doc.data().GRNDate, // Date field
        particulars: doc.data().materialName, // Particulars field
        invoiceNo: doc.data().vendorInvoice, // Invoice Number field
        drOrCr: 'DR', // DR for Payable
        documentType: 'General Ledger',
        accountNumber: '', // Account Number is empty
        accountName: doc.data().paymentStatus || 'Payables', // Account Name
        debit: doc.data().GrnInvoicePrice || 0, // Debit field
        credit: 0, // No credit for Payable Ledger
      });
    });

    // Fetch data from Receivable_Ledger
    const receivableSnapshot = await getDocs(collection(fireDB, 'Receivable_Ledger'));
    receivableSnapshot.forEach((doc) => {
      combinedData.push({
        id: doc.id,
        date: doc.data().dispatchDate, // Date field
        particulars: doc.data().customer, // Particulars field
        invoiceNo: doc.data().invoiceNo, // Invoice Number field
        drOrCr: 'CR', // CR for Receivable
        documentType: 'General Ledger',
        accountNumber: '', // Account Number is empty
        accountName: doc.data().paymentStatus || 'Receivables', // Account Name
        debit: 0, // No debit for Receivable Ledger
        credit: doc.data().amount || 0, // Credit field
      });
    });

    // Fetch data from Machines
    const machinesSnapshot = await getDocs(collection(fireDB, 'Machines'));
    machinesSnapshot.forEach((doc) => {
      combinedData.push({
        id: doc.id,
        date: doc.data().purchaseDate, // Date field
        particulars: `${doc.data().manifacturarname} + ${doc.data().machineName}`, // Combine manufacturer and machine name
        invoiceNo: doc.data().vendorInvoice, // Invoice Number field
        drOrCr: 'DR', // DR for Machines
        documentType: 'General Ledger',
        accountNumber: '', // Account Number is empty
        accountName: doc.data().paymentStatus || 'Machines', // Account Name
        debit: doc.data().machinePrice || 0, // Debit field
        credit: 0, // No credit for Machines
      });
    });

    // Sort by latest date
    combinedData.sort((a, b) => new Date(b.date) - new Date(a.date));

    setTransactions(combinedData);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filtered transactions based on search and dropdown
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearchTerm = transaction.accountName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDocumentType = documentType
      ? transaction.documentType === documentType
      : true;
    return matchesSearchTerm && matchesDocumentType;
  });

  return (
    <div>
      <h1>General Ledger</h1>

      <div className='info'>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by Name of Business"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {/* Another Dropdown for Ledger Type */}
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="document-dropdown"
        >
          <option value="">Select Ledger</option>
          <option value="Sale">Sale</option>
          <option value="Purchase">Purchase</option>
        </select>
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Sr/No</th>
            <th>Date</th>
            <th>Particulars</th>
            <th>Invoice Number</th>
            <th>DR or CR</th>
            <th>Account Number</th>
            <th>Account Name</th>
            <th>Debit</th>
            <th>Credit</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction, index) => (
            <tr key={transaction.id}>
              <td>{index + 1}</td>
              <td>{transaction.date}</td>
              <td>{transaction.particulars}</td>
              <td>{transaction.invoiceNo}</td>
              <td>{transaction.drOrCr}</td>
              <td>{transaction.accountNumber}</td>
              <td>{transaction.accountName}</td>
              <td className="debit">{transaction.debit > 0 && <span className="red">{transaction.debit} Rs</span>}</td>
              <td className="credit">{transaction.credit > 0 && <span className="green">{transaction.credit} Rs</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {documentType === 'Sale' && <SaleTable />}
      {documentType === 'Purchase' && <PurchaseTable />}
    </div>
  );
};

export default GenralLegder;
