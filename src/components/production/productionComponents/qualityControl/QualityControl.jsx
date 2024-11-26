import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig';


import style from './qualityControl.module.css'
const QualityControl = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(fireDB, 'Production_Orders'),
          where('progressStatus', '==', 'Final Quality Approved')
        );
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id, // Firebase document ID
          productionOrderId: doc.data().productionOrderId,
          selectedProductId: doc.data().selectedProductId,
          InProcessQualityApprovalDate: doc.data().InProcessQualityApprovalDate,
          FinalQualityApprovalDate: doc.data().FinalQualityApprovalDate
        }));
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return '';
    const dateObj = timestamp.toDate();
    return dateObj.toLocaleDateString();
  };

  return (
    <div className={style.qualityControlContainer}>
      <div className={style.title}>
        <i class="ri-search-eye-line"></i>

        <h4>Quality Control - Final Quality Approved Orders</h4>
      </div>
      <table className={style.qualityControlTable}>
        <thead className={style.qualityControlTableHeader}>
          <tr>
            <th>Sr/No</th>
            <th>Production Order ID</th>
            <th>Product ID</th>
            <th>In Process Quality Approval Date</th>
            <th>Final Quality Approval Date</th>
          </tr>
        </thead>
        <tbody className={style.qualityControlTableBody}>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.productionOrderId}</td>
                <td>{item.selectedProductId}</td>
                <td>{formatDate(item.InProcessQualityApprovalDate)}</td>
                <td>{formatDate(item.FinalQualityApprovalDate)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className={style.errorMsg}>No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QualityControl;
