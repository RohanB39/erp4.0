import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import './packging.css';

const Packging = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({}); // Object to hold selected options

  // Sample packaging types and dispatch options
  const packagingTypes = ['Box', 'Bag', 'Wrap'];
  const dispatchOptions = ['Dispatch', 'Inventory'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(fireDB, 'Production_Orders'),
          where('progressStatus', '==', 'Final Quality Approved')
        );

        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map((doc, index) => ({
          id: index + 1, // Sr. No
          selectedProductId: doc.id, // Use doc.id as unique identifier
          ...doc.data(),
        }));

        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePackagingTypeChange = (productId, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [productId]: {
        ...prevOptions[productId],
        packagingType: value,
      },
    }));
  };

  const handleDispatchOrInventoryChange = (productId, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [productId]: {
        ...prevOptions[productId],
        dispatchOrInventory: value,
      },
    }));
  };

  const handleActionClick = async (productId, product) => {
    const selectedProductId = product.selectedProductId; // Get the selected product ID
    const quantity = product.quantity; // Get the quantity
    const packagingType = selectedOptions[selectedProductId]?.packagingType; // Get the packaging type
    const dispatchOrInventory = selectedOptions[selectedProductId]?.dispatchOrInventory; // Get the dispatch/inventory option

    try {
      // Step 1: Fetch the Finished_Goods document
      const finishedGoodsQuery = query(
        collection(fireDB, 'Finished_Goods'),
        where('uniqueID', '==', selectedProductId)
      );

      const finishedGoodsSnapshot = await getDocs(finishedGoodsQuery);
      if (!finishedGoodsSnapshot.empty) {
        const finishedGoodsDoc = finishedGoodsSnapshot.docs[0];

        // Step 2: Update FGQuantity in Finished_Goods
        await updateDoc(doc(fireDB, 'Finished_Goods', finishedGoodsDoc.id), {
          FGQuantity: quantity,
          status: 'Avialable',
        });
        alert(`Updated Finished_Goods document: ${finishedGoodsDoc.id}`);
      } else {
        console.error('No matching Finished_Goods found for uniqueID:', selectedProductId);
        return; // Exit if no match found
      }

      // Step 3: Fetch the Production_Orders document
      const productionOrdersQuery = query(
        collection(fireDB, 'Production_Orders'),
        where('productionOrderId', '==', product.productionOrderId)
      );

      const productionOrdersSnapshot = await getDocs(productionOrdersQuery);
      if (!productionOrdersSnapshot.empty) {
        // Assuming there's only one match
        const productionOrderDoc = productionOrdersSnapshot.docs[0];

        // Step 4: Update Production_Orders with packaging type and status
        await updateDoc(doc(fireDB, 'Production_Orders', productionOrderDoc.id), {
          packagingType: packagingType,
          dispatchOrInventory: dispatchOrInventory,
          productionStatus: 'Packaging done, added to inventory',
          progressStatus: 'Production, Assembly, Packaging done, added to inventory',
        });
        alert(`Updated Production_Orders document: ${productionOrderDoc.id}`);
      } else {
        console.error('No matching Production_Orders found for productionOrderId:', product.productionOrderId);
      }
    } catch (error) {
      console.error('Error updating documents:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div id='main'>
      <h1>Packaging</h1>
      <table>
        <thead>
          <tr>
            <th>Sr/No</th>
            <th>Production Order ID</th>
            <th>Selected Product ID</th>
            <th>Selected Machine</th>
            <th>Quantity</th>
            <th>Packaging Type</th>
            <th>Dispatch/Inventory</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.selectedProductId}>
              <td>{product.id}</td>
              <td>{product.productionOrderId}</td>
              <td>{product.selectedProductId}</td>
              <td>{product.selectedMachine}</td>
              <td>{product.quantity}</td>
              <td>
                <select
                  value={selectedOptions[product.selectedProductId]?.packagingType || ''}
                  onChange={(e) => handlePackagingTypeChange(product.selectedProductId, e.target.value)}
                >
                  <option value="">Select Packaging Type</option>
                  {packagingTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={selectedOptions[product.selectedProductId]?.dispatchOrInventory || ''}
                  onChange={(e) => handleDispatchOrInventoryChange(product.selectedProductId, e.target.value)}
                >
                  <option value="">Select Option</option>
                  {dispatchOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => handleActionClick(product.selectedProductId, product)}>Send</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Packging;
