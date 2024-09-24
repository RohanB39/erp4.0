import React, { useState, useEffect } from 'react';
import './production.css';
import OrderCreation from './productionComponents/orderCreation/OrderCreation';
import MaterialAllocation from './productionComponents/materialAllocation/MaterialAllocation';

function AllProduction() {
    const [productionData, setProductionData] = useState([]);
    const [currentStep, setCurrentStep] = useState('orderCreation'); // Current step in the workflow

    useEffect(() => {
        // You can fetch data related to production orders or workflows here
        // Example:
        // fetchProductionData();
    }, []);

    return (
        <div className='main' id='main'>
            <div className="production-container">
                <h4>Production</h4>
                <div className="production-nav-cards wd-100">
                    <div className="workflow-steps flex">
                        <div className="single-production-card padd">
                            <h3><button onClick={() => setCurrentStep('orderCreation')}>Order Creation</button></h3>
                        </div>
                        <div className="single-production-card padd">
                            <h3><button onClick={() => setCurrentStep('materialAllocation')}>Material Allocation</button></h3>
                        </div>
                        <div className="single-production-card padd">
                            <h3><button onClick={() => setCurrentStep('workCenter')}>Machine Assignment</button></h3>
                        </div>
                        <div className="single-production-card padd">
                            <h3><button onClick={() => setCurrentStep('execution')}>Production Execution</button></h3>
                        </div>
                        <div className="single-production-card padd">
                            <h3><button onClick={() => setCurrentStep('qualityControl')}>Quality Control</button></h3>
                        </div>
                        <div className="single-production-card padd">
                            <h3><button onClick={() => setCurrentStep('inventory')}>Finished Goods Inventory</button></h3>
                        </div>
                        <div className="single-production-card padd">
                            <h3><button onClick={() => setCurrentStep('reporting')}>Reporting</button></h3>
                        </div>
                    </div>
                </div>

                {/* Conditional Rendering based on the current step */}
                <div className="step-content">
                    {currentStep === 'orderCreation' && <OrderCreation />}
                    {currentStep === 'materialAllocation' && <MaterialAllocation />}
                    {/* {currentStep === 'workCenter' && <WorkCenterAssignment />}
                    {currentStep === 'execution' && <ProductionExecution />}
                    {currentStep === 'qualityControl' && <QualityControl />}
                    {currentStep === 'inventory' && <FinishedGoodsInventory />}
                    {currentStep === 'reporting' && <ProductionReporting />} */}
                </div>
            </div>
        </div>
    );
}

export default AllProduction;
