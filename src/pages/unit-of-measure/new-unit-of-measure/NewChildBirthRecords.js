import React, { useEffect, useState } from 'react';
import '../../../styles/new-edit-form.css';
import './new-category.css'
import { useNavigate } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import { API } from '../../../env';
import trimFormValues from '../../../utils/trimFormValues';

const NewChildBirthRecords = () => {
    localStorage.setItem('selectedView', 'categories');
    const navigate = useNavigate();

    useEffect(() => {
        // Permission validation
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }
    }, [navigate]);

    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        weight: '',
        gender: '',
        birthNumber: '',
        city: ''
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        });
    }
    // const handleChangesymbol = (event) => {
    //     setFormData({
    //         ...formData,
    //         [event.target.id]: event.target.value
    //     });
    // }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedFormData = trimFormValues(formData);

        setSubmitDisabled(true);
        try {
            const response = await fetch(`${API}/api/v1/birth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedFormData),
            });

            if (response.ok) {
                navigate('/child-birth-records');
                return;
            }
            alert("The  could not be created, please verify the data.");
        } catch (error) {
            console.log(error);
            alert("Error creating the ");
        }
        setSubmitDisabled(false);
    }

    return (
        <div className="newCategory-container">

            <div className="text">New Child Birth Records</div>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="grid-form">
                        <div className="form-item">
                            <label htmlFor="name">Name</label>
                            <input
                                className="input"
                                type="text"
                                id="name"
                                maxLength="45"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <label htmlFor="dob">Date Of Birth</label>
                            <input
                                className="input"
                                type="date"
                                id="dob"
                                maxLength="45"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                            
                            <label htmlFor="dob">Weight</label>
                            <input
                                className="input"
                                type="text"
                                id="weight"
                                maxLength="45"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                            />
                             <label htmlFor="birthNumber">Birth Number</label>
                            <input
                                className="input"
                                type="text"
                                id="birthNumber"
                                maxLength="45"
                                value={formData.birthNumber}
                                onChange={handleChange}
                                required
                            />
                              <label htmlFor="city">City</label>
                            <input
                                className="input"
                                type="text"
                                id="city"
                                maxLength="45"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="button-container">
                        <button className="btn" type="submit" disabled={submitDisabled}>
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewChildBirthRecords;
