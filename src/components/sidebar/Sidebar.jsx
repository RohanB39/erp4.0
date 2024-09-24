import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./sidebar.css";
import { auth } from '../firebase/FirebaseConfig.js';

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const handleToggleSubmenu = (tabName) => {
    setActiveSubmenu((prevActiveSubmenu) =>
      prevActiveSubmenu === tabName ? null : tabName
    );
  };

  const handleSignOut = async () => {
    try {

      await auth.signOut();

      sessionStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className={`sideNav ${sidebarOpen ? "" : "sidebar-closed"}`}>
      <aside id="sidebar" className={`sidebar ${sidebarOpen ? "" : "sidebar-closed"}`}>
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setActiveSubmenu(null)}>
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/SalesPurchase" className="nav-link" onClick={() => setActiveSubmenu(null)}>
              <i className="bi bi-bag-check"></i>
              <span>Purchase</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/Store" className="nav-link" onClick={() => handleToggleSubmenu("Store")}>
              <i className="bi bi-shop"></i>
              <span>Store</span>
              <i id="chevron" className={`bi bi-chevron-${activeSubmenu === "Store" ? "up" : "down"}`}></i>
              {activeSubmenu === "Store" && (
                <div className="submenu show">
                  <ul>

                    <li>
                      <Link to="/Grn" className="nav-link" onClick={() => setActiveSubmenu(null)}>
                        <i className="bi bi-check-circle"></i>
                        <span>GRN</span>
                      </Link>
                    </li>
                  </ul>
                </div>)}
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/AllQuality" className="nav-link" onClick={() => setActiveSubmenu(null)}>
              <i className="bi bi-bag-check"></i>
              <span>Quality</span>
            </Link>
          </li>


          <li className="nav-item">
            <Link
              to="/AllProduction"
              className="nav-link"
              onClick={() => handleToggleSubmenu("production")}>
              <i className="bi bi-card-list"></i>
              <span>Production</span>
              <i id="chevron" className={`bi bi-chevron-${activeSubmenu === "production" ? "up" : "down"}`}></i>
            </Link>
            {activeSubmenu === "production" && (
              <div className="submenu show">
                <ul>
                  <li>
                    <Link to="/DemandMaterial" className="nav-link" onClick={() => setActiveSubmenu(null)}>
                      <i className="bi bi-calendar"></i>
                      <span>Demand Material</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/ProductionProcess" className="nav-link" onClick={() => setActiveSubmenu(null)}>
                      <i className="bi bi-gear"></i>
                      <span>Process</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/addMachines" className="nav-link" onClick={() => setActiveSubmenu(null)}>
                    <i class="bi bi-tools"></i>
                      <span>Add Machines</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>

          <li className="nav-item">
            <Link to="/FinancePage" className="nav-link" onClick={() => setActiveSubmenu(null)}>
              <i className="bi bi-cash"></i>
              <span>Finance</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/Dispach" className="nav-link" onClick={() => setActiveSubmenu(null)}>
            <i className="bi bi-truck"></i>
              <span>Dispatch</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/HrDashboard"
              className="nav-link"
              onClick={() => handleToggleSubmenu("hr")}>
              <i className="bi bi-card-list"></i>
              <span>HR</span>
              <i id="chevron" className={`bi bi-chevron-${activeSubmenu === "hr" ? "up" : "down"}`}></i>
            </Link>
            {activeSubmenu === "hr" && (
              <div className="submenu show">
                <ul>
                  <li>
                    <Link to="./LeavePage" className="nav-link" onClick={() => setActiveSubmenu(null)}>
                      Leave
                    </Link>
                  </li>
                  <li>
                    <Link to="./Attendance" className="nav-link" onClick={() => setActiveSubmenu(null)}>
                      Attendance
                    </Link>
                  </li>
                  <li>
                    <Link to="/Payroll" className="nav-link" onClick={() => setActiveSubmenu(null)}>
                      Payroll Overview
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li className="nav-item">
            <Link to="/MasterDash" className="nav-link" onClick={() => setActiveSubmenu(null)}>
              <i className="bi bi-person"></i>
              <span>Masters</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/Master" className="nav-link" onClick={() => setActiveSubmenu(null)}>
              <i className="bi bi-bar-chart"></i>
              <span>Analysis</span>
            </Link>
          </li>
          <hr />
          <li className="nav-item signout">
            <Link to="#" className="nav-link" onClick={handleSignOut}>
              <i className="bi bi-box-arrow-left"></i> 
              <span>Sign Out</span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}

export default Sidebar;
