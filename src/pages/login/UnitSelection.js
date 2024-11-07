import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../assets/uzim-logo.jpg';
import './login.css';
import LoginLayout from './Layout';
import { API } from '../../env';
import userVerification from '../../utils/userVerification';
import SearchUnitSelect from '../../components/search-select/SearchUnitSelect';
import trimFormValues from '../../utils/trimFormValues';
import SearchSelect from '../../components/search-select/SearchSelect';

const UnitSelection = () => {

    const [submitDisabled, setSubmitDisabled] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    localStorage.setItem('selectedView', 'unitsection');

    const [isLoading, setIsLoading] = useState(true);

    const [userUnitIds, setUserUnit] = useState(null);
    const [formData, setFormData] = useState({
        userUnitId: '',
        userId: id
    });
    const handleSelect = (userUnit) => {
        setUserUnit(userUnit.userUnitId)
        setFormData({
            ...formData,
            userUnitId: userUnit.userUnitId,
            userId: id,
        });
    }

    const handleUnitSelect = (unit) => {
        setFormData({
            ...formData,
            userUnitId: unit.unitId,
            userId: id
        });
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const trimmedFormData = trimFormValues(formData);

        setSubmitDisabled(true);
        try {
            const response = await fetch(`${API}/api/v1/user/user-logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedFormData),
            });

            if (response.ok) {
                navigate(`/home`); // Corrected
                localStorage.setItem('unitId', userUnitIds);
                return;
            }
            alert("unit could not be updated, please check the data");
        } catch (error) {
            console.log(error);
            alert("Error saving unit");
        }
        setSubmitDisabled(false);
    }
    useEffect(() => {

        // Permission validation
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }
    }, [navigate]);


    return (
        <LoginLayout>
            <div className="login-content">
                <form onSubmit={handleFormSubmit}>
                    <img src={avatar} alt="login-avatar" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
                    <h2 className="title" style={{ color: '#350d75' }} >UZim POS</h2>
                   
                        <SearchUnitSelect
                            label="Please choose shop below"
                            placeholder="Search registered shops..."
                            onSelected={handleSelect}
                            apiUrl={`${API}/api/v1/unit/units/${id}`}
                            optionsAttr="unitList"
                            isRequired={true}
                        />
                

                    {/* <Link to="/forgot-login">¿Olvidaste tu contraseña?</Link> */}
                    <button type="submit" className="btn" disabled={submitDisabled}>
                        Continue
                    </button>

                    <p style={{ marginTop: '10px' }}>Forgot your password? <a href="/forgot-login">Click here</a></p>
                </form>


            </div>
        </LoginLayout>
    );
}

export default UnitSelection;
