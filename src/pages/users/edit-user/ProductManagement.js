import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import '../../../styles/new-edit-form.css';
import './edit-user.css';

const ProductManagement = () => {
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

            <div className="text">Product Management</div>
            <div className='editing-options'>
                <div className="grid-form">
                    <Link to={`/categories`} className='option'>
                        <span className="text">Product Category</span>
                    </Link>

                    <Link to={`/unit-of-measure`} className='option'>
                        <span className="text">Unit Of Measure</span>
                    </Link>

                    <Link to={`/products`} className='option'>
                        <span className="text">Product List</span>
                    </Link>

                  
                </div>

            </div>

        </div>
    );
}

export default ProductManagement;