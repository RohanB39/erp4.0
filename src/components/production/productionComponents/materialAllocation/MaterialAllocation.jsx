import React, { useEffect, useState, useRef } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../../firebase/FirebaseConfig';

const MaterialAllocation = () => {
    return (
        <div className='main'>
            <div className='grn-page'>
                <h4>Store Approved Orders</h4>
            </div>
            <div>
            <table>
                    <thead>
                        <tr>
                            <th>Sr No</th>
                            <th>Product ID</th>
                            <th>Production Order ID</th>
                            <th>Material IDs</th>
                            <th>Required Quantity</th>
                            <th>Approval Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaterialAllocation;
