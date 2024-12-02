import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';

// Components
import Sidebar from './components/sidebar/Sidebar';
import LoginPage from './components/loginPage/LoginPage';
import Main from './components/mainDash/Main';
import Header from './components/header/Header';
import SalesPurchase from './components/purchase/SalesPurchase';
import CustomerPO from './components/purchase/customerPurchaseOrder/CustomerPO';
import Store from './components/store/Store';
import FGInventory from './components/store/FGInventory/FGInventory';
import Grn from './components/store/grn/Grn';
import AllQuality from './components/Quality/AllQuality';
import AllProduction from './components/production/AllProduction';
import DemandMaterial from './components/production/demandMaterial/DemandMaterial';
import ProductionProcess from './components/production/productionProcess/ProductionProcess';
import AddMachines from './components/production/addMachines/AddMachines';
import FinancePage from './components/finance/FinancePage';
import Dispach from './components/dispatch/Dispach';
import DispachInvoice from './components/dispatch/dispatchInvoice/DispachInvoice';
import Packging from './components/dispatch/packging/Packging';
import CompanyLegder from './components/finance/companyLegder/CompanyLegder';
import Payables from './components/finance/payables/Payables';
import Receivables from './components/finance/receivables/Receivables'
import PurchaseOrder from './components/purchase/purchaseOrder/PurchaseOrder'
import MasterDash from './components/Masters/MasterDash';
import CustomerForm from './components/Masters/customer/customerPopup/CustomerPopup'
import HrDashboard from './components/hr/HrDashboard';
import LeavePage from './components/hr/leave/LeavePage';
import AddLeave from './components/hr/leave/AssignLeave/AddLeave';
import ApproveLeave from './components/hr/leave/ApproveLeave/ApproveLeave';
import EmployeeLogin from './components/hr/EmployeeLogin/EmployeeLogin';
import OnboardEmployee from './components/hr/OnboardEmployee/OnboardEmployee';
import Attendance from './components/hr/attendance/Attendance';
import AttendanceCalendar from './components/hr/attendance/AttendanceCalander/AttendanceCalander';
import Payroll from './components/hr/payments/payrollOverview/Payroll';
import NewInvoice from './components/dispatch/dispatchInvoice/NewInvoice';
import SalaryDetails from './components/hr/SalaryDetails/SalaryDetails';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <BrowserRouter>
            {!isLoggedIn ? (
                <LoginPage onLogin={handleLogin} />
            ) : (
                <div className="parentBody">
                    <aside>
                        <Sidebar />
                    </aside>
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/" element={<Main />} />
                            <Route
                                path="/SalesPurchase"
                                element={isLoggedIn ? <SalesPurchase /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/CustomerPo"
                                element={isLoggedIn ? <CustomerPO /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/Storage"
                                element={isLoggedIn ? <Store /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/Grn"
                                element={isLoggedIn ? <Grn /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/fgInventory"
                                element={isLoggedIn ? <FGInventory /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/AllQuality"
                                element={isLoggedIn ? <AllQuality /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/allProduction"
                                element={isLoggedIn ? <AllProduction /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/DemandMaterial"
                                element={isLoggedIn ? <DemandMaterial /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/ProductionProcess"
                                element={isLoggedIn ? <ProductionProcess /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/AddMachines"
                                element={isLoggedIn ? <AddMachines /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/Finance"
                                element={isLoggedIn ? <FinancePage /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/Recivable"
                                element={isLoggedIn ? <Receivables /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/Payables"
                                element={isLoggedIn ? <Payables /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/CompanyLegder"
                                element={isLoggedIn ? <CompanyLegder /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/Dispach"
                                element={isLoggedIn ? <Dispach /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/DispachInvoice"
                                element={isLoggedIn ? <NewInvoice /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/Packging"
                                element={isLoggedIn ? <Packging /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/purchaseOrder"
                                element={isLoggedIn ? <PurchaseOrder /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/MasterDash"
                                element={isLoggedIn ? <MasterDash /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/CustomerForm"
                                element={isLoggedIn ? <CustomerForm /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/hrDashboard"
                                element={isLoggedIn ? <HrDashboard /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/hrLeave"
                                element={isLoggedIn ? <LeavePage /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/addLeave"
                                element={isLoggedIn ? <AddLeave /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/approveLeave"
                                element={isLoggedIn ? <ApproveLeave /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/EmployeeLogin"
                                element={isLoggedIn ? <EmployeeLogin /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/onboardEmployee/:id"
                                element={isLoggedIn ? <OnboardEmployee /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/attendance"
                                element={isLoggedIn ? <Attendance /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/attendance-calendar"
                                element={isLoggedIn ? <AttendanceCalendar /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/Payroll"
                                element={isLoggedIn ? <Payroll /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/salaryDetails"
                                element={isLoggedIn ? <SalaryDetails /> : <Navigate to="/" />}
                            />

                        </Routes>
                    </main>
                </div>
            )}
        </BrowserRouter>
    );
}

export default App;
