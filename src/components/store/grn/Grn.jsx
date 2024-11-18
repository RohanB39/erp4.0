import React, { useState, useEffect, useRef } from 'react';
import { fireDB } from "../../firebase/FirebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import './grn.css';

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
  const [vendorInvoice, setVendorInvoice] = useState('');
  const [GrnInvoicePrice, setGrnInvoicePrice] = useState('');
  const navigate = useNavigate();

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
      GrnInvoicePrice,
      status: status === 'Approved' ? 'GRN Approved, QC Pending' : status,
    };

    try {
      const materialDocRef = doc(fireDB, "Items", materialId);
      await updateDoc(materialDocRef, updatedMaterial);

      alert("Material status updated successfully");
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

  const handleVendorInvoice = (e) => {
    setVendorInvoice(e.target.value);
  };

  const handleGrnInvoicePrice = (e) => {
    setGrnInvoicePrice(e.target.value);
  };

  const handleButtonClick = () => {
    navigate('/existing-material-grn');
  };

  return (
    <div className='main' id='main'>
      <div className='grn-page'>
        <h4>GRN Form</h4>
        <div>
          <button onClick={handleButtonClick}>Existing</button>
        </div>
        <form onSubmit={handleSubmit} className='grnForm'>
          <div className='grnSerch'>
            <div className='grnNum'>
              <label htmlFor='grnNumber'>GRN Number:</label>
              <input
                type='text'
                id='grnNumber'
                value={grnNumber}
                readOnly
              />
            </div>

            <div className="custom-dropdown serchVendor" ref={dropdownRef}>
              <label htmlFor='vendorId'>Search Vendor:</label>
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
          </div>
          <hr />
          <div className="vendorInfo">
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
              <label htmlFor='vendorId'>Vendor ID:</label>
              <input
                type='text'
                id='vendorId'
                value={vendorId}
                readOnly
              />
            </div>

            <div>
              <label htmlFor='vendorInvoice'>Vendor Invoice:</label>
              <input
                type='text'
                id='vendorInvoice'
                value={vendorInvoice}
                onChange={handleVendorInvoice}
              />
            </div>
            <div>
              <label htmlFor='vendorInvoice'>Invoice Price:</label>
              <input
                type='text'
                id='vendorInvoice'
                value={GrnInvoicePrice}
                onChange={handleGrnInvoicePrice}
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
          </div>
          <hr />
          <div className="vendorInfo">
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
              <label htmlFor='GRNDate'>GRN Date:</label>
              <input
                type='date'
                id='GRNDate'
                value={GRNDate}
                onChange={(e) => setGRNDate(e.target.value)}
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
                <option value='Approved'>Inward</option>
                <option value='Hold'>Hold</option>
              </select>
            </div>
          </div>

          <button type='submit' className='grnBtn'>
            Submit GRN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Grn;
