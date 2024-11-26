import React, { useState } from 'react';
import InProcessQuality from './InProcessQuality';
import FinalQuality from './FinalQuality';
import InwardQuality from './InwardQuality';
import AllQualityContent from './AllQualityContent';
import ExistingMaterialInward from './ExistingMaterialInward';

import style from './quality.module.css';

function AllQuality() {
    const [activeTab, setActiveTab] = useState('AllQuality');

    const renderContent = () => {
        switch (activeTab) {
            case 'AllQuality':
                return <InwardQuality />;
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
        <div className={style.qualityWrapper}>
            <div className={style.qualityHeader}>
                <div className={style.title}>
                    <i class="ri-shield-check-line"></i>
                    <h4>Quality</h4>
                </div>
                <p>Ensuring the highest standards across all stages of production for optimal product quality.</p>

                <hr className='hr' />
                <div className={style.qualityCards}>
                    <div
                        className={`${style.qualityCard} ${activeTab === 'InwardQuality' ? style.activeTab : ''}`}
                        onClick={() => setActiveTab('InwardQuality')}
                    ><i class="ri-clipboard-line"></i>
                        <h3>Inward Quality</h3>
                    </div>
                    <div
                        className={`${style.qualityCard} ${activeTab === 'InProcessQuality' ? style.activeTab : ''}`}
                        onClick={() => setActiveTab('InProcessQuality')}
                    ><i class="ri-settings-3-line"></i>
                        <h3>In Process Quality</h3>
                    </div>
                    <div
                        className={`${style.qualityCard} ${activeTab === 'existing-material-Inward' ? style.activeTab : ''}`}
                        onClick={() => setActiveTab('existing-material-Inward')}
                    ><i class="ri-archive-line"></i>
                        <h3>Existing Material Inward Quality</h3>
                    </div>
                    <div
                        className={`${style.qualityCard} ${activeTab === 'FinalQuality' ? style.activeTab : ''}`}
                        onClick={() => setActiveTab('FinalQuality')}
                    ><i class="ri-shield-check-line"></i>
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
