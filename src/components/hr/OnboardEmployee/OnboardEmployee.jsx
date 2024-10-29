import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { fireDB } from '../../firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom';

const OnboardEmployee = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState(null);
    const [personalInfoCheck, setPersonalInfoCheck] = useState(false);
    const [addresslInfoCheck, setAddresslInfoCheck] = useState(false);
    const [emergencyInfoCheck, setEmergencyInfoCheck] = useState(false);
    const [bankInfoCheck, setBankInfoCheck] = useState(false);
    const [familyInfoCheck, setFamilyInfoCheck] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const docRef = doc(fireDB, "employees", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const employeeData = docSnap.data();
                    if (employeeData.Status === "Active") {
                        setEmployee(employeeData);
                    } else {
                        setError("Employee is not active.");
                    }
                } else {
                    setError("No such employee found.");
                }
            } catch (error) {
                console.error("Error fetching employee data: ", error);
                setError("Error fetching employee data.");
            }
        };

        fetchEmployee();
    }, [id]);

    const handleCheckboxChange = (event) => {
        setPersonalInfoCheck(event.target.checked);
    };
    const handleAddressCheckboxChange = (event) => {
        setAddresslInfoCheck(event.target.checked);
    };
    const handleEmergencyCheckboxChange = (event) => {
        setEmergencyInfoCheck(event.target.checked);
    };
    const handleBankCheckboxChange = (event) => {
        setBankInfoCheck(event.target.checked);
    };
    const handleFamilyCheckboxChange = (event) => {
        setFamilyInfoCheck(event.target.checked);
    };

    const getFamilyMemberData = (index, field) => {
        return employee?.familyMembers?.[index]?.[field] || "Not Available";
    };

    const handleSubmit = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleNavigate = (id) => {
        navigate('/HrDashboard'); 
    };

    const handlePopupSubmit = async () => {
        if (personalInfoCheck && addresslInfoCheck && emergencyInfoCheck && bankInfoCheck && familyInfoCheck) {
            try {
                const employeesRef = collection(fireDB, 'employees');
                const q = query(employeesRef, where('employeeId', '==', id));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(async (doc) => {
                        await updateDoc(doc.ref, { Status: 'Verification Completed' }); 
                    });
                    alert('Employee status updated');
                }
               alert('Employee data saved successfully!');
                setShowPopup(false);
            } catch (error) {
                console.error('Error saving employee data:', error);
            }
        } else {
            alert('Please verify all required information before submitting.');
        }
    };

    return (
        <div id="main">
            <h5>Data Review Employee: {id}</h5>
            {error && <p>{error}</p>}
            {employee && (
                // Add inline styles for table container and table to make it scrollable
                <div style={{ width: '100%', overflowX: 'auto', marginTop: '20px' }}>
                    <h3>Personal Information</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>First Name</th>
                                <th style={thStyle}>Father Name</th>
                                <th style={thStyle}>Last Name</th>
                                <th style={thStyle}>Marital Status</th>
                                <th style={thStyle}>Blood Group</th>
                                <th style={thStyle}>Country</th>
                                <th style={thStyle}>DOB</th>
                                <th style={thStyle}>Disability Type</th>
                                <th style={thStyle}>International EMP</th>
                                <th style={thStyle}>Mobile Number</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Physically Challenged</th>
                                <th style={thStyle}>Gender</th>
                                <th style={thStyle}>Verify</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={tdStyle}>{employee.personalInfo.firstName}</td>
                                <td style={tdStyle}>{employee.personalInfo.fatherName}</td>
                                <td style={tdStyle}>{employee.personalInfo.lastName}</td>
                                <td style={tdStyle}>{employee.personalInfo.maritalStatus}</td>
                                <td style={tdStyle}>{employee.personalInfo.bloodGroup}</td>
                                <td style={tdStyle}>{employee.personalInfo.countryOfOrigin}</td>
                                <td style={tdStyle}>{employee.personalInfo.dateOfBirth}</td>
                                <td style={tdStyle}>{employee.personalInfo.disabilityType}</td>
                                <td style={tdStyle}>{employee.personalInfo.internationalEmployee}</td>
                                <td style={tdStyle}>{employee.personalInfo.mobileNumber}</td>
                                <td style={tdStyle}>{employee.personalInfo.personalEmail}</td>
                                <td style={tdStyle}>{employee.personalInfo.physicallyChallenged}</td>
                                <td style={tdStyle}>{employee.personalInfo.gender}</td>
                                <td style={tdStyle}><input
                                    type="checkbox"
                                    checked={personalInfoCheck}
                                    onChange={handleCheckboxChange}
                                /></td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Address Information</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Present Address</th>
                                <th style={thStyle}>Permanent Address</th>
                                <th style={thStyle}>City</th>
                                <th style={thStyle}>State</th>
                                <th style={thStyle}>Country</th>
                                <th style={thStyle}>Pin Code</th>
                                <th style={thStyle}>Document</th>
                                <th style={thStyle}>Verify</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={tdStyle}>{employee.addressInfo.presentAddress}</td>
                                <td style={tdStyle}>{employee.addressInfo.permanentAddress}</td>
                                <td style={tdStyle}>{employee.addressInfo.city}</td>
                                <td style={tdStyle}>{employee.addressInfo.state}</td>
                                <td style={tdStyle}>{employee.addressInfo.country}</td>
                                <td style={tdStyle}>{employee.addressInfo.pinCode}</td>
                                <td style={tdStyle}>{employee.addressInfo.document}</td>
                                <td style={tdStyle}><input
                                    type="checkbox"
                                    checked={addresslInfoCheck}
                                    onChange={handleAddressCheckboxChange}
                                /></td>
                            </tr>
                        </tbody>
                    </table>


                    <h3>Emergency Information</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Contact Name</th>
                                <th style={thStyle}>Mobile Number</th>
                                <th style={thStyle}>Relationship</th>
                                <th style={thStyle}>Identification</th>
                                <th style={thStyle}>AadhaarName</th>
                                <th style={thStyle}>Aadhaar Number</th>
                                <th style={thStyle}>Driving License Number</th>
                                <th style={thStyle}>Passport Number</th>
                                <th style={thStyle}>Verify</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={tdStyle}>{employee.emergencyContact.contactName}</td>
                                <td style={tdStyle}>{employee.emergencyContact.mobileNumber}</td>
                                <td style={tdStyle}>{employee.emergencyContact.relationship}</td>
                                <td style={tdStyle}>{employee.emergencyContact.identification}</td>
                                <td style={tdStyle}>{employee.emergencyContact.aadhaarName}</td>
                                <td style={tdStyle}>{employee.emergencyContact.aadhaarNumber}</td>
                                <td style={tdStyle}>{employee.emergencyContact.drivingLicenseNumber}</td>
                                <td style={tdStyle}>{employee.emergencyContact.passportNumber}</td>
                                <td style={tdStyle}><input
                                    type="checkbox"
                                    checked={emergencyInfoCheck}
                                    onChange={handleEmergencyCheckboxChange}
                                /></td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Bank Details</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Name As Per Bank</th>
                                <th style={thStyle}>Account Number</th>
                                <th style={thStyle}>Account Type</th>
                                <th style={thStyle}>Bank Name</th>
                                <th style={thStyle}>Branch</th>
                                <th style={thStyle}>IFSC Code</th>
                                <th style={thStyle}>PF Account Number</th>
                                <th style={thStyle}>UAN</th>
                                <th style={thStyle}>Verify</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={tdStyle}>{employee.bankDetails.nameAsPerBank}</td>
                                <td style={tdStyle}>{employee.bankDetails.bankAccountNumber}</td>
                                <td style={tdStyle}>{employee.bankDetails.accountType}</td>
                                <td style={tdStyle}>{employee.bankDetails.bankName}</td>
                                <td style={tdStyle}>{employee.bankDetails.branch}</td>
                                <td style={tdStyle}>{employee.bankDetails.ifscCode}</td>
                                <td style={tdStyle}>{employee.bankDetails.previousPfAccountNumber}</td>
                                <td style={tdStyle}>{employee.bankDetails.uan}</td>
                                <td style={tdStyle}><input
                                    type="checkbox"
                                    checked={bankInfoCheck}
                                    onChange={handleBankCheckboxChange}
                                /></td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Family Details</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Relationship</th>
                                <th style={thStyle}>Blood Group</th>
                                <th style={thStyle}>DOB</th>
                                <th style={thStyle}>Gender</th>
                                <th style={thStyle}>Minor or Illness</th>
                                <th style={thStyle}>Nationality</th>
                                <th style={thStyle}>Verify</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={tdStyle}>{getFamilyMemberData(0, 'name')}</td>
                                <td style={tdStyle}>{getFamilyMemberData(0, 'relationship')}</td>
                                <td style={tdStyle}>{getFamilyMemberData(0, 'bloodGroup')}</td>
                                <td style={tdStyle}>{getFamilyMemberData(0, 'dob')}</td>
                                <td style={tdStyle}>{getFamilyMemberData(0, 'gender')}</td>
                                <td style={tdStyle}>{getFamilyMemberData(0, 'minorOrIllness')}</td>
                                <td style={tdStyle}>{getFamilyMemberData(0, 'nationality')}</td>
                                <td style={tdStyle}><input
                                    type="checkbox"
                                    checked={familyInfoCheck}
                                    onChange={handleFamilyCheckboxChange}
                                /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            <div style={{ marginTop: '20px' }}>
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={handleNavigate}>Cancel</button>
            </div>

            {showPopup && (
                <div className="popup">
                    <div>
                        <h2>Verification Status</h2>
                        <h2>employee Id: {id}</h2>
                        <p>
                            Personal Details: {personalInfoCheck ? 'Verified' : 'Rejected'}
                        </p>
                        <p>
                            Address Details: {addresslInfoCheck ? 'Verified' : 'Rejected'}
                        </p>
                        <p>
                            Emergency Details: {emergencyInfoCheck ? 'Verified' : 'Rejected'}
                        </p>
                        <p>
                            Bank Details: {bankInfoCheck ? 'Verified' : 'Rejected'}
                        </p>
                        <p>
                            Family Details: {familyInfoCheck ? 'Verified' : 'Rejected'}
                        </p>
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={handlePopupSubmit}>Submit</button>
                            <button onClick={handleClosePopup}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Inline styles
const thStyle = {
    padding: '8px 12px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    whiteSpace: 'nowrap', // Prevents text wrapping
};

const tdStyle = {
    padding: '8px 12px',
    border: '1px solid #ddd',
    whiteSpace: 'nowrap', // Prevents text wrapping
};

export default OnboardEmployee;
