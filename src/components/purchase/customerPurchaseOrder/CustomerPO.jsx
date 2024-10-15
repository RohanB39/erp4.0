import React, { useState, useEffect } from 'react';
import { fireDB, collection, getDocs, query, where, doc, addDoc } from '../../firebase/FirebaseConfig';
import { setDoc } from 'firebase/firestore';

const CustomerPO = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCustomerID, setSelectedCustomerID] = useState('');
  const [purchaseOrderID, setPurchaseOrderID] = useState('');
  const [finishedGoods, setFinishedGoods] = useState([]);
  const [selectedFinishedGood, setSelectedFinishedGood] = useState('');
  const [selectedFinishedGoodUniqueID, setSelectedFinishedGoodUniqueID] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState('');
  const [price, setPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [igst, setIGST] = useState(0);
  const [cgst, setCGST] = useState(0);
  const [sgst, setSGST] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isIGSTChecked, setIsIGSTChecked] = useState(false);
  const [isCGSTChecked, setIsCGSTChecked] = useState(false);

  const fetchCustomers = async () => {
    try {
      const customerCollection = collection(fireDB, 'customers');
      const customerSnapshot = await getDocs(customerCollection);
      const customerList = customerSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        uniqueID: doc.data().uniqueID,
      }));
      setCustomers(customerList);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchFinishedGoods = async (customerUniqueID) => {
    try {
      const finishedGoodsCollection = collection(fireDB, 'Finished_Goods');
      const finishedGoodsQuery = query(finishedGoodsCollection, where('customerID', '==', customerUniqueID));
      const finishedGoodsSnapshot = await getDocs(finishedGoodsQuery);
      const finishedGoodsList = finishedGoodsSnapshot.docs.map(doc => ({
        id: doc.id,
        FGname: doc.data().FGname,
        uniqueID: doc.data().uniqueID,
      }));
      setFinishedGoods(finishedGoodsList);
    } catch (error) {
      console.error('Error fetching finished goods:', error);
    }
  };

  const generatePurchaseOrderID = (customerName) => {
    const initials = customerName.split(' ').map(word => word[0]).join('').toUpperCase();
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `${initials}@CUSPOID${randomNumber}`;
  };

  const handleCustomerChange = (e) => {
    const selectedCustomer = customers.find(cust => cust.name === e.target.value);
    if (selectedCustomer) {
      setSelectedCustomer(selectedCustomer.name);
      setSelectedCustomerID(selectedCustomer.uniqueID);
      const poID = generatePurchaseOrderID(selectedCustomer.name);
      setPurchaseOrderID(poID);
      fetchFinishedGoods(selectedCustomer.uniqueID);
      setSelectedFinishedGood('');
      setSelectedFinishedGoodUniqueID('');
      setQuantity('');
      setOrderType('');
      setPrice('');
      setTotalPrice('');
      setIGST('');
      setCGST('');
      setSGST('');
      setGrandTotal('');
    }
  };

  const handleFinishedGoodChange = (e) => {
    const selectedGood = finishedGoods.find(good => good.FGname === e.target.value);
    if (selectedGood) {
      setSelectedFinishedGood(selectedGood.FGname);
      setSelectedFinishedGoodUniqueID(selectedGood.uniqueID); 
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value);
  };

  const handlePriceChange = (e) => {
    const enteredPrice = e.target.value;
    setPrice(enteredPrice);
    const total = quantity * enteredPrice;
    setTotalPrice(total);
    if (isIGSTChecked) {
      const calculatedIGST = (total * 28) / 100;
      setIGST(calculatedIGST);
      setGrandTotal(total + calculatedIGST);
    } else {
      const calculatedCGST = (total * cgst) / 100;
      const calculatedSGST = (total * sgst) / 100;
      setGrandTotal(total + calculatedCGST + calculatedSGST);
    }
  };

  const handleCGSTChange = (e) => {
    const enteredCGST = e.target.value;
    setCGST(enteredCGST);

    const calculatedCGST = (totalPrice * enteredCGST) / 100;
    const calculatedSGST = (totalPrice * sgst) / 100;
    setGrandTotal(totalPrice + calculatedCGST + calculatedSGST);
  };

  const handleSGSTChange = (e) => {
    const enteredSGST = e.target.value;
    setSGST(enteredSGST);

    const calculatedSGST = (totalPrice * enteredSGST) / 100;
    const calculatedCGST = (totalPrice * cgst) / 100;
    setGrandTotal(totalPrice + calculatedCGST + calculatedSGST);
  };

  const handleIGSTCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsIGSTChecked(checked);

    if (checked) {
      setIsCGSTChecked(false);  // Uncheck CGST/SGST if IGST is selected
      setCGST(0);
      setSGST(0);

      const calculatedIGST = (totalPrice * 28) / 100;
      setIGST(calculatedIGST);
      setGrandTotal(totalPrice + calculatedIGST);
    } else {
      setIGST(0);
      setGrandTotal(totalPrice);
    }
  };

  const handleCGSTCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsCGSTChecked(checked);

    if (checked) {
      setIsIGSTChecked(false);  // Uncheck IGST if CGST/SGST is selected
      setIGST(0);
      const calculatedCGST = (totalPrice * cgst) / 100;
      const calculatedSGST = (totalPrice * sgst) / 100;
      setGrandTotal(totalPrice + calculatedCGST + calculatedSGST);
    } else {
      setGrandTotal(totalPrice);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if purchaseOrderID is already used
    const docRef = doc(fireDB, 'Customer_Purchase_Orders', purchaseOrderID); // Create a document reference with the custom ID

    // Prepare the data to be saved
    const purchaseOrderData = {
      customerID: selectedCustomerID,
      finishedGood: selectedFinishedGood,
      finishedGoodId: selectedFinishedGoodUniqueID,
      quantity: quantity,
      status: orderType,
      price: price,
      totalPrice: totalPrice,
      igst: igst,
      cgst: cgst,
      sgst: sgst,
      grandTotal: grandTotal,
      createdAt: new Date(), // Optional: add a timestamp
    };

    try {
      await setDoc(docRef, purchaseOrderData); // This will set the data at the specified document ID
      alert(`Purchase Order submitted successfully! Document ID: ${purchaseOrderID}`); // Feedback message
      // Clear the form or reset the state if necessary
    } catch (error) {
      console.error('Error saving purchase order:', error); // Log the error
      alert('Error submitting purchase order. Please try again.'); // Error feedback
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="main" id="main">
      <h2>Customer Purchase Order</h2>
      <form onSubmit={handleSubmit}> {/* Handle form submission */}
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="customer">Select Customer:</label></td>
              <td>
                <select id="customer" value={selectedCustomer} onChange={handleCustomerChange}>
                  <option value="" disabled>Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.name}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            {selectedCustomerID && (
              <>
                <tr>
                  <td>Customer Unique ID:</td>
                  <td>{selectedCustomerID}</td>
                </tr>
                <tr>
                  <td>Purchase Order ID:</td>
                  <td>{purchaseOrderID}</td> {/* Display the generated PO ID */}
                </tr>
              </>
            )}

            {finishedGoods.length > 0 && (
              <tr>
                <td><label htmlFor="finishedGood">Select Finished Good:</label></td>
                <td>
                  <select id="finishedGood" value={selectedFinishedGood} onChange={handleFinishedGoodChange}>
                    <option value="" disabled>Select a finished good</option>
                    {finishedGoods.map((good) => (
                      <option key={good.id} value={good.FGname}>
                        {good.FGname}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            )}
            <tr>
              <td>Finished Good ID:</td>
              <td>
                {finishedGoods.find((good) => good.FGname === selectedFinishedGood)?.uniqueID || "N/A"}
              </td>
            </tr>

            {selectedFinishedGood && (
              <tr>
                <td><label htmlFor="quantity">Enter Quantity:</label></td>
                <td>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    placeholder="Enter quantity"
                  />
                </td>
              </tr>
            )}

            {quantity && (
              <tr>
                <td><label htmlFor="orderType">Select Order Type:</label></td>
                <td>
                  <select id="orderType" value={orderType} onChange={handleOrderTypeChange}>
                    <option value="" disabled>Select order type</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </td>
              </tr>
            )}

            {orderType && (
              <tr>
                <td><label htmlFor="price">Enter Price per Unit:</label></td>
                <td>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={handlePriceChange}
                    placeholder="Enter price"
                  />
                </td>
              </tr>
            )}

            {price && (
              <tr>
                <td>Total Price:</td>
                <td>₹{totalPrice}</td>
              </tr>
            )}

            {totalPrice && (
              <tr>
                <td>
                  <input
                    type="checkbox"
                    id="igst-checkbox"
                    checked={isIGSTChecked}
                    onChange={handleIGSTCheckboxChange}
                  />
                  <label htmlFor="igst-checkbox"> IGST (28%):</label>
                </td>
                <td>₹{igst}</td>
              </tr>
            )}

            {totalPrice && (
              <tr>
                <td><label htmlFor="cgst">Enter CGST (%):</label></td>
                <td>
                  <input
                    type="number"
                    id="cgst"
                    value={cgst}
                    onChange={handleCGSTChange}
                    placeholder="Enter CGST"
                    disabled={isIGSTChecked}
                  />
                </td>
              </tr>
            )}

            {totalPrice && (
              <tr>
                <td><label htmlFor="sgst">Enter SGST (%):</label></td>
                <td>
                  <input
                    type="number"
                    id="sgst"
                    value={sgst}
                    onChange={handleSGSTChange}
                    placeholder="Enter SGST"
                    disabled={isIGSTChecked}
                  />
                </td>
              </tr>
            )}

            {totalPrice && (
              <tr>
                <td>Grand Total:</td>
                <td>₹{grandTotal}</td>
              </tr>
            )}

            <tr>
              <td colSpan="2">
                <button type="submit">Submit Purchase Order</button> {/* Button to submit */}
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default CustomerPO;
