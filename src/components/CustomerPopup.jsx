import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import "./CustomerPopup.css";
import { fireDB } from './FirebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

const CustomerPopup = ({ onClose }) => {
  const auth = getAuth();

  const authenticateUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, "user@example.com", "your-password");
      console.log("User signed in");
    } catch (error) {
      console.error("Error signing in:", error.code, error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        authenticateUser();
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const [name, setName] = useState("");
  const [uniqueID, setUniqueID] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fax, setFax] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sameAddress, setSameAddress] = useState(false);
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingDistrict, setShippingDistrict] = useState("");
  const [shippingTaluka, setShippingTaluka] = useState("");
  const [shippingPincode, setShippingPincode] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingDistrict, setBillingDistrict] = useState("");
  const [billingTaluka, setBillingTaluka] = useState("");
  const [billingPincode, setBillingPincode] = useState("");
  const [billingPhoneNumber, setBillingPhoneNumber] = useState("");
  const [billingFax, setBillingFax] = useState("");

  const [shippingStates, setShippingStates] = useState([]);
  const [shippingCities, setShippingCities] = useState([]);
  const [billingStates, setBillingStates] = useState([]);
  const [billingCities, setBillingCities] = useState([]);

  const countryData = Country.getAllCountries();

  useEffect(() => {
    const generateUniqueID = (name) => {
      const initials = name.split(' ').map(word => word.charAt(0).toLowerCase()).join('');
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      return `${initials}.cust@${randomDigits}`;
    };

    setUniqueID(generateUniqueID(name));
  }, [name]);

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

  useEffect(() => {
    if (billingCountry) {
      setBillingStates(State.getStatesOfCountry(billingCountry));
    } else {
      setBillingStates([]);
    }
  }, [billingCountry]);

  useEffect(() => {
    if (billingState) {
      setBillingCities(City.getCitiesOfState(billingCountry, billingState));
    } else {
      setBillingCities([]);
    }
  }, [billingState, billingCountry]);

  useEffect(() => {
    if (sameAddress) {
      setBillingAddress(shippingAddress);
      setBillingCountry(shippingCountry);
      setBillingState(shippingState);
      setBillingDistrict(shippingDistrict);
      setBillingTaluka(shippingTaluka);
      setBillingPincode(shippingPincode);
      setBillingPhoneNumber(phoneNumber);
      setBillingFax(fax);
    }
  }, [sameAddress, shippingAddress, shippingCountry, shippingState, shippingDistrict, shippingTaluka, shippingPincode, phoneNumber, fax]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const customer = {
      name,
      uniqueID,
      shippingAddress: {
        address: shippingAddress,
        country: shippingCountry,
        state: shippingState,
        district: shippingDistrict,
        taluka: shippingTaluka,
        pincode: shippingPincode,
      },
      billingAddress: sameAddress
        ? {
            address: shippingAddress,
            country: shippingCountry,
            state: shippingState,
            district: shippingDistrict,
            taluka: shippingTaluka,
            pincode: shippingPincode,
          }
        : {
            address: billingAddress,
            country: billingCountry,
            state: billingState,
            district: billingDistrict,
            taluka: billingTaluka,
            pincode: billingPincode,
          },
      phoneNumber,
      billingPhoneNumber: sameAddress ? phoneNumber : billingPhoneNumber,
      fax,
      billingFax: sameAddress ? fax : billingFax,
    };

    try {
      await setDoc(doc(fireDB, 'customers', uniqueID), customer);
      setSuccessMessage("Customer created successfully");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding customer. Please try again.");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="form-head">
          <h2>Create Customer</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="customer-id">Customer ID: {uniqueID}</div>
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={sameAddress}
                onChange={(e) => setSameAddress(e.target.checked)}
              />
              <label>Same as Shipping Address</label>
            </div>
          </div>
          <div className="form-column">
            <h3 className="form-title">Shipping Address</h3>
            <textarea
              className="address-input"
              placeholder="Shipping Address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />
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
            <input
              type="text"
              placeholder="Fax"
              value={fax}
              onChange={(e) => setFax(e.target.value)}
              required
            />
          </div>
          <div className="form-column">
            <h3 className="form-title">Billing Address</h3>
            <textarea
              className="address-input"
              placeholder="Billing Address"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              disabled={sameAddress}
              required
            />
            <select value={billingCountry} onChange={(e) => setBillingCountry(e.target.value)} disabled={sameAddress} required>
              <option value="">Select Billing Country</option>
              {countryData.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            <select value={billingState} onChange={(e) => setBillingState(e.target.value)} disabled={!billingCountry || sameAddress} required>
              <option value="">Select Billing State</option>
              {billingStates.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            <select value={billingDistrict} onChange={(e) => setBillingDistrict(e.target.value)} disabled={!billingState || sameAddress} required>
              <option value="">Select Billing District</option>
              {billingCities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="address-input"
              placeholder="Billing Taluka"
              value={billingTaluka}
              onChange={(e) => setBillingTaluka(e.target.value)}
              disabled={sameAddress}
              required
            />
            <input
              type="text"
              className="address-input"
              placeholder="Billing Pincode"
              value={billingPincode}
              onChange={(e) => setBillingPincode(e.target.value)}
              disabled={sameAddress}
              required
            />
            <input
              type="text"
              placeholder="Billing Phone Number"
              value={billingPhoneNumber}
              onChange={(e) => setBillingPhoneNumber(e.target.value)}
              disabled={sameAddress}
              required
            />
            <input
              type="text"
              placeholder="Billing Fax"
              value={billingFax}
              onChange={(e) => setBillingFax(e.target.value)}
              disabled={sameAddress}
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CustomerPopup;
