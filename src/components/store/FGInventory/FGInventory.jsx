import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, fireDB } from '../../firebase/FirebaseConfig';
import style from './fginventory.module.css';

const FGInventory = () => {
  const [inventoryData, setInventoryData] = useState([]);

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
          quantity: doc.data().quantity,
          status: doc.data().dispatchOrInventory,
        }));
        setInventoryData(data);
      } catch (error) {
        console.error('Error fetching inventory data: ', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={style.fgInventoryWrapper} >
      <div className={style.title}>
        <i class="ri-bar-chart-line"></i>
        <h4>Finished Goods Inventory</h4>
      </div>
      <hr className='hr' />
      <table className={style.inventoryTable}>
        <thead className={style.inventoryTableHead}>
          <tr>
            <th>Sr. No</th>
            <th>Production Order Id</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className={style.inventoryTableBody}>
          {inventoryData.length > 0 ? (
            inventoryData.map((item) => (
              <tr key={item.id}>
                <td>{item.srNo}</td>
                <td>{item.productionOrderId}</td>
                <td>{item.selectedProductId}</td>
                <td>{item.quantity}</td>
                <td>{item.status}</td>
              </tr>
            ))
          ) : (
            <tr className={style.error}>
              <td colSpan="6" >No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FGInventory;
