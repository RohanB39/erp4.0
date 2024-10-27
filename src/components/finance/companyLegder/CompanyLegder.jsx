import React, { useState } from 'react';
import './companyLedger.css';
import RawMaterialTable from './rawMaterialTable/RawMaterialTable';
import FinishedGoodsTable from './finishedGoodsTable/FinishedGoodsTable';
import SalaryTable from './salaryTable/SalarayTable';
import RecivableTable from '../receivables/recivableTable/RecivableTable';
import OnlineRecivable from '../receivables/recivableTable/OnlineRecivable';
import CashRecivable from '../receivables/recivableTable/CashRecivable';
import PayableTable from '../payables/payableTable/PayableTable';
import CashPayable from '../payables/payableTable/CashPayable';
import OnlinePayable from '../payables/payableTable/OnlinePayable';
import CashFlow from './cash/CashFlow';
import AssetsTable from './assetsTable/AssetsTable';
import ActiveAssets from './assetsTable/AssetsOptions/ActiveAssets';
import InactiveAssets from './assetsTable/AssetsOptions/InactiveAssets';
import UnderMaintainanceAssets from './assetsTable/AssetsOptions/UnderMaintainanceAssets';
import GenralLegder from './GenralLegder/GenralLegder';
import SaleTable from './SaleTable/SaleTable';
import PurchaseTable from './PurchaseTable/PurchaseTable';

const CompanyLedger = () => {
  // Set 'salaryPayroll' as the default selected option
  const [selectedOption, setSelectedOption] = useState('genral');
  const [paymentOption, setPaymentOption] = useState('');
  const [inventoryOption, setInventoryOption] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [payableType, setPayableType] = useState('');
  const [assetsOption, setAssetsOption] = useState('');

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

  const handleDocumentType = (event) => {
    setDocumentType(event.target.value);
  };

  const handlePayableChange = (event) => {
    setPayableType(event.target.value);
};

  const handleInventoryOptionChange = (event) => {
    setInventoryOption(event.target.value);
  };

  const handleIAssetsptionChange = (event) => {
    setAssetsOption(event.target.value);
  };

  return (
    <div id='main'>
      <h1>Company Ledger</h1>
      <div className='ddContainer'>
        <div className="dropdown-container">
          <select
            id="ledgerOptions"
            value={selectedOption}
            onChange={handleDropdownChange}
            className="custom-dropdown"
          >
            <option value="" disabled>Category</option>
            <option value="payments">Payments</option>
            <option value="inventoryLedger">Inventory</option>
            <option value="salaryPayroll">Salary & Payroll</option>
            <option value="genral">General</option>
            <option value="cash">Cash</option>
            <option value="sale">Sale</option>
            <option value="purchase">Purchase</option>
            <option value="asset">Asset</option>
          </select>
        </div>

        {selectedOption === 'payments' && (
          <div className="dropdown-container">
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

        {/* Conditionally render the "Online or Cash" dropdown when 'receivable' is selected under payments */}
        {paymentOption === 'receivable' && (
          <div className="dropdown-container">
            <select
              id="Category"
              value={documentType}
              onChange={handleDocumentType}
              className="custom-dropdown"
            >
              <option value="" disabled>Select Type</option>
              <option value="online">Online</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        )}

        {paymentOption === 'payable' && (
          <div className="dropdown-container">
            <select
              id="category"
              value={payableType}
              onChange={handlePayableChange}
              className="custom-dropdown"
            >
              <option value="" disabled>Select Type</option>
              <option value="online">Online</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        )}

        {selectedOption === 'inventoryLedger' && (
          <div className="dropdown-container">
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

        {selectedOption === 'asset' && (
          <div className="dropdown-container">
            <select
              id="assetsledgeroption"
              value={assetsOption}
              onChange={handleIAssetsptionChange}
              className="custom-dropdown"
            >
              <option value="" disabled>Select Assets type</option>
              <option value="active">Active</option>
              <option value="inActive">Inactive</option>
              <option value="um">Under Maintainance</option>
            </select>
          </div>
        )}
      </div>


      {paymentOption === 'receivable' && <RecivableTable />}
      {paymentOption === 'receivable' && documentType === 'cash' && <CashRecivable />}
      {paymentOption === 'receivable' && documentType === 'online' && <OnlineRecivable />}

      {paymentOption === 'payable' && <PayableTable />}
      {paymentOption === 'payable' && payableType === 'cash' && <CashPayable />}
      {paymentOption === 'payable' && payableType === 'online' && <OnlinePayable />}

      {inventoryOption === 'rawMaterial' && <RawMaterialTable />}
      {inventoryOption === 'finishedGoods' && <FinishedGoodsTable />}
      {selectedOption === 'salaryPayroll' && <SalaryTable />}
      {selectedOption === 'cash' && <CashFlow />}

      {selectedOption === 'asset' && <AssetsTable />}
      {selectedOption === 'asset' && assetsOption === 'active' && <ActiveAssets />}
      {selectedOption === 'asset' && assetsOption === 'inActive' && <InactiveAssets />}
      {selectedOption === 'asset' && assetsOption === 'um' && <UnderMaintainanceAssets />}

      {selectedOption === 'genral' && <GenralLegder />}
      {selectedOption === 'sale' && <SaleTable />}
      {selectedOption === 'purchase' && <PurchaseTable />}

    </div>
  );
};

export default CompanyLedger;
