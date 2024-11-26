import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, fireDB } from '../../../firebase/FirebaseConfig';

import style from './finishedGoods.module.css';


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
    <div className={style.receivableWrapper}>
      <div className={style.Header}>

        <div className={style.title}>
          <h2>Finished Goods</h2>
          <p>   Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas, atque.</p>


        </div>
        <div className={style.credits}>
          <span>{totalItemsCount} </span>

          Total Finished Goods
        </div>
      </div>
      <table className={style.table}>
        <thead className={style.tableHeader}>
          <tr>
            <th>Sr. No</th>
            <th>Production Order Id</th>
            <th>Product ID</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody className={style.tableBody}>
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
    </div >
  );
};

export default FinishedGoodsTable;
