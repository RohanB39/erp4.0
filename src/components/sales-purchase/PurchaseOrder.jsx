import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, fireDB } from '../FirebaseConfig';
import './purchaseOrder.css';
import { Country, State, City } from "country-state-city";

const PurchaseOrder = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyContact, setCompanyContact] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorAddress, setVendorAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingDistrict, setShippingDistrict] = useState("");
  const [shippingTaluka, setShippingTaluka] = useState("");
  const [shippingPincode, setShippingPincode] = useState("");
  const [shippingStates, setShippingStates] = useState([]);
  const [shippingCities, setShippingCities] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fax, setFax] = useState('');
  const [poDate, setPoDate] = useState('');
  const [poId, setPoId] = useState('');
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [error, setError] = useState(null);
  const [materialDetails, setMaterialDetails] = useState({
    materialName: '',
    materialId: ''
  });
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [units, setUnits] = useState(['Nos', 'KG', 'GRAM', 'METER', 'FEET', 'CENTIMETER', 'MILLIMETER', 'LITER', 'OTHER']);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    companyContact: '',
    companyAddress: '',
    selectedVendorId: '',
    vendorAddress: '',
    shippingAddress: '',
    shippingCountry: '',
    shippingState: '',
    shippingDistrict: '',
    shippingTaluka: '',
    shippingPincode: '',
    phoneNumber: '',
    fax: '',
    poDate: '',
    poId: '',
    selectedMaterial: '',
    materialName: '',
    materialId: '',
    quantity: '',
    price: '',
    selectedUnit: ''
  });

  const formatAddress = (data) => {
    const { country, state, district, taluka } = data;
    return `${country}, ${state}, ${district}, ${taluka}`;
  };

  const formatVendorAddress = (addressData) => {
    const { address, taluka, district, state, country, pincode } = addressData;
    return `${address}, ${taluka}, ${district}, ${state}, ${country}, ${pincode}`;
  };

  useEffect(() => {
    // Fetch the logged-in user's company details
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const userDoc = await getDoc(doc(fireDB, 'users', user.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCompanyName(userData.companyName || 'Company name null');
            setCompanyContact(userData.contactNumber || 'Contact number null');
            setCompanyAddress(formatAddress(userData));
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.log('No user is signed in.');
      }
    };

    fetchUserData();

    // Fetch vendors from the "Vendors" collection
    const fetchVendors = async () => {
      try {
        const vendorCollection = collection(fireDB, 'Vendors');
        const vendorSnapshot = await getDocs(vendorCollection);
        const vendorList = vendorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVendors(vendorList);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, []);

  // Fetch countries and states for shipping address
  const countryData = Country.getAllCountries();

  useEffect(() => {
    if (shippingCountry) {
      setShippingStates(State.getStatesOfCountry(shippingCountry));
    } else {
      setShippingStates([]);
    }
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingState) {
      setShippingCities(City.getCitiesOfState(shippingCountry, shippingState));
    } else {
      setShippingCities([]);
    }
  }, [shippingState, shippingCountry]);

  // Handle vendor selection
  const handleVendorChange = (event) => {
    const selectedVendorName = event.target.value;
    const vendor = vendors.find(vendor => vendor.name === selectedVendorName);
    if (vendor) {
      setSelectedVendorId(vendor.id);
      setSelectedVendor(vendor);  // Store the entire vendor object
      if (vendor.shippingAddress) {
        const formattedAddress = formatVendorAddress(vendor.shippingAddress);
        setVendorAddress(formattedAddress);
      } else {
        setVendorAddress('No address found');
      }
    }
  };

  // Generate unique PO ID based on vendor and company name
  useEffect(() => {
    const generateUniquePOID = (vendorName, companyName) => {
      const vendorInitials = vendorName.split(' ').map(word => word.charAt(0).toLowerCase()).join('');
      const companyInitials = companyName.split(' ').map(word => word.charAt(0).toLowerCase()).join('');
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      return `${vendorInitials}${companyInitials}PO@${randomDigits}`;
    };

    if (selectedVendor && companyName) {
      setPoId(generateUniquePOID(selectedVendor.name, companyName));
    }
  }, [selectedVendor, companyName]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const itemsCollection = collection(fireDB, 'Items');
        const itemsSnapshot = await getDocs(itemsCollection);
        const materialsList = itemsSnapshot.docs.map(doc => doc.data().materialName);
        setMaterials(materialsList);
      } catch (error) {
        setError('Error fetching materials');
        console.error('Error fetching materials:', error);
      }
    };

    fetchMaterials();
  }, []);

  const handleMaterialChange = (event) => {
    setSelectedMaterial(event.target.value);
  };

  useEffect(() => {
    if (selectedVendorId) {
      const fetchMaterials = async () => {
        try {
          const itemsCollection = collection(fireDB, 'Items');
          const q = query(itemsCollection, where('vendorId', '==', selectedVendorId));
          const itemsSnapshot = await getDocs(q);
          const materialsList = itemsSnapshot.docs.map(doc => doc.data().materialName);
          setMaterials(materialsList);
        } catch (error) {
          console.error('Error fetching materials:', error);
        }
      };

      fetchMaterials();
    }
  }, [selectedVendorId]);

  useEffect(() => {
    const fetchMaterialDetails = async () => {
      if (selectedMaterial) {
        try {
          const itemsCollection = collection(fireDB, 'Items');
          const q = query(itemsCollection, where('materialName', '==', selectedMaterial));
          const itemsSnapshot = await getDocs(q);

          if (!itemsSnapshot.empty) {
            const materialData = itemsSnapshot.docs[0].data();
            setMaterialDetails({
              materialName: materialData.materialName || '',
              materialId: materialData.materialId || ''
            });
          }
        } catch (error) {
          console.error('Error fetching material details:', error);
        }
      }
    };

    fetchMaterialDetails();
  }, [selectedMaterial]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!poId || poId.trim() === '') {
      throw new Error('PO ID is required and cannot be empty');
    }
    const docRef = doc(fireDB, 'Purchase_Orders', poId);

    try {
      await setDoc(docRef, {
        companyName,
        companyContact,
        companyAddress,
        vendorId: selectedVendorId,
        vendorAddress,
        shippingAddress,
        shippingCountry,
        shippingState,
        shippingDistrict,
        shippingTaluka,
        shippingPincode,
        phoneNumber,
        fax,
        poDate,
        materialName: materialDetails.materialName,
        materialId: materialDetails.materialId,
        quantity,
        price,
        unit: selectedUnit,
        status: 'Not Assigned'
      });

      alert('Purchase order created successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    }
  };



  return (
    <div className='main' id='main'>
      <div className='poPage  purchaseOrder'>
        <h4>Create Purchase Order</h4>
        <form onSubmit={handleSubmit}>
          <div className="companyDetail">


            <div>
              <label>Company Name:</label>
              <input type="text" value={companyName} readOnly />
            </div>
            <div>
              <label>Contact Number:</label>
              <input type="text" value={companyContact} readOnly />
            </div>
            <div>
              <label>Company Address:</label>
              <textarea type="text" value={companyAddress} readOnly />
            </div>
          </div>
          <div className="vendorPurchaseOrder">

            <div className="vendorData">
              <div className='vendorSelect'>
                <label>Select Vendor:</label>
                <select onChange={handleVendorChange}>
                  <option value="">Select a vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.name}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedVendorId && (
                <div >
                  <label>Vendor ID:</label>
                  <input type="text" value={selectedVendorId} readOnly />
                </div>
              )}
            </div>

            {vendorAddress && (
              <div className='vendorAddress'>
                <label>Vendor Address:</label>
                <textarea type="text" value={vendorAddress} readOnly />
              </div>
            )}
          </div>

          {/* Shipping Address */}
          <div className="form-column">
            <h4 className="form-title">Shipping Address</h4>
            <textarea
              className="address-input"
              placeholder="Shipping Address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />
            <div className="shippingForm">
              <select value={shippingCountry} onChange={(e) => setShippingCountry(e.target.value)} required>
                <option value="">Select Shipping Country</option>
                {countryData.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
              <select value={shippingState} onChange={(e) => setShippingState(e.target.value)} disabled={!shippingCountry} required>
                <option value="">Select Shipping State</option>
                {shippingStates.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
              <select value={shippingDistrict} onChange={(e) => setShippingDistrict(e.target.value)} disabled={!shippingState} required>
                <option value="">Select Shipping District</option>
                {shippingCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="shippingForm">
              <input
                type="text"
                className="address-input"
                placeholder="Shipping Taluka"
                value={shippingTaluka}
                onChange={(e) => setShippingTaluka(e.target.value)}
                required
              />
              <input
                type="text"
                className="address-input"
                placeholder="Shipping Pincode"
                value={shippingPincode}
                onChange={(e) => setShippingPincode(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="shippingForm">

              <input
                type="text"
                placeholder="Fax"
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                required
              />


              <div>
                <label>PO Date:</label>
                <input
                  type="date"
                  value={poDate}
                  onChange={(e) => setPoDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>PO ID:</label>
                <input type="text" value={poId} readOnly />
              </div>
            </div>
            <div className="shippingForm">

              <div>
                <label>Select Material:</label>
                <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
                  <option value="">Select a material</option>
                  {materials.map((material, index) => (
                    <option key={index} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Material Name:</label>
                <input type="text" value={materialDetails.materialName} readOnly />
              </div>
              <div>
                <label>Material Id:</label>
                <input type="text" value={materialDetails.materialId} readOnly />
              </div>
            </div>
            {selectedMaterial && (
              <>
                <div>
                  <label>Quantity:</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                  <select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                    <option value="">Select Unit</option>
                    {units.map((unit, index) => (
                      <option key={index} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Price:</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <button className='purchaseBtn' type="submit">Create Order</button>
            </div>
          </div>
        </form>
      </div >

    </div >
  );
};

export default PurchaseOrder;
