import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, fireDB } from '../../../firebase/FirebaseConfig';

const FinishedGoodsTable = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productionOrdersRef = collection(fireDB, 'Production_Orders');
        const q = query(
          productionOrdersRef, 
          where('productionStatus', '==', 'Packaging done, added to inventory'),
          where('dispatchOrInventory', '==', 'Inventory')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          srNo: index + 1,
          productionOrderId: doc.data().productionOrderId,
          selectedProductId: doc.data().selectedProductId,
          quantity: doc.data().FGQuantity,
          status: doc.data().dispatchOrInventory,
          ml: doc.data().materialLocation,
        }));
        setInventoryData(data);
      } catch (error) {
        setError('Error fetching inventory data');
        console.error('Error fetching inventory data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className='main'>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Production Order Id</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td colSpan="6">{error}</td>
            </tr>
          ) : inventoryData.length > 0 ? (
            inventoryData.map((item) => (
              <tr key={item.id}>
                <td>{item.srNo}</td>
                <td>{item.productionOrderId}</td>
                <td>{item.selectedProductId}</td>
                <td>{item.quantity}</td>
                <td>{item.ml}</td>
                <td>{item.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FinishedGoodsTable;
