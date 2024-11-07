import React, { useEffect, useState } from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faEye, faEyeSlash, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import './home.css';
import { Link, useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxesStacked, faTruckFast, faBasketShopping, faUsers, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { API } from '../../env';
import Loading from '../../components/loading/Loading';

const Home = () => {
    localStorage.setItem('selectedView', 'home');
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [dataSummary, setDataSummary] = useState(null);
    const [lengthCenter, setLengthCenter] = useState(null);
    const [lengthIssues, setLengthIssues] = useState(null);
    const [lengthpreterm, setLengthpreterm] = useState(null);

    useEffect(() => {
        // Permission validation
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        // Query data
        (async () => {
            const url = new URL(`${API}/api/v1/medical`);
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    setLengthIssues(data.length)
                    setIsLoading(false);
                })
                .catch(error => console.log(error))
        })();

        (async () => {
            const url = new URL(`${API}/api/v1/center`);
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    setLengthCenter(data.length)
                    setIsLoading(false);
                })
                .catch(error => console.log(error))
        })();

        (async () => {
            const url = new URL(`${API}/api/v1/preterm`);
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    setLengthpreterm(data.length)
                    setIsLoading(false);
                })
                .catch(error => console.log(error))
        })();

    }, [navigate]);

    return (
        <div className="home-container">
            <div className="text">Dashboard</div>

            {!isLoading ? (
                <div className="dashboard">

                    <div className="row-1">
                        <div className="panel item-1">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    <FontAwesomeIcon icon={faBoxesStacked} className="panel-title-icon" />
                                    <span>Pregnant Women</span>
                                </h3>
                            </div>
                            <div className="panel-body">
                                <p>
                                    {lengthCenter > 0
                                        ? lengthCenter + " pregnant women registered" + (lengthCenter > 1 ? "" : "")
                                        : "no registered records"
                                    }
                                </p>
                            </div>
                            <div className="panel-footer">
                                <Link to={"/users"} className='btn'>
                                    View Details
                                </Link>
                            </div>
                        </div>

                        <div className="panel item-2">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    <FontAwesomeIcon icon={faTruckFast} className="panel-title-icon" />
                                    <span>Medical Issues</span>
                                </h3>
                            </div>
                            <div className="panel-body">
                                <p>
                                {lengthIssues > 0
                                        ? lengthIssues + " medical issues" + (lengthIssues > 1 ? "s" : "") + " registered" + (lengthIssues > 1 ? "" : "")
                                        : "no registered records"
                                    }
                                </p>
                            </div>
                            <div className="panel-footer">
                                <Link to={"/medical-issues"} className='btn'>
                                    View Medical Issues
                                </Link>
                            </div>
                        </div>

                        <div className="panel item-3">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    <FontAwesomeIcon icon={faUsers} className="panel-title-icon" />
                                    <span>Pre-Term Records</span>
                                </h3>
                            </div>
                            <div className="panel-body">
                                <p>
                                {lengthpreterm > 0
                                        ? lengthpreterm + " pre-term issues" + (lengthpreterm > 1 ? "s" : "") + " registered" + (lengthpreterm > 1 ? "" : "")
                                        : "no registered records"
                                    }
                                </p>
                            </div>
                            <div className="panel-footer">
                                <Link to={"/pre-term-records"} className='btn'>
                                    View details
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="row-2">
                        <div className="panel item-4">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    <FontAwesomeIcon icon={faBasketShopping} className="panel-title-icon" />
                                    <span>Birth Records</span>
                                </h3>
                            </div>
                            <div className="panel-body">
                                
                            </div>
                            <div className="panel-footer">
                                <Link to={"/purchases"} className='btn'>
                                    View birth records
                                </Link>
                            </div>
                        </div>

                        <div className="panel item-5">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    <FontAwesomeIcon icon={faHandHoldingDollar} className="panel-title-icon" />
                                    <span>Medical Centers</span>
                                </h3>
                            </div>
                            <div className="panel-body">
                                
                            </div>
                            <div className="panel-footer">
                                <Link to={"/child-birth-records"} className='btn'>
                                View medical issues
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                <Loading />
            )}

        </div>
    );
}

export default Home;
