import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore'; // Import Timestamp here
import { fireDB } from '../../../firebase/FirebaseConfig';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


import style from './reporting.module.css'

const Reporting = () => {
    const [data, setData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [showDownloadPopup, setShowDownloadPopup] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(
                    collection(fireDB, 'Production_Orders'),
                    where('progressStatus', '==', 'Final Quality Approved')
                );
                const querySnapshot = await getDocs(q);
                const fetchedData = querySnapshot.docs.map((doc, index) => ({
                    id: index + 1,
                    productionOrderId: doc.data().productionOrderId,
                    selectedProductId: doc.data().selectedProductId,
                }));
                setData(fetchedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const filteredData = data.filter(item =>
        item.productionOrderId.toLowerCase().includes(searchInput.toLowerCase())
    );

    const handleDownload = async (type, productionOrderId) => {
        setSelectedProductId(productionOrderId); // Set the selected product ID
        if (type === 'excel') {
            await downloadExcel();
        } else if (type === 'pdf') {
            await downloadPDF(productionOrderId); // Pass the productId to the PDF download function
        }
        setShowDownloadPopup(false);
    };

    const downloadExcel = async () => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(data, 'report.xlsx');
        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
    };

    const downloadPDF = async (productionOrderId) => {
        const dock = new jsPDF();

        if (productionOrderId) {
            // Fetching the document using productionOrderId
            const productionOrderDocRef = doc(fireDB, 'Production_Orders', productionOrderId);

            try {
                const productionOrderDoc = await getDoc(productionOrderDocRef);

                if (productionOrderDoc.exists()) {
                    const productionData = productionOrderDoc.data();
                    const productionDetails = {
                        productionOrderId: productionData.productionOrderId,
                        selectedProductId: productionData.selectedProductId,
                        selectedMachine: productionData.selectedMachine,
                        quantity: productionData.quantity,
                        productionQuantity: productionData.productionQuantity,
                        assembledQuantity: productionData.assembledQuantity,
                        completionWarehouse: productionData.completionWarehouse,
                        startDate: productionData.startDate,
                        endDate: productionData.endDate,
                        assemblyStartTimestamp: productionData.assemblyStartTimestamp instanceof Timestamp ? productionData.assemblyStartTimestamp.toDate().toLocaleDateString() : '',
                        assemblyCompleteTime: productionData.assemblyCompleteTime instanceof Timestamp ? productionData.assemblyCompleteTime.toDate().toLocaleDateString() : '',
                        inProcessQualityApprovalDate: productionData.InProcessQualityApprovalDate instanceof Timestamp ? productionData.InProcessQualityApprovalDate.toDate().toLocaleDateString() : '',
                        finalQualityApprovalDate: productionData.FinalQualityApprovalDate instanceof Timestamp ? productionData.FinalQualityApprovalDate.toDate().toLocaleDateString() : '',
                        requiredMaterials: productionData.requiredMaterials || [],
                        assemblyWorkers: productionData.assemblyWorkers || []
                    };

                    let yOffset = 10;
                    dock.setFontSize(14);
                    dock.text('Production Order Report', 14, yOffset);
                    yOffset += 10;
                    dock.setFontSize(12);
                    dock.text('Generated on: ' + new Date().toLocaleDateString(), 14, yOffset);
                    yOffset += 10;

                    // Adding a line separator
                    dock.line(14, yOffset, 196, yOffset);
                    yOffset += 5;

                    // Adding the production and assembly overview
                    dock.setFontSize(12);
                    const overviewText = `
          This report pertains to Production Order ID: ${productionDetails.productionOrderId} for the finished goods ${productionDetails.selectedProductId}. The production commenced on ${productionDetails.startDate}, with an expected completion date of ${productionDetails.endDate}. The machine utilized for this production is ${productionDetails.selectedMachine}. The planned quantity for this production is ${productionDetails.quantity}, while the produced quantity stands at ${productionDetails.productionQuantity}, and the assembled quantity is ${productionDetails.assembledQuantity}. Assembly for this finished goods order started on ${productionDetails.assemblyStartTimestamp} and was completed on ${productionDetails.assemblyCompleteTime}. Following the production process, quality approval was completed on ${productionDetails.inProcessQualityApprovalDate}, and final quality approval was obtained on ${productionDetails.finalQualityApprovalDate}. The completion warehouse for this production is ${productionDetails.completionWarehouse}. The required raw materials for this production include ${productionDetails.requiredMaterials.map(item => item.id).join(', ')}, and the assembly workers involved are ${productionDetails.assemblyWorkers.join(', ')}.`;

                    // Splitting the overview text into multiple lines
                    const lines = dock.splitTextToSize(overviewText, 180);
                    lines.forEach(line => {
                        dock.text(line, 14, yOffset);
                        yOffset += 8; // Space between lines
                    });

                    // Adding a footer
                    yOffset += 10;
                    dock.setFontSize(10);
                    dock.text('This report is generated for internal use only.', 14, yOffset);
                    yOffset += 5;
                    dock.text('Please do not distribute without authorization.', 14, yOffset);

                    // Save the PDF
                    dock.save('Production_Order_Report.pdf');
                } else {
                    console.error('No such production order document!');
                }
            } catch (error) {
                console.error('Error fetching production order details:', error);
            }
        } else {
            console.error('No production order ID found.');
        }
    };



    return (
        <div className={style.reportingContainer}>
            <div className={style.reportingHeader}>
                <div className={style.title}>
                    <i class="ri-file-chart-line"></i>
                    <h4>Reporting</h4>
                </div>

                <input
                    type="text"
                    placeholder="Search by Production Order ID"
                    value={searchInput}
                    onChange={handleSearchChange}

                />
            </div>
            <table className={style.reportingTable}>
                <thead className={style.reportingTableHeader}>
                    <tr>
                        <th>Sr/No</th>
                        <th>Production Order ID</th>
                        <th>Product ID</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className={style.reportingTableBody}>
                    {filteredData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.productionOrderId}</td>
                            <td>{item.selectedProductId}</td>
                            <td>
                                <button onClick={() => handleDownload('pdf', item.productionOrderId)}>
                                    Download as PDF
                                </button>
                                <button onClick={() => handleDownload('excel', item.productionOrderId)}>
                                    Download as Excel
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDownloadPopup && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Download Report</h2>
                        <button onClick={() => handleDownload('excel', selectedProductId)}>Download as Excel</button>
                        <button onClick={() => handleDownload('pdf', selectedProductId)}>Download as PDF</button>
                        <button onClick={() => setShowDownloadPopup(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reporting;
