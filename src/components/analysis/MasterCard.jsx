import React,  { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fireDB } from '../firebase/FirebaseConfig';
import './master-card.css'


function Master() {
    const [counts, setCounts] = useState({
      totalCustomers: 0,
      totalVendors: 0,
      totalItems: 0,
      rawMaterials: 0,
      semiFinishedGoods: 0,
      finishedGoods: 0
    });
  
    useEffect(() => {
      const fetchData = async () => {
        // Fetch total customers count
        const customerSnapshot = await getDocs(collection(fireDB, "customers"));
        const totalCustomers = customerSnapshot.docs.length;
  
        // Fetch total vendors count
        const vendorSnapshot = await getDocs(collection(fireDB, "Vendors"));
        const totalVendors = vendorSnapshot.docs.length;
  
        // Fetch total items count
        const itemSnapshot = await getDocs(collection(fireDB, "Items"));
        const totalItems = itemSnapshot.docs.length;
  
        // Fetch raw materials count
        const rawMaterialQuery = query(
          collection(fireDB, "Items"),
          where("materialType", "==", "Raw Material")
        );
        const rawMaterialSnapshot = await getDocs(rawMaterialQuery);
        const rawMaterials = rawMaterialSnapshot.docs.length;
  
        // Fetch semi-finished goods count
        const semiFinishedQuery = query(
          collection(fireDB, "Items"),
          where("materialType", "==", "Semi Finished Goods")
        );
        const semiFinishedSnapshot = await getDocs(semiFinishedQuery);
        const semiFinishedGoods = semiFinishedSnapshot.docs.length;
  
        // Fetch finished goods count
        const finishedQuery = query(
          collection(fireDB, "Items"),
          where("materialType", "==", "Finished Goods")
        );
        const finishedSnapshot = await getDocs(finishedQuery);
        const finishedGoods = finishedSnapshot.docs.length;
  
        // Set counts in state
        setCounts({
          totalCustomers,
          totalVendors,
          totalItems,
          rawMaterials,
          semiFinishedGoods,
          finishedGoods
        });
      };
  
      fetchData();
    }, []);
  
    return (
      <div id='main' className='main'>
        <section>
          <h4>Analysis</h4>
          <div className="info-cards">
            {/* Total Customers Card */}
            <div className="single-card">
              <div className="card-icon">
                <i className="bi bi-people"></i>
              </div>
              <div className="card-detail">
                <div className="">
                  <div className="card-title">
                    <h3>Total Customers</h3>
                  </div>
                  <div className="card-info">
                    <p>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet.</p>
                    <Link to="/CustomerList"> <p className='listlink'>View List</p></Link>
                  </div>
                </div>
                <div className="numbers">
                  <h2>{counts.totalCustomers}</h2>
                </div>
              </div>
            </div>
  
            {/* Total Vendors Card */}
            <div className="single-card">
              <div className="card-icon">
                <i className="bi bi-people"></i>
              </div>
              <div className="card-detail">
                <div className="">
                  <div className="card-title">
                    <h3>Total Vendors</h3>
                  </div>
                  <div className="card-info">
                    <p>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet.</p>
                    <Link to="/VendorList"> <p className='listlink'>View List</p></Link>
                  </div>
                </div>
                <div className="numbers">
                  <h2>{counts.totalVendors}</h2>
                </div>
              </div>
            </div>
  
            {/* Total Items Card */}
            <div className="single-card">
              <div className="card-icon">
                <i className="bi bi-card-checklist"></i>
              </div>
              <div className="card-detail">
                <div className="">
                  <div className="card-title">
                    <h3>Total Items</h3>
                  </div>
                  <div className="card-info">
                    <p>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet.</p>
                    <Link to="/ItemList"> <p className='listlink'>View List</p></Link>
                  </div>
                </div>
                <div className="numbers">
                  <h2>{counts.totalItems}</h2>
                </div>
              </div>
            </div>
  
            {/* Raw Materials Card */}
            <div className="single-card">
              <div className="card-icon">
                <i className="bi bi-card-checklist"></i>
              </div>
              <div className="card-detail">
                <div className="">
                  <div className="card-title">
                    <h3>Raw Materials</h3>
                  </div>
                  <div className="card-info">
                    <p>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet.</p>
                    <Link to="/RawMaterial"> <p className='listlink'>View List</p></Link>
                  </div>
                </div>
                <div className="numbers">
                  <h2>{counts.rawMaterials}</h2>
                </div>
              </div>
            </div>
  
            {/* Semi-Finished Goods Card */}
            <div className="single-card">
              <div className="card-icon">
                <i className="bi bi-card-checklist"></i>
              </div>
              <div className="card-detail">
                <div className="">
                  <div className="card-title">
                    <h3>Semi Finished Goods</h3>
                  </div>
                  <div className="card-info">
                    <p>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet.</p>
                    <Link to="/SemiFinished"> <p className='listlink'>View List</p></Link>
                  </div>
                </div>
                <div className="numbers">
                  <h2>{counts.semiFinishedGoods}</h2>
                </div>
              </div>
            </div>
  
            {/* Finished Goods Card */}
            <div className="single-card">
              <div className="card-icon">
                <i className="bi bi-card-checklist"></i>
              </div>
              <div className="card-detail">
                <div className="">
                  <div className="card-title">
                    <h3>Finished Goods</h3>
                  </div>
                  <div className="card-info">
                    <p>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet.</p>
                    <Link to="/Finished"> <p className='listlink'>View List</p></Link>
                  </div>
                </div>
                <div className="numbers">
                  <h2>{counts.finishedGoods}</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  
  export default Master;