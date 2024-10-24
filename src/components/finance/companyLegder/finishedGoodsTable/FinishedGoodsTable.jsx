import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, fireDB } from '../../../firebase/FirebaseConfig';

const FinishedGoodsTable = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

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
        setTotalItemsCount(querySnapshot.size);
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
      <div style={{
        display: 'flex',
      }}>
        <div style={{
          padding: '20px',
          margin: '20px 0px',
          marginRight: '10px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          width: '30%',
        }}>
          Total Finished Goods : {totalItemsCount}
        </div>
      </div>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Production Order Id</th>
            <th>Product ID</th>
            <th>Quantity</th>
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
