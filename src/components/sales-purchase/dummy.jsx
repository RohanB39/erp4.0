import jsPDF from 'jspdf';
import logo from '../../assets/Tectigon_logo.png';
import PurchaseOrderPopup from './PurchaseOrder';

const exportToPDF = () => {
    const doc = new jsPDF();
    doc.addImage(logo, 'PNG', 10, 10, 50, 20);
    doc.setFontSize(14);
    doc.text('Tectigon IT Solutions Pvt Ltd', 15, 35);
    doc.setFontSize(11);
    doc.text('Pune Maharashtra 411021', 20, 40);
    doc.text('The Kode, 6th Floor, Baner Pashan Link Road', 10, 45);
    const itemHeaders = ['#', 'Invoice Details', 'Status', 'Vendor', 'Amount'];
    const itemRows = filteredData.map((item, index) => [
        `${index + 1}`,
        `${item.invoiceDetails}`,
        `${item.status}`,
        `${item.vendorDetails}`,
        `${item.amount}`
    ]);
    doc.autoTable({
        startY: 50,
        head: [itemHeaders],
        body: itemRows,
        theme: 'grid',
        styles: { halign: 'center' },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 80, halign: 'left' },
            2: { cellWidth: 20 },
            3: { cellWidth: 30 },
            4: { cellWidth: 30 }
        }
    });

    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text('Bank Details:', 10, finalY + 40);
    doc.setFontSize(11);
    doc.text('Account Holder Name: Tectigon IT Solutions Pvt Ltd', 10, finalY + 45);
    doc.text('Account Number: 259890368180 IFSC INDB0000269', 10, finalY + 50);
    doc.text('Bank: IndusInd Bank', 10, finalY + 55);
    doc.text('Notes:', 10, finalY + 70);
    doc.setFontSize(10);
    doc.text('Thanks for your business.', 10, finalY + 75);

    doc.text('Terms & Conditions:', 10, finalY + 85);
    doc.text('Please do the payment within 14 days. After 14 days, 14% will be charged.', 10, finalY + 90);
    doc.setFontSize(12);
    doc.text('Tectigon IT Solutions Pvt Ltd', 140, finalY + 70);
    doc.text('Sangita Kulkarni', 140, finalY + 80);
    doc.text('Authorized Signature', 140, finalY + 85);
    doc.save('all_data.pdf');
};