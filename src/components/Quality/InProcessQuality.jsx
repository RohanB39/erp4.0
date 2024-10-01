import React, { useState, useEffect } from 'react';
import { fireDB, collection, query, where, getDocs, updateDoc, doc } from '../firebase/FirebaseConfig';
import { serverTimestamp } from 'firebase/firestore';
import './quality.css';
import GreenTickGif from '../../assets/approve.mp4';

function InProcessQuality() {
    const [groupedData, setGroupedData] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState(null);
    const [searchDate, setSearchDate] = useState(''); // State for the search input

    const fetchData = async () => {
        try {
            const q = query(
                collection(fireDB, 'Production_Orders'),
                where('progressStatus', '==', 'Production Completed'),
                where('productionStatus', '==', 'Production Phase 1 complete')
            );

            const querySnapshot = await getDocs(q);
            const dataByDate = {};

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const startDate = data.startDate;
                if (!dataByDate[startDate]) {
                    dataByDate[startDate] = [];
                }
                dataByDate[startDate].push({
                    id: doc.id,
                    productionOrderId: data.productionOrderId,
                    FGID: data.selectedProductId,
                    machineName: data.selectedMachine,
                    plannedQty: data.quantity,
                    productionQty: data.productionQuantity,
                    productionStarted: data.startDate,
                    productionEnded: data.endDate,
                    progressStatus: data.progressStatus,
                });
            });

            setGroupedData(dataByDate);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const handleApprove = async (id, productionOrderId, FGID) => {
        try {
            const docRef = doc(fireDB, 'Production_Orders', id);
            await updateDoc(docRef, { 
                progressStatus: 'In Process Quality Approved',
                InProcessQualityApprovalDate: serverTimestamp(),
            });
            setPopupData({ productionOrderId, FGID });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 5000);

            fetchData();
        } catch (error) {
            console.error('Error approving order:', error);
        }
    };

    const handleHold = async (id) => {
        try {
            const docRef = doc(fireDB, 'Production_Orders', id);
            await updateDoc(docRef, { progressStatus: 'In Process Quality Hold' });
            fetchData();
        } catch (error) {
            console.error('Error holding order:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = Object.keys(groupedData).filter(date => {
        return date.includes(searchDate);
    });

    return (
        <div className='qualityTable'>
            <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                placeholder="Search by Date"
                style={{ marginBottom: '20px', padding: '10px', width: '100%' }} // Style for the input
            />
            <div className='tab-content'>
                {filteredData.map((startDate) => (
                    <div key={startDate}>
                        <h3 style={{ textAlign: 'left' }}>Date: {startDate}</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                            <thead>
                                <tr>
                                    <th>Production Order ID</th>
                                    <th>FG ID</th>
                                    <th>Machine Name</th>
                                    <th>Planned QTY</th>
                                    <th>Production QTY</th>
                                    <th>Production Started</th>
                                    <th>Production Ended</th>
                                    <th>Progress Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedData[startDate].map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.productionOrderId}</td>
                                        <td>{row.FGID}</td>
                                        <td>{row.machineName}</td>
                                        <td>{row.plannedQty}</td>
                                        <td>{row.productionQty}</td>
                                        <td>{row.productionStarted}</td>
                                        <td>{row.productionEnded}</td>
                                        <td>{row.progressStatus}</td>
                                        <td>
                                            <button
                                                onClick={() => handleApprove(row.id, row.productionOrderId, row.FGID)}
                                                className="approve-btn"
                                                style={{ marginRight: '10px' }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleHold(row.id)}
                                                className="hold-btn"
                                            >
                                                Hold
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {/* Popup Modal */}
            {showPopup && popupData && (
                <div className="popup-overlay">
                    <div className="popup-content animate__animated animate__fadeIn">
                        <video src={GreenTickGif} alt="Approved" className="green-tick-gif" autoPlay />
                        <h3>Approved</h3>
                        <p>Production Order ID: {popupData.productionOrderId}</p>
                        <p>FG ID: {popupData.FGID}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InProcessQuality;
