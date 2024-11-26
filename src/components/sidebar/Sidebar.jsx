import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../firebase/FirebaseConfig.js';
import style from './sidebar.module.css';

const Sidebar = () => {
  const location = useLocation();
  const [isSidebarClosed, setSidebarClosed] = useState(false);
  const toggleButtonRef = useRef(null);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarClosed(!isSidebarClosed);


    const subMenus = sidebarRef.current.getElementsByClassName(style.show);
    Array.from(subMenus).forEach((ul) => {
      ul.classList.remove(style.show);
      ul.previousElementSibling.classList.remove(style.rotate);
    });

    if (toggleButtonRef.current) {
      toggleButtonRef.current.classList.toggle(style.rotate);
    }
  };

  const toggleSubMenu = (event) => {
    const button = event.currentTarget;
    button.nextElementSibling.classList.toggle(style.show);
    button.classList.toggle(style.rotate);


    if (isSidebarClosed) {
      setSidebarClosed(false);
      if (toggleButtonRef.current) {
        toggleButtonRef.current.classList.remove(style.rotate);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      window.location.href = '/';
      console.log('signout')
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div ref={sidebarRef} className={`${style.sidebar} ${isSidebarClosed ? style.close : ''}`}>
      <ul>
        <li className={style.firstList}>
          <span className={style.logo}>if</span>
          <button
            onClick={toggleSidebar}
            ref={toggleButtonRef}
            id="toggleBtn"
            className={style.toggleBtn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#1E124A"
            >
              <path d="M437-253.85L210.85-480 437-706.15 474.15-669 284.77-480l189.38 189L437-253.85Zm275 0L485.85-480 712-706.15 749.15-669 559.77-480l189.38 189L712-253.85Z" />
            </svg>
          </button>
        </li>
        <li className={location.pathname === '/' ? style.activeLink : ''}>
          <Link to="/">
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <span onClick={toggleSubMenu} className={style.dropdown}>
            <i className="bi bi-bag-check"></i>
            <span>Purchase</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#1E124A"
            >
              <path d="m480-538.85-189 189L253.85-387 480-613.15 706.15-387 669-349.85l-189-189Z" />
            </svg>
          </span>
          <ul className={style.subMenu}>
            <div>
              <li className={location.pathname === '/SalesPurchase' ? style.activeLink : ''}>
                <Link to="/SalesPurchase">All Purchase</Link>
              </li>
              <li className={location.pathname === '/CustomerPO' ? style.activeLink : ''}>
                <Link to="/CustomerPO">Customer PO</Link>
              </li>

            </div>
          </ul>
        </li>
        <li>
          <span onClick={toggleSubMenu} className={style.dropdown}>
            <i className="bi bi-shop"></i>
            <span>Store</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#1E124A"
            >
              <path d="m480-538.85-189 189L253.85-387 480-613.15 706.15-387 669-349.85l-189-189Z" />
            </svg>
          </span>
          <ul className={style.subMenu}>
            <div>
              <li className={location.pathname === '/Storage' ? style.activeLink : ''}>
                <Link to="/Storage">Storage</Link>
              </li>
              <li className={location.pathname === '/Grn' ? style.activeLink : ''}>
                <Link to="/Grn">GRN</Link>
              </li>
              <li className={location.pathname === '/fgInventory' ? style.activeLink : ''}>
                <Link to="/fgInventory">FG Inventory</Link>
              </li>
            </div>
          </ul>
        </li>
        <li className={location.pathname === '/AllQuality' ? style.activeLink : ''}>
          <Link to="/AllQuality">
            <i className="bi bi-bag-check"></i>
            <span>Quality</span>
          </Link>
        </li>
        <li className={location.pathname === '/Production' ? style.activeLink : ''}>
          <span onClick={toggleSubMenu} className={style.dropdown}>
            <i className="bi bi-shop"></i>
            <span>Production</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#1E124A"
            >
              <path d="m480-538.85-189 189L253.85-387 480-613.15 706.15-387 669-349.85l-189-189Z" />
            </svg>
          </span>
          <ul className={style.subMenu}>
            <div>
              <li className={location.pathname === '/AllProduction' ? style.activeLink : ''}>
                <Link to="/AllProduction">All Production</Link>
              </li>
              <li className={location.pathname === '/DemandMaterial' ? style.activeLink : ''}>
                <Link to="/DemandMaterial">Demand Material</Link>
              </li>
              <li className={location.pathname === '/ProductionProcess' ? style.activeLink : ''}>
                <Link to="/ProductionProcess">Process</Link>
              </li>
              <li className={location.pathname === '/addMachines' ? style.activeLink : ''}>
                <Link to="/addMachines">Add Machines</Link>
              </li>
            </div>
          </ul>
        </li>

        <li className={location.pathname === '/Finance' ? style.activeLink : ''}>
          <span onClick={toggleSubMenu} className={style.dropdown}>
            <i className="bi bi-cash"></i>
            <span>Finance</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#1E124A"
            >
              <path d="m480-538.85-189 189L253.85-387 480-613.15 706.15-387 669-349.85l-189-189Z" />
            </svg>
          </span>
          <ul className={style.subMenu}>
            <div>
              <li className={location.pathname === '/Finanace' ? style.activeLink : ''}>
                <Link to="/Finance">Finance</Link>
              </li>
              <li className={location.pathname === '/Recivable' ? style.activeLink : ''}>
                <Link to="/Recivable">Recivable</Link>
              </li>
              <li className={location.pathname === '/Payables' ? style.activeLink : ''}>
                <Link to="/Payables">Payables</Link>
              </li>
              <li className={location.pathname === '/CompanyLegder' ? style.activeLink : ''}>
                <Link to="/CompanyLegder">CompanyLegder</Link>
              </li>
            </div>
          </ul>
        </li>

        <li className={location.pathname === '/Dispach' ? style.activeLink : ''}>
          <Link to="/Dispach">
            <i className="bi bi-truck"></i>
            <span>Dispach</span>
          </Link>
        </li>
        <li className={location.pathname === '/MasterDash' ? style.activeLink : ''}>
          <Link to="/MasterDash">
            <i className="bi bi-folder"></i>
            <span>Masters</span>
          </Link>
        </li>
        <li>
          <span onClick={toggleSubMenu} className={style.dropdown}>
            <i className="bi bi-file-person"></i>
            <span>Hr</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#1E124A"
            >
              <path d="m480-538.85-189 189L253.85-387 480-613.15 706.15-387 669-349.85l-189-189Z" />
            </svg>
          </span>
          <ul className={style.subMenu}>
            <div>
              <li className={location.pathname === '/HrDashboard' ? style.activeLink : ''}>
                <Link to="/HrDashboard">Hr Dashboard</Link>
              </li>
              <li className={location.pathname === './hrLeave' ? style.activeLink : ''}>
                <Link to="./hrLeave">Leave</Link>
              </li>
              <li className={location.pathname === '/attendance' ? style.activeLink : ''}>
                <Link to="./attendance">Attendence</Link>
              </li>
              <li className={location.pathname === '/Payroll' ? style.activeLink : ''}>
                <Link to="./Payroll">Payroll</Link>
              </li>
            </div>
          </ul>
        </li>
        <hr />
        <li>
          <span onClick={handleSignOut} className={`${style.signOutButton}`}>
            <i className="bi bi-box-arrow-left"></i>
            <Link>Sign Out</Link>
          </span>
        </li>

      </ul>
    </div >
  );
};

export default Sidebar;
