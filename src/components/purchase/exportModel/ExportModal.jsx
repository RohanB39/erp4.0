// ExportModal.jsx
import React from 'react';
import style from './ExportModal.module.css'



import { IoClose } from "react-icons/io5";
import { BsFiletypePdf } from "react-icons/bs";
import { BsFiletypeCsv } from "react-icons/bs";
import { BsFileEarmarkExcel } from "react-icons/bs";

const ExportModal = ({ onClose, onExport }) => {
    return (
        <div className={style.modalOverlay}>
            <div className={`${style.modalContent} ${style.exportModal}`}>
                <div className={style.modalHead}>
                    <div>

                        <h3>Export Data</h3>
                        <p>Select the format in which you'd like to export your data:</p>
                    </div>
                    <div className={style.exportOption}>
                        <button className={style.closeIcon} onClick={onClose}><IoClose />
                        </button>
                    </div>
                </div>
                <hr />

                <div className={style.exportOption}>
                    <p>Download a PDF version of your data, perfect for sharing and easy reading.</p>
                    <button onClick={() => { onExport('pdf'); onClose(); }}><BsFiletypePdf /></button>
                </div>


                <div className={style.exportOption}>
                    <p>Export your data in Excel format, ideal for complex data analysis and editing.</p>
                    <button onClick={() => { onExport('excel'); onClose(); }}><BsFileEarmarkExcel /></button>
                </div>

                <div className={style.exportOption}>
                    <p>Generate a CSV file, best suited for simple data handling and integration with various tools.</p>
                    <button onClick={() => { onExport('csv'); onClose(); }}><BsFiletypeCsv />
                    </button>
                </div>


            </div>

        </div >
    );
};

export default ExportModal;
