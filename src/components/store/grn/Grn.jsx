import React, { useState, useEffect, useRef } from 'react';
import { fireDB } from "../../firebase/FirebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

import style from './grn.module.css'

const Grn = () => {
  const [grnNumber, setGrnNumber] = useState('');
  const [vendorId, setVendorId] = useState(''); // For uniqueID
  const [vendorName, setVendorName] = useState('');
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [materialId, setMaterialId] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [quantityReceived, setQuantityReceived] = useState('');
  const [GRNDate, setGRNDate] = useState('');
  const [status, setStatus] = useState('');
  const [items, setItems] = useState([]);
  const [purchaseOrderId, setPurchaseOrderId] = useState('');
  const [vendorInvoice, setVendorInvoice] = useState('');

  // Generate GRN number when the component mounts
  useEffect(() => {
    const generateGrnNumber = () => {
      const date = new Date();
      const formattedDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      setGrnNumber(`${formattedDate}-${randomDigits}`);
    };
    generateGrnNumber();
  }, []);

  // Fetch vendors from Firestore
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, "Vendors"));
        const vendorList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          uniqueID: doc.data().uniqueID,  // Fetch the uniqueID from Firestore
        }));
        setVendors(vendorList);
      } catch (error) {
        console.error("Error fetching vendors: ", error);
      }
    };
    fetchVendors();
  }, []);

  // Fetch items based on vendorId
  useEffect(() => {
    if (vendorId) {
      const fetchItems = async () => {
        try {
          const querySnapshot = await getDocs(collection(fireDB, "Items"));
          const itemList = querySnapshot.docs
            .filter(doc => doc.data().vendorId === vendorId && doc.data().status === "QC Pending")
            .map(doc => ({
              id: doc.id,
              specifications: doc.data().specifications,
              batchNumber: doc.data().batchNumber,
              materialLocation: doc.data().materialLocation,
            }));
          setItems(itemList);
        } catch (error) {
          console.error("Error fetching items: ", error);
        }
      };
      fetchItems();
    }
  }, [vendorId]);

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(value.length > 0);
  };

  const handleVendorSelect = (vendor) => {
    setVendorName(vendor.name);
    setVendorId(vendor.uniqueID); // Set the uniqueID as vendorId
    setSearchTerm(vendor.name);
    setIsDropdownOpen(false);
  };

  const handleItemSelect = (item) => {
    setMaterialDescription(item.specifications);
    setBatchNumber(item.batchNumber);
    setMaterialId(item.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedMaterial = {
      grnNumber,
      quantityReceived,
      GRNDate,
      vendorInvoice,
      status: status === 'Approved' ? 'GRN Approved, QC Pending' : status,
    };

    try {
      const materialDocRef = doc(fireDB, "Items", materialId);
      await updateDoc(materialDocRef, updatedMaterial);

      if (purchaseOrderId) {
        const purchaseOrderDocRef = doc(fireDB, "Purchase_Orders", purchaseOrderId);
        await updateDoc(purchaseOrderDocRef, { status: "Assigned" });
      }

      alert("Material and Purchase Order status updated successfully");
    } catch (error) {
      alert("Error updating material or purchase order: ", error);
    }
  };

  const dropdownRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch purchase order based on vendorId and materialId
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, "Purchase_Orders"));
        const purchaseOrders = querySnapshot.docs
          .filter(doc =>
            doc.data().materialId === materialId &&
            doc.data().vendorId === vendorId &&
            doc.data().status === "Not Assigned"
          )
          .map(doc => doc.id);

        if (purchaseOrders.length > 0) {
          setPurchaseOrderId(purchaseOrders[0]);
        } else {
          setPurchaseOrderId("PO Not Created");
        }
      } catch (error) {
        console.error("Error fetching purchase orders: ", error);
      }
    };

    if (materialId && vendorId) {
      fetchPurchaseOrder();
    }
  }, [materialId, vendorId]);

  const handleVendorInvoice = (e) => {
    setVendorInvoice(e.target.value);
  };

  return (
    <div className={style.grnWrapper}>
      <div className={style.dot}>

      </div>
      <div className={style.grnPage}>
        <div>
          <div className={style.title}>
            <i class="ri-clipboard-line"></i>
            <h4>GRN Form</h4>
          </div>
          <p>Record the details of received goods, including quantity, condition, and supplier information. The GRN form ensures accurate tracking of inventory and validates incoming materials against purchase orders.</p>
        </div>
        <hr className='hr' />

        <form onSubmit={handleSubmit} className={style.grnForm}>
          <div className={style.grnSearch}>
            <div className={style.grnNum}>
              <label htmlFor='grnNumber' className={style.label}>GRN Number:</label>
              <input
                type='text'
                id='grnNumber'
                value={grnNumber}
                readOnly
              />
            </div>

            <div className={`${style.customDropdown}${style.searchVendor}`} ref={dropdownRef}>
              <label htmlFor='vendorId' className={style.label}>Search Vendor:</label>
              <input
                type='text'
                className={style.vendorSearch}
                placeholder='Select Vendor'
                value={searchTerm}
                onChange={handleInputChange}
                onClick={() => setIsDropdownOpen(searchTerm.length > 0)}
              />
              {isDropdownOpen && filteredVendors.length > 0 && (
                <div className={style.dropdownOption}>
                  {filteredVendors.map(vendor => (
                    <div
                      key={vendor.id}
                      className={style.dropdownOption}
                      onClick={() => handleVendorSelect(vendor)}
                    >
                      {vendor.name}
                    </div>
                  ))}
                </div>
              )}
              {isDropdownOpen && filteredVendors.length === 0 && (
                <div className={style.dropdownOption}>No vendors found</div>
              )}
            </div>
          </div>
          <hr className='hr' />
          <div className={style.vendorInfo}>
            <div>

              <div className={style.subDiv}>
                <label htmlFor='vendorName'>Vendor Name:</label>
                <input
                  type='text'
                  id='vendorName'
                  value={vendorName}
                  readOnly
                />
              </div>

              <div className={style.subDiv}>
                <label htmlFor='vendorId'>Vendor ID:</label>
                <input
                  type='text'
                  id='vendorId'
                  value={vendorId}
                  readOnly
                />
              </div>
            </div>
            <div>

              <div className={style.subDiv}>
                <label htmlFor='vendorInvoice'>Vendor Invoice:</label>
                <input
                  type='text'
                  id='vendorInvoice'
                  value={vendorInvoice}
                  onChange={handleVendorInvoice}
                />
              </div>

              <div className={style.subDiv}>
                <label htmlFor='materialId'>Material:</label>
                <select
                  id='materialId'
                  value={materialId}
                  onChange={(e) => handleItemSelect(
                    items.find(item => item.id === e.target.value)
                  )}
                  required
                >
                  <option value=''>Select Material</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>{item.id}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>

              <div className={style.subDiv}>
                <label htmlFor='materialDescription'>Material Description:</label>
                <input
                  type='text'
                  id='materialDescription'
                  value={materialDescription}
                  readOnly
                />
              </div>

              <div className={style.subDiv}>
                <label htmlFor='batchNumber'>Batch Number:</label>
                <input
                  type='text'
                  id='batchNumber'
                  value={batchNumber}
                  readOnly
                />
              </div>
            </div>


          </div>
          <hr className='hr' />
          <div className={style.vendorInfo}>
            <div className={style.subDiv}>
              <label htmlFor='quantityReceived'>Quantity Received:</label>
              <input
                type='text'
                id='quantityReceived'
                value={quantityReceived}
                onChange={(e) => setQuantityReceived(e.target.value)}
                required
              />
            </div>

            <div className={style.subDiv}>
              <label htmlFor='GRNDate'>GRN Date:</label>
              <input
                type='date'
                id='GRNDate'
                value={GRNDate}
                onChange={(e) => setGRNDate(e.target.value)}
                required
              />
            </div>

            <div className={style.subDiv}>
              <label htmlFor='status'>Status:</label>
              <select
                id='status'
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value=''>Select Status</option>
                <option value='Approved'>Inward</option>
                <option value='Hold'>Hold</option>
              </select>
            </div>
          </div>
          <hr className='hr' />

          <button type='submit' className={style.grnBtn}>
            Submit GRN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Grn;
