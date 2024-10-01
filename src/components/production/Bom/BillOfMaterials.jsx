import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import { IoAdd } from "react-icons/io5";
import { fireDB, collection, getDocs, addDoc } from '../../firebase/FirebaseConfig';
import BomModal from './bomPopup/BOMPopup';
import './bomModal.css'; 

const BillOfMaterials = () => {
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);

    const columns = useMemo(() => [
        { Header: 'BOM ID', accessor: 'id' },
        { Header: 'BOM Name', accessor: 'bomName' },
        { Header: 'Status', accessor: 'status' },
        { Header: 'FG Name', accessor: 'fgName' },
        { Header: 'Number of RM', accessor: 'numOfRm' },
        { Header: 'Last Modified By', accessor: 'modifiedBy' },
        { Header: 'Last Modified Date', accessor: 'modifiedDate' }
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state: { pageIndex },
        prepareRow
    } = useTable({ columns, data, initialState: { pageIndex: 0 }, pageSize: 10 }, usePagination);

    const handleCreateBom = async (formData) => {
        const newBOM = {
            id: nextBOMId,
            ...formData
        };

        try {
            await addDoc(collection(fireDB, 'BOMs'), newBOM);
            console.log("New BOM added with ID:", newBOM.id);
            setShowModal(false);
            fetchData();  // Refresh the data after adding new BOM
        } catch (error) {
            console.error("Error adding BOM:", error);
        }
    };

    return (
        <div className="allproduction">
            <div className={`overlay ${showModal ? 'show' : ''}`} onClick={() => setShowModal(false)}></div>
            <div className="allproduction-table">
                <div className="allproduction-table-header">
                    <div className='productionsearch'>
                        <input type="text" placeholder='Search' />
                    </div>
                    <div className='createproduction'>
                        <button onClick={() => setShowModal(true)}> <IoAdd className='icon' />Create BOM</button>
                    </div>
                </div>
                <div className="production-item-list">
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="pagination">
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </button>
                    <span>
                        {pageIndex + 1} of {pageOptions.length}
                    </span>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </button>
                </div>
            </div>
            {showModal && (
                <BomModal onClose={() => setShowModal(false)} onSubmit={handleCreateBom} />
            )}
        </div>
    );
};

export default BillOfMaterials;
