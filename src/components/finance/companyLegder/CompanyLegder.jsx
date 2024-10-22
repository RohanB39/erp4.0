import React, { useState } from 'react';
import './companyLedger.css'; // Import custom CSS file for styling
import Receivables from '../receivables/Receivables'; // Import the Receivables component
import Payable from '../payables/Payables'; // Import the Receivables component
import RawMaterialTable from './rawMaterialTable/RawMaterialTable';
import FGInventory from '../../store/FGInventory/FGInventory';
import FinishedGoodsTable from './finishedGoodsTable/FinishedGoodsTable';
import SalaryTable from './salaryTable/SalarayTable';

const CompanyLedger = () => {
  // Set 'salaryPayroll' as the default selected option
  const [selectedOption, setSelectedOption] = useState('salaryPayroll');
  const [paymentOption, setPaymentOption] = useState(''); 
  const [inventoryOption, setInventoryOption] = useState('');

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
    // Reset paymentOption if a new category is selected
    if (event.target.value !== 'payments') {
      setPaymentOption('');
    }
    if (event.target.value !== 'inventoryLedger') {
      setInventoryOption('');
    }
  };

  const handlePaymentOptionChange = (event) => {
    setPaymentOption(event.target.value);
  };

  const handleInventoryOptionChange = (event) => {
    setInventoryOption(event.target.value);
  };

  return (
    <div id='main'>
      <h1>Company Ledger</h1>

      <div className="dropdown-container">
        <select
          id="ledgerOptions"
          value={selectedOption}
          onChange={handleDropdownChange}
          className="custom-dropdown" // Apply custom styling
        >
          <option value="" disabled>Category</option>
          <option value="payments">Payments</option>
          <option value="inventoryLedger">Inventory Ledger</option>
          <option value="salaryPayroll">Salary & Payroll</option>
        </select>
      </div>

      {selectedOption === 'payments' && (
        <div className="dropdown-container2">
          <select
            id="paymentOptions"
            value={paymentOption}
            onChange={handlePaymentOptionChange}
            className="custom-dropdown"
          >
            <option value="" disabled>Select a payment type</option>
            <option value="receivable">Receivable</option>
            <option value="payable">Payable</option>
          </select>
        </div>
      )}
      
      {paymentOption === 'receivable' && <Receivables />}
      {paymentOption === 'payable' && <Payable />}

      {selectedOption === 'inventoryLedger' && (
        <div className="dropdown-container2">
          <select
            id="inventoryLedgerOption"
            value={inventoryOption}
            onChange={handleInventoryOptionChange}
            className="custom-dropdown"
          >
            <option value="" disabled>Select Material type</option>
            <option value="rawMaterial">Raw Material</option>
            <option value="finishedGoods">Finished Goods</option>
          </select>
        </div>
      )}
      {inventoryOption === 'rawMaterial' && <RawMaterialTable />}
      {inventoryOption === 'finishedGoods' && <FinishedGoodsTable />}

      {selectedOption === 'salaryPayroll' && <SalaryTable />}
    </div>
  );
};

export default CompanyLedger;
