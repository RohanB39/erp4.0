import React, { useState, useEffect } from 'react';
import { fireDB, collection, getDocs, query, where, doc, addDoc } from '../../firebase/FirebaseConfig';
import { setDoc } from 'firebase/firestore';



import style from './customerPO.module.css';



const CustomerPO = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCustomerID, setSelectedCustomerID] = useState('');
  const [purchaseOrderID, setPurchaseOrderID] = useState(''); // State for PO ID
  const [finishedGoods, setFinishedGoods] = useState([]);
  const [selectedFinishedGood, setSelectedFinishedGood] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState('');
  const [price, setPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [igst, setIGST] = useState('');
  const [cgst, setCGST] = useState('');
  const [sgst, setSGST] = useState('');
  const [grandTotal, setGrandTotal] = useState('');

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
      }));
      setFinishedGoods(finishedGoodsList);
    } catch (error) {
      console.error('Error fetching finished goods:', error);
    }
  };

  const generatePurchaseOrderID = (customerName) => {
    // Get initials from the customer's name
    const initials = customerName.split(' ').map(word => word[0]).join('').toUpperCase();

    // Generate a random 4-digit number
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // ensures a 4-digit number

    // Create the Purchase Order ID
    return `${initials}@CUSPOID${randomNumber}`;
  };

  const handleCustomerChange = (e) => {
    const selectedCustomer = customers.find(cust => cust.name === e.target.value);
    if (selectedCustomer) {
      setSelectedCustomer(selectedCustomer.name);
      setSelectedCustomerID(selectedCustomer.uniqueID);

      // Generate Purchase Order ID
      const poID = generatePurchaseOrderID(selectedCustomer.name);
      setPurchaseOrderID(poID);

      fetchFinishedGoods(selectedCustomer.uniqueID);
      setSelectedFinishedGood('');
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
    setSelectedFinishedGood(e.target.value);
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

    const calculatedIGST = (total * 28) / 100;
    setIGST(calculatedIGST);
  };

  const handleCGSTChange = (e) => {
    const enteredCGST = e.target.value;
    setCGST(enteredCGST);

    const calculatedCGST = (totalPrice * enteredCGST) / 100;
    const grandTotal = totalPrice + igst + calculatedCGST + (sgst ? (totalPrice * sgst) / 100 : 0);
    setGrandTotal(grandTotal);
  };

  const handleSGSTChange = (e) => {
    const enteredSGST = e.target.value;
    setSGST(enteredSGST);

    const calculatedSGST = (totalPrice * enteredSGST) / 100;
    const grandTotal = totalPrice + igst + (cgst ? (totalPrice * cgst) / 100 : 0) + calculatedSGST;
    setGrandTotal(grandTotal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if purchaseOrderID is already used
    const docRef = doc(fireDB, 'Customer_Purchase_Orders', purchaseOrderID); // Create a document reference with the custom ID

    // Prepare the data to be saved
    const purchaseOrderData = {
      customerID: selectedCustomerID,
      finishedGood: selectedFinishedGood,
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
    <div className={style.CustomerHeader}>
      <div>
        <i className="bi bi-person"></i>
        <h4>Customer Purchase Order</h4>
      </div>
      <p>Review the details of the customer's purchase order, including item descriptions, quantities, pricing, and terms of delivery. Ensure accuracy before proceeding with fulfillment.</p>
      <hr />

      <form className={style.CustomerForm} onSubmit={handleSubmit}> {/* Handle form submission */}
        <table>
          <tbody>
            <div className={style.formRow}>


              <tr>
                <td><label htmlFor="customer">Select Customer : </label></td>
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
            </div>

            {selectedCustomerID && (
              <div className={style.formData}>
                <tr className={style.Row}>
                  <td>Customer  ID : </td>
                  <td>{selectedCustomerID}</td>
                </tr>
                <tr className={style.formrow}>
                  <td>Purchase Order ID : </td>
                  <td>{purchaseOrderID}</td> {/* Display the generated PO ID */}
                </tr>
              </div>
            )}
            <hr />
            <div className={style.rows}>



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
            </div>
            <div className={style.rows}>
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

            </div>

            <div className={`${style.rows} ${style.amount}`}>
              {price && (
                <tr>
                  <td>Total Price:</td>
                  <td className={style.rs}>₹{totalPrice}</td>
                </tr>
              )}

              {totalPrice && (
                <tr>
                  <td>IGST (28%):</td>
                  <td className={style.rs}>₹{igst}</td>
                </tr>
              )}
            </div>

            <div className={style.rows}>
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
                    />
                  </td>
                </tr>
              )}

            </div>
            <div className={style.totalAmount}>

              {totalPrice && (
                <tr>
                  <td>Grand Total : </td>
                  <td className={style.price}> ₹ {grandTotal}</td>
                </tr>
              )}
            </div>
            <hr />

            <tr className={style.btn}>
              <td colSpan="2">
                <button type="submit">Submit  Order</button> {/* Button to submit */}
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default CustomerPO;
