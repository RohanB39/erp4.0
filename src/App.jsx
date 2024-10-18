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
import AddEmployee from './components/hr/employee/addEmployee/AddEmployee';
import ViewEmployees from './components/hr/employee/viewEmployee/ViewEmployees';
import UpdateEmployee from './components/hr/employee/updateEmployee/UpdateEmployee';
import AddLeave from './components/hr/leave/AddLeave';
import Attendance from './components/hr/attendance/Attendance';
import Payroll from './components/hr/payments/payrollOverview/Payroll';
import PayrollTable from './components/hr/payments/payrollOverview/PayrollTable';
import LeaveOverview from './components/hr/leave/LeaveOverview';
import LeaveCalendar from './components/hr/leave/LeaveCalendar';
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





function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Set initial state to false
    const [employees, setEmployees] = useState([]);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleAddEmployee = (employee) => {
        setEmployees([...employees, employee]);
    };

    const handleUpdateEmployee = (updatedEmployee) => {
        setEmployees(employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
    };

    const handleSubmit = (leaveData) => {
        console.log('Leave Data:', leaveData);
    };

    const handleDeleteEmployee = (id) => {
        setEmployees(employees.filter(emp => emp.id !== id));
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
                            <Route path='/add-employee' element={<AddEmployee onAdd={handleAddEmployee} />} />
                            <Route path='/view-employees' element={<ViewEmployees employees={employees} onDelete={handleDeleteEmployee} />} />
                            <Route path='/add-leave' element={<AddLeave onAdd={handleSubmit} />} />
                            <Route path='/attendance' element={<Attendance />} />
                            <Route path='/update-employee' element={<UpdateEmployee onUpdateEmployee={handleUpdateEmployee} employees={employees} />} />
                            <Route path='/process-payroll' element={<Payroll />} />
                            <Route path='/payroll-table' element={<PayrollTable />} />
                            <Route path='/Payroll' element={<Payroll />} />
                            <Route path='/LeaveOverview' element={<LeaveOverview />} />
                            <Route path='/LeaveCalendar' element={<LeaveCalendar />} />
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
                        </Routes>
                    </div>
                </>
            )}
        </BrowserRouter>
    );
}

export default App;