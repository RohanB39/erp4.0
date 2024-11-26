import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { auth, fireDB } from '../firebase/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import profileImg from '../../assets/profile.jpg';

import style from './header.module.css';


import { AiFillCaretDown } from "react-icons/ai";
import { CiUser } from "react-icons/ci";
import { TfiBell } from "react-icons/tfi";


function Header() {
    const [companyName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;

            if (user) {
                try {
                    const userDoc = await getDoc(doc(fireDB, 'users', user.uid));

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserName(userData.companyName || 'John');
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                console.log('No user is signed in.');
            }
        };

        fetchUserData();
    }, []);

    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleNavToggle = () => {
        setIsNavOpen((prevState) => !prevState);
    };



    return (
        <>
            <header id='header' className={style.header}>

                <div className={style.headerNav}>
                    <span aria-expanded={isNavOpen}
                        onClick={handleNavToggle}
                    >  <TfiBell className={style.bellicon} /> </span>



                    <nav id="primary-navigation" style={{ display: isNavOpen ? 'block' : 'none' }}>
                        <ul>


                            <li><Link to="#"><CiUser className={style.icons} />Home</Link></li>


                        </ul>
                    </nav>
                </div>



                <div className={style.headerDropdown}>


                    <div>
                        <img src={profileImg} alt="profile" className={style.profileImage} />

                    </div>



                    <div className={style.headerNav}>
                        <span aria-expanded={isNavOpen}
                            onClick={handleNavToggle}
                        > <AiFillCaretDown className={style.icon} /> </span>



                        <nav id="primary-navigation" style={{ display: isNavOpen ? 'block' : 'none' }}>
                            <ul>
                                <p>{companyName}</p>
                                <hr />
                                <li><Link to="#"><CiUser className={style.icons} />Home</Link></li>


                            </ul>
                        </nav>
                    </div>
                </div>




            </header>
        </>
    );
}

export default Header;
