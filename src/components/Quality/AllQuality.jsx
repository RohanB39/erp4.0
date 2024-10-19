import React, { useState } from 'react';
import InProcessQuality from './InProcessQuality';
import FinalQuality from './FinalQuality';
import InwardQuality from './InwardQuality';
import AllQualityContent from './AllQualityContent';
import ExistingMaterialInward from './ExistingMaterialInward';

function AllQuality() {
    const [activeTab, setActiveTab] = useState('AllQuality');

  
    const renderContent = () => {
        switch (activeTab) {
            case 'AllQuality':
                return <AllQualityContent />;
            case 'InProcessQuality':
                return <InProcessQuality />;
            case 'FinalQuality':
                return <FinalQuality />;
            case 'InwardQuality':
                return <InwardQuality />;
            case 'existing-material-Inward':
                return <ExistingMaterialInward />;
            default:
                return <AllQualityContent />;
        }
    };

    return (
        <div className='main' id='main'>
            <div className="production-container">
                <h4>Quality</h4>
                <div className="production-nav-cards">
                    <div
                        className="single-production-card"
                        onClick={() => setActiveTab('InwardQuality')}
                    >
                        <h3>Inward Quality</h3>
                    </div>
                    <div
                        className="single-production-card"
                        onClick={() => setActiveTab('existing-material-Inward')}
                    >
                        <h3>Existing Material Inward Quality</h3>
                    </div>
                    <div
                        className="single-production-card"
                        onClick={() => setActiveTab('InProcessQuality')}
                    >
                        <h3>In Process Quality</h3>
                    </div>
                    <div
                        className="single-production-card"
                        onClick={() => setActiveTab('FinalQuality')}
                    >
                        <h3>Final Quality</h3>
                    </div>
                </div>
                <div className="production-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default AllQuality;
