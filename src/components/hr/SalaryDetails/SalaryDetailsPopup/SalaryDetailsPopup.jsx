import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser'; // Import emailjs for sending emails
import { fireDB } from '../../../firebase/FirebaseConfig'; // Import Firebase configuration
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import './SalaryDetailsPopup.css';

const SalaryDetailsPopup = ({ employeeData, onClose }) => {
  // Define state variables for all salary fields
  const [designation, setDesignation] = useState('');
  const [basicPay, setBasicPay] = useState(0);
  const [hra, setHra] = useState(0);
  const [conveyance, setConveyance] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [employerPF, setEmployerPF] = useState(0);
  const [flexibleComponents, setFlexibleComponents] = useState(0);
  const [totalFixedPay, setTotalFixedPay] = useState(0);
  const [totalVariablePay, setTotalVariablePay] = useState(0);
  const [additionalBenefits, setAdditionalBenefits] = useState(0);
  const [gratuity, setGratuity] = useState(0);
  const [insurancePremiums, setInsurancePremiums] = useState(0);
  const [totalCTC, setTotalCTC] = useState(0);

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    const allChars = uppercase + lowercase + digits + specialChars;
    let password = '';

    // Ensure the password includes at least one uppercase, lowercase, digit, and special character
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the remaining characters randomly
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to avoid predictable patterns
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

    const [password, setPassword] = useState('');

    const handleGeneratePassword = () => {
      const newPassword = generatePassword();
      setPassword(newPassword);
    }

    // Automatically calculate HRA, Employer's PF, and Total Fixed Pay
    useEffect(() => {
      setHra(basicPay * 0.5); // HRA is 50% of Basic
      setEmployerPF(basicPay * 0.12); // Employer's PF is 12% of Basic
      setTotalFixedPay(basicPay + hra + conveyance + bonus + employerPF + flexibleComponents); // Total Fixed Pay
      setTotalCTC(totalFixedPay + totalVariablePay + additionalBenefits); // Total CTC = A + B + C
    }, [basicPay, hra, conveyance, bonus, employerPF, flexibleComponents, totalFixedPay, totalVariablePay, additionalBenefits]);

    // Function to handle saving data and sending email
    const handleSave = async () => {
      // EmailJS email sending logic
      const emailParams = {
        employee_email: employeeData.personalEmail,
        full_name: employeeData.fullName,
        mobile: employeeData.mobileNumber,
        designation: designation,
        basic_pay: basicPay,
        hra: hra,
        conveyance: conveyance,
        bonus: bonus,
        employer_pf: employerPF,
        flexibleComponents: flexibleComponents,
        total_fixed_pay: totalFixedPay,
        total_variable_pay: totalVariablePay,
        additional_benefits: additionalBenefits,
        gratuity: gratuity,
        insurancePremiums: insurancePremiums,
        total_ctc: totalCTC,
        password: password,
        employee_id: employeeData.employeeId,
      };

      try {
        // Send email using EmailJS
        await emailjs.send(
          'service_qpldplt',
          'template_xd4ureg',
          emailParams,
          'OEsswRe8cmos9Mk-d' // Replace with your EmailJS user ID (API key)
        );
        alert('Email sent successfully!');

        // Save salary details to Firebase Firestore
        const employeeDocRef = doc(fireDB, 'employees', employeeData.employeeId);
        const currentDate = new Date().toISOString().split('T')[0];
        await updateDoc(employeeDocRef, {
          SalaryDetails: {
            basicPay,
            hra,
            conveyance,
            bonus,
            employerPF,
            flexibleComponents,
            totalFixedPay,
            totalVariablePay,
            additionalBenefits,
            gratuity,
            insurancePremiums,
            totalCTC
          },
          designation: designation,
          password: password,
          Status: 'Onboarded',
          onboardDate: currentDate
        });

        alert('Salary details saved to Firestore successfully!');
        onClose(); // Close the popup after saving
      } catch (error) {
        console.error('Error saving salary details or sending email:', error);
      }
    };

    return (
      <div className="pp-ovrly">
        <div className="pp-con">
          <h2>Add Salary Details for {employeeData.fullName}</h2>
          <p><strong>Employee ID:</strong> {employeeData.employeeId}</p>
          <p><strong>Mobile Number:</strong> {employeeData.mobileNumber}</p>
          <p><strong>Email ID:</strong> {employeeData.personalEmail}</p>

          {/* Designation Input */}
          <div className="input-group">
            <label>Designation:</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Enter Designation"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              value={password}
              placeholder="Generated Password"
              style={{ padding: '10px', width: '250px' }}
            />
            <button onClick={handleGeneratePassword} style={{ padding: '10px' }}>
              Generate Password
            </button>
          </div>

          {/* Basic Pay Input */}
          <div className="input-group">
            <label>BASIC (@30% OF TOTAL FIXED PAY):</label>
            <input
              type="number"
              value={basicPay}
              onChange={(e) => setBasicPay(parseFloat(e.target.value))}
              placeholder="Enter Basic Pay"
            />
          </div>

          {/* HRA Input (calculated automatically) */}
          <div className="input-group">
            <label>HRA (@50% OF BASIC):</label>
            <input type="number" value={hra} readOnly />
          </div>

          {/* Conveyance Input */}
          <div className="input-group">
            <label>Conveyance:</label>
            <input
              type="number"
              value={conveyance}
              onChange={(e) => setConveyance(parseFloat(e.target.value))}
              placeholder="Enter Conveyance"
            />
          </div>

          {/* Bonus Input */}
          <div className="input-group">
            <label>Bonus / Statutory Bonus:</label>
            <input
              type="number"
              value={bonus}
              onChange={(e) => setBonus(parseFloat(e.target.value))}
              placeholder="Enter Bonus"
            />
          </div>

          {/* Employer's Contribution to PF (calculated automatically) */}
          <div className="input-group">
            <label>Employer's Contribution to Provident Fund (@12% of Basic Pay):</label>
            <input type="number" value={employerPF} readOnly />
          </div>

          {/* Flexible Components Input */}
          <div className="input-group">
            <label>Flexible Components of TFP:</label>
            <input
              type="number"
              value={flexibleComponents}
              onChange={(e) => setFlexibleComponents(parseFloat(e.target.value))}
              placeholder="Enter Flexible Components"
            />
          </div>

          {/* Total Fixed Pay (calculated automatically) */}
          <div className="input-group">
            <label>Total Fixed Pay (A):</label>
            <input type="number" value={totalFixedPay} readOnly />
          </div>

          {/* Total Variable Pay Input */}
          <div className="input-group">
            <label>Total Variable Pay (B):</label>
            <input
              type="number"
              value={totalVariablePay}
              onChange={(e) => setTotalVariablePay(parseFloat(e.target.value))}
              placeholder="Enter Total Variable Pay"
            />
          </div>

          {/* Additional Benefits Input */}
          <div className="input-group">
            <label>Additional Benefits (C):</label>
            <input
              type="number"
              value={additionalBenefits}
              onChange={(e) => setAdditionalBenefits(parseFloat(e.target.value))}
              placeholder="Enter Additional Benefits"
            />
          </div>

          {/* Gratuity Input */}
          <div className="input-group">
            <label>Gratuity:</label>
            <input
              type="number"
              value={gratuity}
              onChange={(e) => setGratuity(parseFloat(e.target.value))}
              placeholder="Enter Gratuity"
            />
          </div>

          {/* Insurance Premiums Input */}
          <div className="input-group">
            <label>Insurance Premiums:</label>
            <input
              type="number"
              value={insurancePremiums}
              onChange={(e) => setInsurancePremiums(parseFloat(e.target.value))}
              placeholder="Enter Insurance Premiums"
            />
          </div>

          {/* Total CTC (calculated automatically) */}
          <div className="input-group">
            <label>Total Cost to Company (D = A + B + C):</label>
            <input type="number" value={totalCTC} readOnly />
          </div>

          {/* Save and Close Button */}
          <button onClick={handleSave} className="close-popup-btn">Save</button>
        </div>
      </div>
    );
  };

  export default SalaryDetailsPopup;
