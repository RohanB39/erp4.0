import React, { useState } from 'react';
import { fireDB, doc } from '../../firebase/FirebaseConfig';
import { setDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com'; 
import './EmployeeLogin.css';

const EmployeeLogin = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeId = `${firstName}_${lastName}_${Math.floor(1000 + Math.random() * 9000)}`;
    const employeeData = {
      firstName,
      lastName,
      email,
      password
    };

    try {
      // Save to Firestore
      await setDoc(doc(fireDB, 'Onboarding_Info', employeeId), employeeData);
      console.log("Employee details saved successfully.");

      // Send email using EmailJS
      sendEmail();

    } catch (error) {
      console.error("Error saving employee details:", error);
    }
  };

  // Function to send email using EmailJS
  const sendEmail = () => {
    const templateParams = {
      to_name: firstName,
      to_email: email,
      to_pass: password,
    };

    emailjs.send(
      'service_qpldplt',       
      'template_rjs6xoz',      
      templateParams,
      'OEsswRe8cmos9Mk-d'
    )
    .then((response) => {
      alert('Email sent successfully!', response.status, response.text);
    })
    .catch((err) => {
      console.error('Failed to send email. Error:', err);
    });
  };

  return (
    <div id='main' className='main'>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Employee Login</h2>

        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input 
            type="text" 
            id="firstName" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input 
            type="text" 
            id="lastName" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="submit-btn">Save</button>
      </form>
    </div>
  );
}

export default EmployeeLogin;
