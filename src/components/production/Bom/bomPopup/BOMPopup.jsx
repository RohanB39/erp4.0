import React, { useState, useEffect } from 'react';
import { fireDB } from '../../../firebase/FirebaseConfig'; // Import Firestore reference from your Firebase config
import './bomPopup.css';
import { collection, getDocs } from 'firebase/firestore';

const BomPopup = ({ onClose, onSubmit }) => {
    const [status, setStatus] = useState('');
    const [fgName, setFgName] = useState('');
    const [numOfRm, setNumOfRm] = useState('');
    const [modifiedBy, setModifiedBy] = useState('');
    const [modifiedDate, setModifiedDate] = useState('');
    const [nextBOMId, setNextBOMId] = useState('0000'); 
    const [fgNames, setFgNames] = useState([]); // State to hold FG names fetched from Firestore

    const padNumber = (num, size) => {
        let s = '0000' + num;
        return s.substr(s.length - size);
    };

    // Fetch next BOM ID (you can customize this with your logic)
    useEffect(() => {
        const fetchNextBOMId = async () => {
            const latestBOMId = 1; // Replace this with actual logic to fetch the latest BOM ID
            const newBOMId = padNumber(latestBOMId + 1, 4); 
            setNextBOMId(newBOMId);
        };

        fetchNextBOMId();
    }, []);

    // Fetch FG names from Firestore
    useEffect(() => {
        const fetchFGNames = async () => {
            try {
                const fgNamesRef = collection(fireDB, 'Finished_Goods'); // Correct way to access collection
                const snapshot = await getDocs(fgNamesRef); // Use getDocs to retrieve documents
                const fgNamesList = snapshot.docs.map(doc => {
                    return doc.data().FGname; // Ensure this field exists
                });
                setFgNames(fgNamesList);
            } catch (error) {
                console.error('Error fetching FG names:', error);
            }
        };

        fetchFGNames();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            bomId: nextBOMId,
            status,
            fgName,
            numOfRm,
            modifiedBy,
            modifiedDate,
        };
        onSubmit(formData);
    };

    return (
        <div className="modal">
            <div className="bompopup">
                <button className="close" onClick={onClose}>×</button>
                <form onSubmit={handleSubmit}>
                    <h2>Create BOM</h2>
                    <label>BOM ID:</label>
                    <input
                        type="text"
                        value={nextBOMId}
                        readOnly
                    />
                    {/* Dropdown for FG Name */}
                    <label>FG Name:</label>
                    <select
                        value={fgName}
                        onChange={(e) => setFgName(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select FG Name</option>
                        {fgNames.map((name, index) => (
                            <option key={index} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                    <label>Number of RM:</label>
                    <input
                        type="number"
                        value={numOfRm}
                        onChange={(e) => setNumOfRm(e.target.value)}
                        required
                    />
                    <label>Last Modified By:</label>
                    <input
                        type="text"
                        value={modifiedBy}
                        onChange={(e) => setModifiedBy(e.target.value)}
                        required
                    />
                    <label>Last Modified Date:</label>
                    <input
                        type="date"
                        value={modifiedDate}
                        onChange={(e) => setModifiedDate(e.target.value)}
                        required
                    />
                    <label>Status:</label>
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default BomPopup;
