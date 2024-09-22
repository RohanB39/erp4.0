import React, { useEffect, useState } from 'react';
import './header.css';
import { auth, fireDB } from '../FirebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';
import profileImg from '../../assets/profile.jpg';

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

    const handleToggleSidebar = () => {
        document.body.classList.toggle('toggle-sidebar');
    };

    return (
        <>
            <header id='header' className='header fixed-top d-flex align-items-center'>
                {/* logo */}
                <a href="" className='logo d-flex align-items-center'>
                    <span className=''> ERP</span>
                </a>

                <i className='bi bi-list toggle-sidebar-btn' onClick={handleToggleSidebar}></i>

                {/* searchbar */}
                <div className="serch-bar">
                    <form action="#" className='search-form d-flex align-items-center' method='POST'>
                        <input type="text" name='query' placeholder='Search' title='Search Here' />
                        <button type='submit' title='Search'>
                            <i className='bi bi-search'></i>
                        </button>
                    </form>
                </div>

                {/* profile */}
                <div className='profile-img'>
                    <li className='nav-item dropdown pe-3'>
                        <a href="#" className='nav-link nav-profile d-flex align-items-center pe-0' data-bs-toggle="dropdown">
                            <img src={profileImg} alt="profile" className='rounded-circle' />
                            <span className='d-none d-md-block profileName ps-2'>{companyName}</span>
                        </a>
                    </li>
                </div>
            </header>
        </>
    );
}

export default Header;
