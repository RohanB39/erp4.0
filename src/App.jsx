import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

// Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';

// Components
import LoginPage from './components/loginPage/LoginPage';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import Main from './components/mainDash/Main';
import CustomerList from './components/Masters/customer/CustomerList';
import ItemList from './components/Masters/items/ItemList';
import VendorList from './components/Masters/vendor/VendorList';
import RawMaterial from './components/Masters/rawMaterial/RawMaterial';
import SemiFinished from './components/Masters/semiFinished/SemiFinished';
import Finished from './components/Masters/finished/Finished';
import Master from './components/analysis/MasterCard';
import HrDashboard from './components/hr/HrDashboard';
import ViewEmployees from './components/hr/employee/viewEmployee/ViewEmployees';
import UpdateEmployee from './components/hr/employee/updateEmployee/UpdateEmployee';
import Attendance from './components/hr/attendance/Attendance';
import Payroll from './components/hr/payments/payrollOverview/Payroll';
import PayrollTable from './components/hr/payments/payrollOverview/PayrollTable';
import ShiftOverrideForm from './components/hr/shift/ShiftOverrideForm';
import LeavePage from './components/hr/leave/LeavePage';
import ShiftRosterPage from './components/hr/shift/ShiftRosterPage';
import AllProduction from './components/production/AllProduction';
import Store from './components/store/Store';
import FinancePage from './components/finance/FinancePage';
import SalesPurchase from './components/purchase/SalesPurchase';
import MasterDash from './components/Masters/MasterDash';
import Dispach from './components/dispatch/Dispach';
import DispachInvoice from './components/dispatch/dispatchInvoice/DispachInvoice';
import AllQuality from './components/Quality/AllQuality';
import Grn from './components/store/grn/Grn';
import PurchaseOrder from './components/purchase/purchaseOrder/PurchaseOrder';
import DemandMaterial from './components/production/demandMaterial/DemandMaterial';
import ProductionProcess from './components/production/productionProcess/ProductionProcess';
import AddMachines from './components/production/addMachines/AddMachines';
import Packging from './components/dispatch/packging/Packging';
import FGInventory from './components/store/FGInventory/FGInventory';
import CustomerPO from './components/purchase/customerPurchaseOrder/CustomerPO';
import ExistingMaterialGrn from './components/store/grn/existingMaterialGrn/ExistingMaterialGrn';
import ExistingMaterialInward from './components/Quality/ExistingMaterialInward';
import Receivables from './components/finance/receivables/Receivables';
import Payables from './components/finance/payables/Payables';
import CompanyLegder from './components/finance/companyLegder/CompanyLegder';
import EmployeeLogin from './components/hr/EmployeeLogin/EmployeeLogin';
import SalaryDetails from './components/hr/SalaryDetails/SalaryDetails';
import ApproveLeave from './components/hr/leave/ApproveLeave/ApproveLeave';
import onboardEmployee from './components/hr/OnboardEmployee/OnboardEmployee';
import { useAuth } from './AuthContext';
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Set initial state to false
    const handleLogin = () => {
        setIsLoggedIn(true);
    };
    return (
        <BrowserRouter>
            {!isLoggedIn ? (
                <LoginPage onLogin={handleLogin} />
            ) : (
                <>
                    <Header />
                    <Sidebar />
                    <div className="main-content">
                        <Routes>
                            <Route path='/' element={<Main />} />
                            <Route path='/Master' element={<Master />} />
                            <Route path='/CustomerList' element={<CustomerList />} />
                            <Route path='/ItemList' element={<ItemList />} />
                            <Route path='/VendorList' element={<VendorList />} />
                            <Route path='/RawMaterial' element={<RawMaterial />} />
                            <Route path='/SemiFinished' element={<SemiFinished />} />
                            <Route path='/Finished' element={<Finished />} />
                            <Route path='/HrDashboard' element={<HrDashboard />} />
                            <Route path='/view-employees' element={<ViewEmployees />} />
                            <Route path='/attendance' element={<Attendance />} />
                            <Route path='/update-employee' element={<UpdateEmployee />} />
                            <Route path='/process-payroll' element={<Payroll />} />
                            <Route path='/payroll-table' element={<PayrollTable />} />
                            <Route path='/Payroll' element={<Payroll />} />
                            <Route path="/ShiftOverrideForm" element={<ShiftOverrideForm />} />
                            <Route path='/LeavePage' element={<LeavePage />} />
                            <Route path='/ShiftRosterPage' element={<ShiftRosterPage />} />
                            <Route path="/allproduction" element={<AllProduction />} />
                            <Route path="/FinancePage" element={<FinancePage />} />
                            <Route path='/SalesPurchase' element={<SalesPurchase />} />
                            <Route path="/purchase-order" element={<PurchaseOrder />} />
                            <Route path="/customerPO" element={<CustomerPO />} />
                            <Route path='/MasterDash' element={<MasterDash />} />
                            <Route path="/Store" element={<Store />} />
                            <Route path='/Dispach' element={<Dispach />} />
                            <Route path='/DispachInvoice' element={<DispachInvoice />} />
                            <Route path='/Packging' element={<Packging />} />
                            <Route path="/AllQuality" element={<AllQuality />} />
                            <Route path="/Store" element={<Store />} />
                            <Route path="/Grn" element={<Grn />} />
                            <Route path="/fgInventory" element={<FGInventory />} />
                            <Route path="/DemandMaterial" element={<DemandMaterial />} />
                            <Route path="/ProductionProcess" element={<ProductionProcess />} />
                            <Route path="/addMachines" element={<AddMachines />} />
                            <Route path="/existing-material-grn" element={<ExistingMaterialGrn />} />
                            <Route path="/existing-material-Inward" element={<ExistingMaterialInward />} />
                            <Route path="/receivable" element={<Receivables />} />
                            <Route path="/payables" element={<Payables />} />
                            <Route path="/Company-Legder" element={<CompanyLegder />} />
                            <Route path="/EmployeeLogin" element={<EmployeeLogin />} />
                            <Route path="/onboardEmployee/:id" element={<onboardEmployee />} />
                            <Route path="/salaryDetails" element={<SalaryDetails />} />
                            <Route path="/approve-leave" element={<ApproveLeave />} />
                        </Routes>
                    </div>
                </>
            )}
        </BrowserRouter>
    );
}

export default App;