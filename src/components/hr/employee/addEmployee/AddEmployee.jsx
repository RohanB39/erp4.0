import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './addemp.css';

function AddEmployee() {
    const [phase, setPhase] = useState(1); // Track which phase of the form we're on
    const [personalInfo, setPersonalInfo] = useState({
        firstName: '',
        lastName: '',
        bloodGroup: '',
        personalEmail: '',
        fatherName: '',
        maritalStatus: '',
        marriageDate: '',
        spouseName: '',
        countryOfOrigin: '',
        nationality: '',
        internationalEmployee: '',
        physicallyChallenged: '',
        disabilityType: '',
        gender: '',
        dateOfBirth: '',
    });
    const [companyDetails, setCompanyDetails] = useState({
        position: '',
        salary: '',
    });
    const [addressInfo, setAddressInfo] = useState({
        permanentAddress: '',
        presentAddress: '',
        city: '',
        state: '',
        pinCode: '',
        country: '',
        phoneNumber: '',
        copyPermanent: false,
    });
    const [emergencyContact, setEmergencyContact] = useState({
        name: '',
        mobileNumber: '',
        relationship: '',
    });
    const [identification, setIdentification] = useState({
        panNumber: '',
        aadhaarNumber: '',
        nameInAadhaar: '',
        passportNumber: '',
        nameInPassport: '',
        passportExpiryDate: '',
    });
    const [bankDetails, setBankDetails] = useState({
        bankAccountNumber: '',
        confirmBankAccountNumber: '',
        ifscCode: '',
        bankName: '',
        branch: '',
        nameAsPerBank: '',
        accountType: '',
    });
    const [pfDetails, setPfDetails] = useState({
        previousPfAccountNumber: '',
        uan: '',
    });
    const [familyMembers, setFamilyMembers] = useState([
        { name: '', relationship: '', dob: '', gender: '', bloodGroup: '', nationality: '', minorOrMentalIllness: false },
    ]);

    const db = getFirestore();
    const navigate = useNavigate(); // To navigate to HR Dashboard after submission

    const generateEmployeeId = (firstName, lastName) => {
        const randomFourDigits = Math.floor(1000 + Math.random() * 9000); // Generate random 4 digits
        const employeeId = `${firstName[0]}${lastName[0]}_TECTI-${randomFourDigits}`.toUpperCase();
        return employeeId;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const employeeId = generateEmployeeId(personalInfo.firstName, personalInfo.lastName); // Generate employee ID

        const newEmployeeData = {
            employeeId,
            personalInfo,
            companyDetails,
            addressInfo,
            emergencyContact,
            identification,
            bankDetails,
            pfDetails,
            familyMembers,
        };

        try {
            // Add employee data to Firestore
            const docRef = await addDoc(collection(db, 'employees'), newEmployeeData);
            console.log("Document written with ID: ", docRef.id);

            // Navigate to HR Dashboard after successful submission
            navigate('/HrDashboard'); // Replace '/hr-dashboard' with the actual route for HR Dashboard

        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const addFamilyMember = () => {
        setFamilyMembers([...familyMembers, { name: '', relationship: '', dob: '', gender: '', bloodGroup: '', nationality: '', minorOrMentalIllness: false }]);
    };

    const handleFamilyMemberChange = (index, field, value) => {
        const updatedMembers = familyMembers.map((member, i) => 
            i === index ? { ...member, [field]: value } : member
        );
        setFamilyMembers(updatedMembers);
    };

    const removeFamilyMember = (index) => {
        const updatedMembers = familyMembers.filter((_, i) => i !== index);
        setFamilyMembers(updatedMembers);
    };

    const nextPhase = () => setPhase(phase + 1);
    const prevPhase = () => setPhase(phase - 1);
    const goToPhase = (newPhase) => setPhase(newPhase);


    return (
        <div className="add-employee-page" id='main'>
            <h3>Enroll New Employee</h3>
            
            {/* Phase Navigation Buttons */}
            <div className="phase-navigation">
                <button onClick={() => goToPhase(1)} className={phase === 1 ? 'active' : ''}>Personal Info</button>
                <button onClick={() => goToPhase(2)} className={phase === 2 ? 'active' : ''}>Official Info</button>
                <button onClick={() => goToPhase(3)} className={phase === 3 ? 'active' : ''}>Address Info</button>
                <button onClick={() => goToPhase(4)} className={phase === 4 ? 'active' : ''}>Emergency & ID</button>
                <button onClick={() => goToPhase(5)} className={phase === 5 ? 'active' : ''}>Bank, PF & Family</button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Phase 1: Personal Information */}
                {phase === 1 && (
                    <><label>First Name:</label>
                    <input
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                        required
                    />
                    
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                        required
                    />
                    
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        value={personalInfo.phoneNumber}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phoneNumber: e.target.value })}
                        required
                    />
                    
                        <label>Blood Group:</label>
                            <select
                            value={personalInfo.bloodGroup}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, bloodGroup: e.target.value })}
                            >
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            </select>

                            <label>Personal Email:</label>
                            <input
                            type="email"
                            value={personalInfo.personalEmail}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, personalEmail: e.target.value })}
                            required
                            />

                            <label>Father's Name:</label>
                            <input
                            type="text"
                            value={personalInfo.fatherName}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, fatherName: e.target.value })}
                            required
                            />

                            <label>Marital Status:</label>
                            <select
                            value={personalInfo.maritalStatus}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, maritalStatus: e.target.value })}
                            >
                            <option value="">Select</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            </select>

                            {personalInfo.maritalStatus === 'Married' && (
                            <>
                                <label>Marriage Date:</label>
                                <input
                                type="date"
                                value={personalInfo.marriageDate}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, marriageDate: e.target.value })}
                                />

                                <label>Spouse Name:</label>
                                <input
                                type="text"
                                value={personalInfo.spouseName}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, spouseName: e.target.value })}
                                />
                            </>
                            )}

                            <label>Country of Origin:</label>
                            <select
                            value={personalInfo.countryOfOrigin}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, countryOfOrigin: e.target.value })}
                            >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="Canada">Canada</option>
                            {/* Add other countries as options */}
                            </select>

                            <label>Nationality:</label>
                            <select
                            value={personalInfo.nationality}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
                            >
                            <option value="">Select Nationality</option>
                            <option value="Indian">Indian</option>
                            <option value="American">American</option>
                            <option value="Canadian">Canadian</option>
                            {/* Add other nationalities as options */}
                            </select>

                            <label>International Employee:</label>
                            <select
                            value={personalInfo.internationalEmployee}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, internationalEmployee: e.target.value })}
                            >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            </select>

                            <label>Physically Challenged:</label>
                            <select
                            value={personalInfo.physicallyChallenged}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, physicallyChallenged: e.target.value })}
                            >
                            <option value="">Select</option>  
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            </select>

                            {personalInfo.physicallyChallenged === "Yes" && (
                            <>
                                <label>Disability Type:</label>
                                <input
                                type="text"
                                value={personalInfo.disabilityType}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, disabilityType: e.target.value })}
                                />
                            </>
                            )}

                            <label>Gender:</label>
                            <select
                            value={personalInfo.gender}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                            >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            </select>

                            <label>Date of Birth:</label>
                            <input
                            type="date"
                            value={personalInfo.dateOfBirth}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                            />


                    </>
                )}
                {phase === 2 && (
                    <>
                        <label>Position:</label>
                        <input
                            type="text"
                            value={companyDetails.position}
                            onChange={(e) => setAddressInfo({ ...companyDetails, position: e.target.value })}
                            required
                        />

                        <label>Salary:</label>
                        <input
                            type="text"
                            value={companyDetails.salary}
                            onChange={(e) => setAddressInfo({ ...companyDetails, salary: e.target.value })}
                            required
                        />
                    </>
                )}
                {/* Phase 2: Address Information */}
                {phase === 3 && (
                    <>
                        <label>Permanent Address:</label>
                        <input
                            type="text"
                            value={addressInfo.permanentAddress}
                            onChange={(e) => setAddressInfo({ ...addressInfo, permanentAddress: e.target.value })}
                            required
                        />

                        <label>Present Address:</label>
                        <input
                            type="text"
                            value={addressInfo.presentAddress}
                            onChange={(e) => setAddressInfo({ ...addressInfo, presentAddress: e.target.value })}
                            required
                        />

                        <label>City:</label>
                        <input
                            type="text"
                            value={addressInfo.city}
                            onChange={(e) => setAddressInfo({ ...addressInfo, city: e.target.value })}
                            required
                        />

                        <label>State:</label>
                        <select
                            value={addressInfo.state}
                            onChange={(e) => setAddressInfo({ ...addressInfo, state: e.target.value })}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Rajasthan">Rajasthan</option>
                        </select>

                        <label>Pin Code:</label>
                        <input
                            type="text"
                            value={addressInfo.pinCode}
                            onChange={(e) => setAddressInfo({ ...addressInfo, pinCode: e.target.value })}
                            required
                        />

                        <label>Country:</label>
                        <select
                            value={addressInfo.country}
                            onChange={(e) => setAddressInfo({ ...addressInfo, country: e.target.value })}
                            required
                        >
                            <option value="">Select</option>
                            <option value="USA">USA</option>
                            <option value="India">India</option>
                            <option value="Canada">Canada</option>
                            {/* Add other countries as needed */}
                        </select>
                    </>
                )}

                {/* Phase 3: Emergency Contact and Identification */}
                {phase === 4 && (
                    <>
                        <h4>Emergency Contact</h4>
                        <label>Emergency Contact Name:</label>
                        <input
                            type="text"
                            value={emergencyContact.name}
                            onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                            required
                        />

                        <label>Mobile Number:</label>
                        <input
                            type="text"
                            value={emergencyContact.mobileNumber}
                            onChange={(e) => setEmergencyContact({ ...emergencyContact, mobileNumber: e.target.value })}
                            required
                        />

                        <label>Relationship:</label>
                        <select
                            value={emergencyContact.relationship}
                            onChange={(e) => setEmergencyContact({ ...emergencyContact, relationship: e.target.value })}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Parent">Parent</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Friend">Friend</option>
                            {/* Add other relationships as needed */}
                        </select>

                        <h4>Identification</h4>
                        <label>PAN Number:</label>
                        <input
                            type="text"
                            value={identification.panNumber}
                            onChange={(e) => setIdentification({ ...identification, panNumber: e.target.value })}
                            required
                        />

                        <label>Aadhaar Number:</label>
                        <input
                            type="text"
                            value={identification.aadhaarNumber}
                            onChange={(e) => setIdentification({ ...identification, aadhaarNumber: e.target.value })}
                            required
                        />

                        <label>Name in Aadhaar:</label>
                        <input
                            type="text"
                            value={identification.nameInAadhaar}
                            onChange={(e) => setIdentification({ ...identification, nameInAadhaar: e.target.value })}
                            required
                        />

                        <label>Passport Number:</label>
                        <input
                            type="text"
                            value={identification.passportNumber}
                            onChange={(e) => setIdentification({ ...identification, passportNumber: e.target.value })}
                            required
                        />

                        <label>Name in Passport:</label>
                        <input
                            type="text"
                            value={identification.nameInPassport}
                            onChange={(e) => setIdentification({ ...identification, nameInPassport: e.target.value })}
                            required
                        />

                        <label>Passport Expiry Date:</label>
                        <input
                            type="date"
                            value={identification.passportExpiryDate}
                            onChange={(e) => setIdentification({ ...identification, passportExpiryDate: e.target.value })}
                            required
                        />
                    </>
                )}

                {/* Phase 4: Bank, PF Account, and Family Details */}
                {phase === 5 && (
                    <>
                        <h4>Bank Account Details</h4>
                        <label>Bank Account Number:</label>
                        <input
                            type="text"
                            value={bankDetails.bankAccountNumber}
                            onChange={(e) => setBankDetails({ ...bankDetails, bankAccountNumber: e.target.value })}
                            required
                        />
                        <label>Confirm Bank Account Number:</label>
                        <input
                            type="text"
                            value={bankDetails.confirmBankAccountNumber}
                            onChange={(e) => setBankDetails({ ...bankDetails, confirmBankAccountNumber: e.target.value })}
                            required
                        />
                        <label>IFSC Code:</label>
                        <input
                            type="text"
                            value={bankDetails.ifscCode}
                            onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                            required
                        />
                        <label>Bank Name:</label>
                        <input
                            type="text"
                            value={bankDetails.bankName}
                            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                            required
                        />
                        <label>Branch:</label>
                        <input
                            type="text"
                            value={bankDetails.branch}
                            onChange={(e) => setBankDetails({ ...bankDetails, branch: e.target.value })}
                            required
                        />
                        <label>Name as per Bank Account:</label>
                        <input
                            type="text"
                            value={bankDetails.nameAsPerBankAccount}
                            onChange={(e) => setBankDetails({ ...bankDetails, nameAsPerBankAccount: e.target.value })}
                            required
                        />
                        <label>Account Type:</label>
                        <select
                            value={bankDetails.accountType}
                            onChange={(e) => setBankDetails({ ...bankDetails, accountType: e.target.value })}
                            required
                        >
                            <option value="">Select Account Type</option>
                            <option value="Savings">Savings</option>
                            <option value="Current">Current</option>
                            <option value="Salary">Salary</option>
                            {/* Add other account types as needed */}
                        </select>

                        <h4>PF Account Details</h4>
                        <label>Previous PF Account Number:</label>
                        <input
                            type="text"
                            value={pfDetails.previousPFAccountNumber}
                            onChange={(e) => setPFDetails({ ...pfDetails, previousPFAccountNumber: e.target.value })}
                        />
                        <label>UAN:</label>
                        <input
                            type="text"
                            value={pfDetails.uan}
                            onChange={(e) => setPFDetails({ ...pfDetails, uan: e.target.value })}
                            
                        />

                        <h4>Family Details</h4>
                        <label>Family Members:</label>
                        {familyMembers.map((member, index) => (
                            <div key={index}>
                                <label>Member {index + 1} Name:</label>
                                <input
                                    type="text"
                                    value={member.name}
                                    onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                                    required
                                />
                                <label>Relationship:</label>
                                <input
                                    type="text"
                                    value={member.relationship}
                                    onChange={(e) => handleFamilyMemberChange(index, 'relationship', e.target.value)}
                                    required
                                />
                                <label>DOB:</label>
                                <input
                                    type="date"
                                    value={member.dob}
                                    onChange={(e) => handleFamilyMemberChange(index, 'dob', e.target.value)}
                                />
                                <label>Gender:</label>
                                <select
                                    value={member.gender}
                                    onChange={(e) => handleFamilyMemberChange(index, 'gender', e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <label>Blood Group:</label>
                                <select
                                    value={member.bloodGroup}
                                    onChange={(e) => handleFamilyMemberChange(index, 'bloodGroup', e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="A+">A+</option>
                                    <option value="B+">B+</option>
                                    <option value="O+">O+</option>
                                    <option value="AB+">AB+</option>
                                    {/* Add other blood groups as needed */}
                                </select>
                                <label>Nationality:</label>
                                <input
                                    type="text"
                                    value={member.nationality}
                                    onChange={(e) => handleFamilyMemberChange(index, 'nationality', e.target.value)}
                                />
                                <label>Minor/Mental Illness:</label>
                                <input
                                    type="checkbox"
                                    checked={member.minorOrMentalIllness}
                                    onChange={(e) => handleFamilyMemberChange(index, 'minorOrMentalIllness', e.target.checked)}
                                />
                                <button type="button" onClick={() => removeFamilyMember(index)}>Remove Member</button>
                            </div>
                        ))}
                        <button type="button" onClick={addFamilyMember}>Add Family Member</button>
                    </>
                )}


                {/* Previous/Next Buttons */}
                <div className="navigation-buttons">
                    {phase > 1 && <button type="button" onClick={prevPhase}>Previous</button>}
                    {phase < 4 && <button type="button" onClick={nextPhase}>Next</button>}
                    {phase === 4 && <button type="submit">Submit</button>}
                </div>
            </form>
        </div>
    );
}

export default AddEmployee;
