import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, fireDB } from '../firebase/FirebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import axios from 'axios';
import stateCityData from '../../cityStateJson/states-and-districts.json';
import style from './login.module.css'
const countryCodes = [
    { code: '+1', name: 'USA' },
    { code: '+91', name: 'India' },
    // Add more country codes as needed
];

function LoginPage({ onLogin }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isPasswordChange, setIsPasswordChange] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        country: '',
        state: '',
        district: '',
        taluka: '',
        gstNumber: '',
        countryCode: '',
        contactNumber: '',
        fax: '',
        password: '',
        rePassword: '',
        name: '',
        signInPassword: '',
        otp: '',
        generatedOtp: ''
    });
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        setStates(stateCityData.states);
    }, []);

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setFormData({ ...formData, state: selectedState, district: '' });
        const stateData = stateCityData.states.find(state => state.state === selectedState);
        if (stateData) {
            setDistricts(stateData.districts);
        } else {
            setDistricts([]);
        }
    };

    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
        setError('');
    };

    const togglePasswordChange = () => {
        setIsPasswordChange(!isPasswordChange);
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateGstNumber = (gstNumber) => {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
        return gstRegex.test(gstNumber);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        const { companyName, email, country, state, district, taluka, gstNumber, password, rePassword, contactNumber, fax } = formData;

        if (gstNumber && !validateGstNumber(gstNumber)) {
            setError('Invalid GST number. Please enter a valid GST number.');
            return;
        }

        if (password !== rePassword) {
            setError('Passwords do not match. Please re-enter the password.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(fireDB, "users", user.uid), {
                companyName,
                email,
                country,
                state,
                district,
                taluka,
                gstNumber,
                contactNumber,
                fax
            });

            onLogin();
            navigate('/');
        } catch (error) {
            console.error("Error signing up: ", error);
            if (error.code === 'auth/email-already-in-use') {
                setError('The email address is already in use. Please use a different email or log in.');
            } else if (error.code === 'permission-denied') {
                setError('Missing or insufficient permissions. Please check Firestore rules.');
            } else {
                setError('An error occurred during sign up. Please try again.');
            }
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { email, signInPassword } = formData;
            await signInWithEmailAndPassword(auth, email, signInPassword);

            onLogin();
            navigate('/');
        } catch (error) {
            console.error("Error signing in: ", error);
            setError('Invalid email or password. Please try again.');
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { email } = formData;
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent. Please check your email.');
            setIsPasswordChange(false);
            navigate('/');
        } catch (error) {
            console.error("Error sending password reset email: ", error);
            setError('Error sending password reset email. Please try again.');
        }
    };

    useEffect(() => {
        let timer;
        if (timerActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setTimerActive(false);
        }
        return () => clearInterval(timer);
    }, [timerActive, timeLeft]);

    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const sendOtp = async () => {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            setFormData({ ...formData, generatedOtp: otp });
            const response = await axios.post('https://otp-email-api.vercel.app/sendMail', {
                email: formData.email,
                otp: otp,
            });
            console.log(response.data);
            alert(response.data);
            setOtpSent(true);
            setTimeLeft(10); // Reset timer
            setTimerActive(true);
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('An error occurred while sending the OTP.');
        }
    };

    const [isOtpInvalid, setIsOtpInvalid] = useState(false);
    const verifyOtp = () => {
        if (formData.otp === formData.generatedOtp) {
            alert('OTP verified successfully!');
            setOtpVerified(true);
            setIsOtpInvalid(false);
        } else {
            alert('Invalid OTP. Please try again.');
            setIsOtpInvalid(true);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className={style.loginpage}>

            <div className={style.loginForm}>

                <div className={style.leftSide}>
                    <div className={style.logo}>
                        <h3 className={style.title}>InduFlow</h3>
                        <p className={style.text}>Empowering Manufacturers with Seamless Process Automation and Control.</p>
                    </div>

                </div>
                <div className={style.formContainer}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {isSignUp ? (
                        <>
                            <h3 className={style.heading}>Create an Account</h3>
                            <p className={style.subText}>
                                Join us today! Fill in your details below to get started and enjoy exclusive benefits.
                            </p>

                            <form onSubmit={handleSignUp}>
                                <input type="text" name="companyName" required placeholder='Company Name' onChange={handleChange} />
                                <input type="email" name="email" placeholder='Email' required onChange={handleChange} />
                                {!otpSent && !otpVerified && (
                                    <button type="button" onClick={sendOtp}>Send OTP</button>
                                )}
                                {otpSent && !otpVerified && (
                                    <>
                                        <input type="text" name="otp" placeholder='Enter OTP' onChange={handleChange} />
                                        <p className={style.successOtp}>OTP Send Successfully...</p>
                                        {isOtpInvalid && (
                                            <p className='invalidOTPAleart'>Invalid OTP. Please Try Again.</p>
                                        )}
                                        <p
                                            className={style.resendOtp}
                                            onClick={sendOtp}
                                            style={{ pointerEvents: timerActive ? 'none' : 'auto', opacity: timerActive ? 0.5 : 1 }}
                                        >
                                            Resend OTP {timeLeft > 0 && `(${formatTime(timeLeft)})`}
                                        </p>

                                        <button type="button" onClick={verifyOtp}>Verify OTP</button>
                                    </>
                                )}
                                {otpVerified && (
                                    <>
                                        <div className={style.select}>
                                            <select name="country" required onChange={handleChange}>
                                                <option value="" disabled selected>Select a country</option>
                                                <option value="India">India</option>
                                            </select>
                                            <select name="state" required onChange={handleStateChange}>
                                                <option value="" disabled selected>Select a state</option>
                                                {states.map(state => (
                                                    <option key={state.state} value={state.state}>{state.state}</option>
                                                ))}
                                            </select>
                                            <select name="district" required onChange={handleChange}>
                                                <option value="" disabled selected>Select a district</option>
                                                {districts.map(district => (
                                                    <option key={district} value={district}>{district}</option>
                                                ))}
                                            </select>
                                            <input type="text" name="taluka" required placeholder='Taluka' onChange={handleChange} />
                                        </div>
                                        <input type="text" name="gstNumber" placeholder='GST Number (optional)' onChange={handleChange} />
                                        <div className={style.subdiv}>


                                            <select name="countryCode" required onChange={handleChange}>
                                                <option value="" disabled selected>+ 91</option>
                                                {countryCodes.map((country) => (
                                                    <option key={country.code} value={country.code}>
                                                        {country.name} ({country.code})
                                                    </option>
                                                ))}
                                            </select>
                                            <input type="text" name="contactNumber" required placeholder='Contact Number' onChange={handleChange} />

                                        </div>
                                        <input type="text" name="fax" placeholder='Fax' onChange={handleChange} />
                                        <input type="password" name="password" required placeholder='Password' onChange={handleChange} />
                                        <input type="password" name="rePassword" required placeholder='Re-enter Password' onChange={handleChange} />
                                        <button type='submit'>Sign Up</button>
                                    </>
                                )}
                            </form>
                            <div className={style.bottomFormContent}>
                                <p>Already have an account? <span onClick={toggleSignUp}>Sign In</span></p>
                            </div>
                        </>
                    ) : isPasswordChange ? (
                        <>
                            <h3 className={style.heading}>Change Password</h3>
                            <p className={style.subText}>
                                Update your password to keep your account secure. Please enter a new password below.
                            </p>

                            <form onSubmit={handlePasswordReset}>
                                <input type="email" name="email" required placeholder='Email' onChange={handleChange} />
                                <button type='submit'>Change Password</button>
                            </form>
                            <div className={style.bottomFormContent}>
                                <p>Remember your password? <span onClick={togglePasswordChange}>Sign In</span></p>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className={style.heading}>Hello There</h3>
                            <p className={style.subText}>
                                Welcome! Please sign in to continue or create a new account to get started.
                            </p>

                            <form onSubmit={handleSignIn}>
                                <input type="email" name="email" required placeholder='Email' onChange={handleChange} />
                                <input type="password" name="signInPassword" required placeholder='Password' onChange={handleChange} />
                                <Link
                                    to=""
                                    onClick={togglePasswordChange}
                                    className={style.forgotPasswordLink}
                                >
                                    <h6 className={style.forgotPasswordHeading}>Forgot Password?</h6>
                                </Link>
                                <button type='submit' >Sign In</button>
                                <div className={style.bottomFormContent}>
                                    <p>
                                        Don't have an account ? <span onClick={toggleSignUp}>Sign Up</span>
                                    </p>
                                </div>
                            </form>
                        </>
                    )}
                </div>

            </div>

        </div>
    );
}

export default LoginPage;
