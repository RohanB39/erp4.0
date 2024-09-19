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
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import CustomerList from './components/CustomerList';
import ItemList from './components/ItemList';
import VendorList from './components/VendorList';
import RawMaterial from './components/RawMaterial';
import SemiFinished from './components/SemiFinished';
import Finished from './components/Finished';
import Master from './components/Master';
import HrDashboard from './components/HrDashboard';
import AddEmployee from './components/AddEmployee';
import ViewEmployees from './components/ViewEmployees';
import UpdateEmployee from './components/UpdateEmployee';
import AddLeave from './components/AddLeave';
import Attendance from './components/Attendance';
import Payroll from './components/Payroll';
import PayrollTable from './components/PayrollTable';
import LeaveOverview from './components/LeaveOverview';
import LeaveCalendar from './components/LeaveCalendar';
import ShiftOverrideForm from './components/ShiftOverrideForm';
import LeavePage from './components/LeavePage';
import ShiftRosterPage from './components/ShiftRosterPage';

import AllProduction from './components/sales-purchase/AllProduction';
import Store from './components/Store';
import FinancePage from './components/FinancePage';
import SalesPurchase from './components/sales-purchase/SalesPurchase';
import MasterDash from './components/Masters/MasterDash';
import Dispach from './components/Dispach';
import DispachInvoice from './components/DispachInvoice';

import AllQuality from './components/Quality/AllQuality';
import Grn from './components/Grn';
import PurchaseOrder from './components/sales-purchase/PurchaseOrder';
import DemandMaterial from './components/DemandMaterial';
import ProductionProcess from './components/ProductionProcess';





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
                            <Route path='/LeaveOverview' element={<LeaveOverview />} />
                            <Route path='/LeaveCalendar' element={<LeaveCalendar />} />
                            <Route path="/ShiftOverrideForm" element={<ShiftOverrideForm />} />
                            <Route path='/LeavePage' element={<LeavePage />} />
                            <Route path='/ShiftRosterPage' element={<ShiftRosterPage />} />
                             <Route path="/allproduction" element={<AllProduction />} />
                            <Route path="/FinancePage" element={<FinancePage />} />
                            <Route path='/SalesPurchase' element={<SalesPurchase />} />
                            <Route path="/purchase-order" element={<PurchaseOrder />} />
                            <Route path='/MasterDash' element={<MasterDash />} />

                            <Route path="/Store" element={<Store />} />
                            <Route path='/Dispach' element={<Dispach />} />
                            < Route path='/DispachInvoice' element={<DispachInvoice />} />

                            <Route path="/AllQuality" element={<AllQuality />} />

                            <Route path="/Store" element={<Store />} /> 
                            <Route path="/Grn" element={<Grn />} />
                            <Route path="/DemandMaterial" element={<DemandMaterial />} />
                            <Route path="/ProductionProcess" element={<ProductionProcess />} />

                        </Routes>
                    </div>
                </>
            )}
        </BrowserRouter>
    );
}

export default App;