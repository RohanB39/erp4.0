import React, { useState, useEffect } from 'react';
import './production.css';
import OrderCreation from './productionComponents/orderCreation/OrderCreation';
import MaterialAllocation from './productionComponents/materialAllocation/MaterialAllocation';
import MachineAssignment from './productionComponents/machineAssignment/MachineAssignment';
import ProductionExecution from './productionComponents/productionExecution/ProductionExecution';
import QualityControl from './productionComponents/qualityControl/QualityControl';
import Reporting from './productionComponents/reporting/Reporting';

function AllProduction() {
    const [productionData, setProductionData] = useState([]);
    const [currentStep, setCurrentStep] = useState('orderCreation'); 
    return (
        <div className='main' id='main'>
            <div className="production-container">
                <h4>Production</h4>
                <div className="production-nav-cards wd-100">
                    <div className="flex">
                        <div className="padd">
                            <h3><button onClick={() => setCurrentStep('orderCreation')}>Order Creation</button></h3>
                        </div>
                        <div className="padd">
                            <h3><button onClick={() => setCurrentStep('materialAllocation')}>Material Allocation</button></h3>
                        </div>
                        <div className=" padd">
                            <h3><button onClick={() => setCurrentStep('workCenter')}>Machine Assignment</button></h3>
                        </div>
                        <div className=" padd">
                            <h3><button onClick={() => setCurrentStep('execution')}>Production Execution</button></h3>
                        </div>
                        <div className=" padd">
                            <h3><button onClick={() => setCurrentStep('qualityControl')}>Quality Control</button></h3>
                        </div>
                        <div className=" padd">
                            <h3><button onClick={() => setCurrentStep('reporting')}>Reporting</button></h3>
                        </div>
                    </div>
                </div>

                {/* Conditional Rendering based on the current step */}
                <div className="step-content">
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
