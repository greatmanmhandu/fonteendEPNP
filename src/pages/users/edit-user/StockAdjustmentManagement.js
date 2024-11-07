import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import '../../../styles/new-edit-form.css';
import './edit-user.css';

const StockAdjustmentManagement = () => {
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

            <div className="text">Stock Adjustment Management</div>
            <div className='editing-options'>
                <div className="grid-form">
                    <Link to={`/adjustment-list/override`} className='option'>
                        <span className="text">Override</span>
                    </Link>
                    <Link to={`/adjustment-list/addition`} className='option'>
                        <span className="text">Addition</span>
                    </Link>
                    <Link to={`/adjustment-list/reduction`} className='option'>
                        <span className="text">Reduction</span>
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default StockAdjustmentManagement;