import React from 'react'
import { Link } from 'react-router-dom';
import './master-card.css'

function Master() {
    return (
        <div id='main' className='main'>
            <section>
                <h4>Anylysis</h4>
                <div className="info-cards">
                    <div className="single-card">

                        <div className="card-icon">
                            <i class="bi bi-people"></i>
                        </div>
                        <div className="card-detail">

                            <div className="">
                                <div className="card-title">
                                    <h3>Total Customers</h3>
                                </div>
                                <div className="card-info">
                                    <p>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet. </p>
                                    <Link to="/CustomerList"> <p className='listlink'>View List</p></Link>
                                </div>
                            </div>
                            <div className="numbers ">
                                <h2>20</h2>
                            </div>
                        </div>

                    </div>
                    <div className="single-card">

                        <div className="card-icon">
                            <i class="bi bi-people"></i>
                        </div>
                        <div className="card-detail">

                            <div className="">
                                <div className="card-title">
                                    <h3>Total Vendors</h3>
                                </div>
                                <div className="card-info">
                                    <p>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet.</p>
                                    <Link to="/VendorList"> <p className='listlink'>View List</p></Link>
                                </div>
                            </div>
                            <div className="numbers ">
                                <h2>20</h2>
                            </div>
                        </div>

                    </div>
                    <div className="single-card">

                        <div className="card-icon">
                            <i class="bi bi-card-checklist"></i>
                        </div>
                        <div className="card-detail">

                            <div className="">
                                <div className="card-title">
                                    <h3>Total Items</h3>
                                </div>
                                <div className="card-info">
                                    <p>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet.</p>
                                    <Link to="/VendorList"> <p className='listlink'>View List</p></Link>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="single-card">

                        <div className="card-icon">
                            <i class="bi bi-card-checklist"></i>
                        </div>
                        <div className="card-detail">

                            <div className="">
                                <div className="card-title">
                                    <h3>Raw Materials</h3>
                                </div>
                                <div className="card-info">
                                    <p>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet.</p>
                                    <Link to="/RawMaterial"> <p className='listlink'>View List</p></Link>
                                </div>
                            </div>

                        </div>


                    </div>
                    <div className="single-card">

                        <div className="card-icon">
                            <i class="bi bi-card-checklist"></i>
                        </div>
                        <div className="card-detail">

                            <div className="">
                                <div className="card-title">
                                    <h3>Semi Finished Goods</h3>
                                </div>
                                <div className="card-info">
                                    <p>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet.</p>
                                    <Link to="/SemiFinished"> <p className='listlink'>View List</p></Link>
                                </div>
                            </div>

                        </div>


                    </div>
                    <div className="single-card">

                        <div className="card-icon">
                            <i class="bi bi-card-checklist"></i>
                        </div>
                        <div className="card-detail">

                            <div className="">
                                <div className="card-title">
                                    <h3>Finished Goods</h3>
                                </div>
                                <div className="card-info">
                                    <p>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet.</p>
                                    <Link to="/Finished"> <p className='listlink'>View List</p></Link>
                                </div>
                            </div>


                        </div>

                    </div>


                </div>
            </section>
        </div>
    )
}

export default Master