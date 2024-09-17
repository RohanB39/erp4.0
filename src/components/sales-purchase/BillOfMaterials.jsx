import React, { useState, useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import { IoAdd } from "react-icons/io5";
import './bomModal.css'; 

const BillOfMaterials = () => {
    const [showModal, setShowModal] = useState(false);

    const data = useMemo(() => [
        { id: 1, bomName: "BOM 1", status: "Active", fgName: "FG 1", numOfRm: 3, modifiedBy: "User A", modifiedDate: "2024-06-01" },
        { id: 2, bomName: "BOM 2", status: "Inactive", fgName: "FG 2", numOfRm: 4, modifiedBy: "User B", modifiedDate: "2024-06-02" },
        // Add more data as needed
    ], []);

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

    return (
        <div className="allproduction">
            <div className={`overlay ${showModal ? 'show' : ''}`} onClick={() => setShowModal(false)}></div>
            <div className="info">
                <h3>Production</h3>
                <p>Bill Of Materials</p>
            </div>
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
                <Modal onClose={() => setShowModal(false)}>
                    <form>
                        <h2>Create BOM</h2>
                        <label>BOM Name:</label>
                        <input type="text" required />
                        <label>Status:</label>
                        <input type="text" required />
                        <label>FG Name:</label>
                        <input type="text" required />
                        <label>Number of RM:</label>
                        <input type="number" required />
                        <label>Last Modified By:</label>
                        <input type="text" required />
                        <label>Last Modified Date:</label>
                        <input type="date" required />
                        <button type="submit">Submit</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

const Modal = ({ onClose, children }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default BillOfMaterials;
