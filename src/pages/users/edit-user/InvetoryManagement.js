import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import '../../../styles/new-edit-form.css';
import './edit-user.css';

const InvetoryManagement = () => {
    localStorage.setItem('selectedView', 'users');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Permission validation
        const userVer = userVerification();

        // Authentication verification
        if (!userVer.isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        // Administrator role verification or same user updating himself
        let isAllowed = false;
        try {
            if (userVer.user && (userVer.user.admin === true || id === userVer.user.userId.toString())) {
                isAllowed = true;
            }
        } catch (error) {
            isAllowed = false;
        }
        if (!isAllowed) {
            navigate('/home');
            return;
        }
    }, [id, navigate]);

    return (
        <div className="editUser-container">

            <div className="text">Inventory Management</div>
            <div className='editing-options'>
                <div className="grid-form">
                    <Link to={`/items`} className='option'>
                    {/* list available inventory ( instock and out of stock) */}
                        <span className="text">Stocks</span>
                    </Link>

                    <Link to={`/purchases`} className='option'>
                        <span className="text">Receivables</span>
                    </Link>

                    <Link to={`/items`} className='option'>
                        <span className="text">Purchases</span>
                    </Link>

                    <Link to={`/items`} className='option'>
                        <span className="text">Trans Of Goods</span>
                    </Link>

                    <Link to={`/adjustment-management`} className='option'>
                        <span className="text">Stock Adjustment</span>
                    </Link>

                    <Link to={`/providers`} className='option'>
                        <span className="text">Suppliers</span>
                    </Link>

                  
                </div>

            </div>

        </div>
    );
}

export default InvetoryManagement;