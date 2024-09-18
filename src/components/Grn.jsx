import React, { useState, useEffect, useRef } from 'react';
import { fireDB } from "./FirebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import './grn.css';

const Grn = () => {
  const [grnNumber, setGrnNumber] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [materialId, setMaterialId] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [quantityReceived, setQuantityReceived] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [discrepancies, setDiscrepancies] = useState('');
  const [status, setStatus] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const generateGrnNumber = () => {
      const date = new Date();
      const formattedDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      setGrnNumber(`${formattedDate}-${randomDigits}`);
    };
    generateGrnNumber();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, "Vendors"));
        const vendorList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setVendors(vendorList);
      } catch (error) {
        console.error("Error fetching vendors: ", error);
      }
    };
    fetchVendors();
  }, []);

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
              materialLocation: doc.data().materialLocation
            }));
          setItems(itemList);
        } catch (error) {
          console.error("Error fetching items: ", error);
        }
      };
      fetchItems();
    }
  }, [vendorId]);

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
    setVendorId(vendor.id);
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
      inspectionDate,          
      inspectionNotes,        
      discrepancies,          
      status: status === 'Approved' ? 'GRN Approved, QC Pending' : status 
    };

    try {
      const materialDocRef = doc(fireDB, "Items", materialId);

      await updateDoc(materialDocRef, updatedMaterial);

      alert("Material updated successfully")
    } catch (error) {
      alert("Error updating material: ", error);
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

  return (
    <div className='grn-page'>
      <h1>GRN Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='grnNumber'>GRN Number:</label>
          <input
            type='text'
            id='grnNumber'
            value={grnNumber}
            readOnly
          />
        </div>

        <div className="custom-dropdown" ref={dropdownRef}>
          <label htmlFor='vendorId'>Vendor:</label>
          <input
            type='text'
            placeholder='Select Vendor'
            value={searchTerm}
            onChange={handleInputChange}
            onClick={() => setIsDropdownOpen(searchTerm.length > 0)}
          />
          {isDropdownOpen && filteredVendors.length > 0 && (
            <div className="dropdown-options">
              {filteredVendors.map(vendor => (
                <div
                  key={vendor.id}
                  className="dropdown-option"
                  onClick={() => handleVendorSelect(vendor)}
                >
                  {vendor.name}
                </div>
              ))}
            </div>
          )}
          {isDropdownOpen && filteredVendors.length === 0 && (
            <div className="dropdown-option">No vendors found</div>
          )}
        </div>

        <div>
          <label htmlFor='vendorName'>Vendor Name:</label>
          <input
            type='text'
            id='vendorName'
            value={vendorName}
            readOnly
          />
        </div>

        <div>
          <label htmlFor='vendorName'>Purchase Order</label>
          <input
            type='text'
            id='vendorName'
            value={vendorName}
            readOnly
          />
        </div>

        <div>
          <label htmlFor='vendorName'>Invoice Number</label>
          <input
            type='text'
            id='vendorName'
            value={vendorName} // User Enter invoice number manually
            readOnly
          />
        </div>

        <div>
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

        <div>
          <label htmlFor='materialDescription'>Material Description:</label>
          <input
            type='text'
            id='materialDescription'
            value={materialDescription}
            readOnly
          />
        </div>

        <div>
          <label htmlFor='batchNumber'>Batch Number:</label>
          <input
            type='text'
            id='batchNumber'
            value={batchNumber}
            readOnly
          />
        </div>

        <div>
          <label htmlFor='quantityReceived'>Quantity Received:</label>
          <input
            type='text'
            id='quantityReceived'
            value={quantityReceived}
            onChange={(e) => setQuantityReceived(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor='inspectionDate'>GRN Date:</label>
          <input
            type='date'
            id='inspectionDate'
            value={inspectionDate}
            onChange={(e) => setInspectionDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor='status'>Status:</label>
          <select
            id='status'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value=''>Select Status</option>
            <option value='Approved'>INWARD</option>
            <option value='Rejected'>HOLD</option>
          </select>
        </div>

        <button type='submit'>Submit GRN</button>
      </form>
    </div>
  );
};

export default Grn;
