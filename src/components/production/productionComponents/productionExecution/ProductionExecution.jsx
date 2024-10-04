import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { fireDB } from '../../../firebase/FirebaseConfig';
import './productionExecution.css'

const ProductionExecution = () => {
    const [data, setData] = useState([]);
    const [searchInput, setSearchInput] = useState(''); // Ensure it's an empty string
    const [expandedRows, setExpandedRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(
                    collection(fireDB, 'Production_Orders'),
                    where('progressStatus', '==', 'Final Quality Approved')
                );
                const querySnapshot = await getDocs(q);
                const fetchedData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setData(fetchedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const filteredData = data.filter(item =>
        typeof searchInput === 'string' &&
        item.productionOrderId.toLowerCase().includes(searchInput.toLowerCase())
    );


    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    return (
        <div className="main">
            <input
                type="text"
                placeholder="Search by Production Order ID"
                value={searchInput}
                onChange={handleSearchChange}
                className="search-bar"
            />
            <table>
                <thead>
                    <tr>
                        <th>Production Order ID</th>
                        <th>Product ID</th>
                        <th>Machine</th>
                        <th>Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(item => (
                        <React.Fragment key={item.id}>
                            <tr>
                                <td>{item.productionOrderId}</td>
                                <td>{item.selectedProductId}</td>
                                <td>{item.selectedMachine}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    <button className='collExpBtn' onClick={() => toggleRow(item.id)}>
                                        {expandedRows.includes(item.id) ? 'Collapse' : 'Expand'}
                                    </button>
                                </td>
                            </tr>

                            {expandedRows.includes(item.id) && (
                                <tr>
                                    <td colSpan="5">
                                        <div className="expanded-content">
                                            <div className='expStrong'>
                                                <div>
                                                    <strong>Assembled Quantity:</strong> {item.assembledQuantity}
                                                </div>
                                                <div>
                                                    <strong>Completion Warehouse:</strong> {item.completionWarehouse}
                                                </div>
                                                <div>
                                                    <strong>Start Date:</strong> {item.startDate}
                                                </div>
                                                <div>
                                                    <strong>End Date:</strong> {item.endDate}
                                                </div>
                                            </div>
                                            <div>
                                                <strong>Assembly Workers:</strong>
                                                <ul>
                                                    {item.assemblyWorkers?.map((worker, index) => (
                                                        <li key={index}>{worker}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <strong>Required Materials:</strong>
                                                <ul>
                                                    {item.requiredMaterials?.map((material, index) => (
                                                        <li key={index}>{material.id}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductionExecution;
