import React, { useState } from 'react';
import style from './production.module.css';
import OrderCreation from './productionComponents/orderCreation/OrderCreation';
import MaterialAllocation from './productionComponents/materialAllocation/MaterialAllocation';
import MachineAssignment from './productionComponents/machineAssignment/MachineAssignment';
import ProductionExecution from './productionComponents/productionExecution/ProductionExecution';
import QualityControl from './productionComponents/qualityControl/QualityControl';
import Reporting from './productionComponents/reporting/Reporting';

function AllProduction() {
    const [currentStep, setCurrentStep] = useState('orderCreation');

    return (
        <div className={style.productionWrapper}>
            <div className={style.productionContainer}>
                <div className={style.title}>
                    <i class="ri-settings-3-line"></i>
                    <h4>Production</h4>
                </div>
                <p>Optimizing each phase for streamlined and efficient production.</p>

                <hr className={style.hr} />
                <div className={style.productionNavCards}>
                    <div
                        className={`${style.singleProductionCard} ${currentStep === 'orderCreation' ? style.active : ''}`}
                        onClick={() => setCurrentStep('orderCreation')}
                    ><i class="ri-file-list-3-line"></i>
                        <h3>Order Creation</h3>
                    </div>
                    <div
                        className={`${style.singleProductionCard} ${currentStep === 'materialAllocation' ? style.active : ''}`}
                        onClick={() => setCurrentStep('materialAllocation')}
                    ><i class="ri-share-line"></i>
                        <h3>Material Allocation</h3>
                    </div>
                    <div
                        className={`${style.singleProductionCard} ${currentStep === 'workCenter' ? style.active : ''}`}
                        onClick={() => setCurrentStep('workCenter')}
                    ><i class="ri-user-add-line"></i>
                        <h3>Machine Assignment</h3>
                    </div>
                    <div
                        className={`${style.singleProductionCard} ${currentStep === 'execution' ? style.active : ''}`}
                        onClick={() => setCurrentStep('execution')}
                    ><i class="ri-bar-chart-line"></i>
                        <h3>Production Execution</h3>
                    </div>
                    <div
                        className={`${style.singleProductionCard} ${currentStep === 'qualityControl' ? style.active : ''}`}
                        onClick={() => setCurrentStep('qualityControl')}
                    ><i class="ri-shield-check-line"></i>
                        <h3>Quality Control</h3>
                    </div>
                    <div
                        className={`${style.singleProductionCard} ${currentStep === 'reporting' ? style.active : ''}`}
                        onClick={() => setCurrentStep('reporting')}
                    ><i class="ri-file-text-line"></i>
                        <h3>Reporting</h3>
                    </div>
                </div>

                <div className={style.stepContent}>
                    {currentStep === 'orderCreation' && <OrderCreation />}
                    {currentStep === 'materialAllocation' && <MaterialAllocation />}
                    {currentStep === 'workCenter' && <MachineAssignment />}
                    {currentStep === 'execution' && <ProductionExecution />}
                    {currentStep === 'qualityControl' && <QualityControl />}
                    {currentStep === 'reporting' && <Reporting />}
                </div>
            </div>
        </div>
    );
}

export default AllProduction;
