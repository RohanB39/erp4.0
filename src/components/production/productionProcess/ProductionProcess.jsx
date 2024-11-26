import React, { useState } from 'react';
import style from './productionprocess.module.css';

import AllproductionMain from '../productionPhases/AllproductionMain';
import WorkOrders from '../workOrders/WorkOrders';
import SubContract from '../subContract/SubContract';
import BillOfMaterials from '../Bom/BillOfMaterials';


import { CiSettings } from "react-icons/ci";
import { ImClipboard } from "react-icons/im";
import { IoDocumentTextOutline } from "react-icons/io5";
import { VscPackage } from "react-icons/vsc";

const ProductionProcess = () => {
    const [activeTab, setActiveTab] = useState('AllproductionMain');


    const renderContent = () => {
        switch (activeTab) {
            case 'AllproductionMain':
                return <AllproductionMain />;
            case 'WorkOrders':
                return <WorkOrders />;
            case 'SubContract':
                return <SubContract />;
            case 'BillOfMaterials':
                return <BillOfMaterials />;
            default:
                return <AllProductionProcess />;
        }
    };

    return (
        <div className={style.productionWrapper}>
            <div className={style.productionContainer}>
                <div className={style.title}>
                    <i class="ri-play-line"></i>
                    <h4>Production Process</h4>
                </div>
                <p>This section outlines each step involved in the production process, from raw material sourcing to final product dispatch. </p>
            </div>
            <hr className='hr' />

            <div className={style.productionNavCards}>
                <div className={style.singleProductionCard} onClick={() => setActiveTab('AllproductionMain')}>
                    <CiSettings className={style.processIcon1} />
                    <h3>All Production Process</h3>
                </div>
                <div className={style.singleProductionCard} onClick={() => setActiveTab('WorkOrders')}>
                    <ImClipboard className={style.processIcon2} />
                    <h3>Work Orders</h3>
                </div>
                <div className={style.singleProductionCard} onClick={() => setActiveTab('SubContract')}>
                    <IoDocumentTextOutline className={style.processIcon3} />
                    <h3>Sub Contract</h3>
                </div>
                <div className={style.singleProductionCard} onClick={() => setActiveTab('BillOfMaterials')}>
                    <VscPackage className={style.processIcon4} />
                    <h3>Bill Of Materials</h3>
                </div>
            </div>
            <div className={style.productionContent}>
                {renderContent()}
            </div>

        </div>
    );
}

export default ProductionProcess