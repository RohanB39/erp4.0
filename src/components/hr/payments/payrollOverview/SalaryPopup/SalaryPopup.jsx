import React, { useState } from 'react';
import { fireDB } from '../../../../firebase/FirebaseConfig';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

const SalaryPopup = ({ showPopup, setShowPopup, selectedRow }) => {
  const [status, setStatus] = useState(selectedRow?.status || 'Unpaid');
  const [paymentMethod, setPaymentMethod] = useState(selectedRow?.paymentMethod || 'Cash');

  if (!showPopup) return null;

  const handleSave = async () => {
    const currentDate = new Date();
    const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const formattedEndDate = currentMonthEnd.toISOString().slice(0, 7);
    const EmployeeId = selectedRow?.employeeId;
    const EmployeeName = selectedRow?.employeeName;
    const AprovedLeaves = selectedRow?.authorizedLeaves;
    const Takenleaves = selectedRow?.leaves;
    const ExtraLeaves = selectedRow?.extraLeaves;
    const WorkingDays = selectedRow?.signInOutDays;
    const ExceptionDays = selectedRow?.absentDays;
    const PayableDays = selectedRow?.workingDays;
    const GrossPay = selectedRow?.PM;
    const Deduction = selectedRow?.employeeName;
    const NetPay = selectedRow?.netPaye;

    const docRef = doc(fireDB, 'Salary_Details', EmployeeId);
    try {
      const docSnap = await getDoc(docRef);
      const salaryDetails = {
        status,
        paymentMethod,
        EmployeeId,
        EmployeeName,
        AprovedLeaves,
        Takenleaves,
        ExtraLeaves,
        WorkingDays,
        ExceptionDays,
        PayableDays,
        GrossPay,
        Deduction,
        NetPay,
        Status: 'Paid',
        updatedAt: Timestamp.fromDate(new Date())
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          [formattedEndDate]: salaryDetails
        });
        alert('Salary details updated successfully');
      } else {
        await setDoc(docRef, {
          [formattedEndDate]: salaryDetails
        });
        alert('Salary details created successfully');
      }
      setShowPopup(false);
    } catch (error) {
      console.error("Error saving salary details:", error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div style={styles.header}>
          <h3 style={styles.title}>Update Salary Details</h3>
          <button onClick={() => setShowPopup(false)} style={styles.closeButton}>X</button>
        </div>
        <div style={styles.body}>
          {selectedRow && (
            <div style={styles.details}>
              <div style={styles.detailRow}>
                <strong>Employee Name:</strong> {selectedRow.employeeName}
              </div>
              <div style={styles.detailRow}>
                <strong>Employee ID:</strong> {selectedRow.employeeId}
              </div>
              <div style={styles.detailRow}>
                <strong>Status:</strong>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={styles.dropdown}
                >
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div style={styles.detailRow}>
                <strong>Payment Method:</strong>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={styles.dropdown}
                >
                  <option value="Cash">Cash</option>
                  <option value="Online Banking">Online Banking</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <div style={styles.footer}>
          <button onClick={handleSave} style={styles.saveButton}>Save</button>
          <button onClick={() => setShowPopup(false)} style={styles.closeButton}>Close</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#f9f9f9',
    padding: '20px 30px',
    borderRadius: '15px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    width: '450px',
    maxHeight: '70vh',
    overflowY: 'auto',
    transition: 'transform 0.3s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    color: '#d9534f',
    transition: 'color 0.3s ease',
  },
  body: {
    marginBottom: '20px',
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.6',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailRow: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  dropdown: {
    padding: '8px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '200px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  saveButton: {
    backgroundColor: '#5cb85c',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
};

export default SalaryPopup;
