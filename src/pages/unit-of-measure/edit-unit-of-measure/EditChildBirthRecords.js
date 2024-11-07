import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import '../../../styles/new-edit-form.css';
import './edit-category.css';
import { API } from '../../../env';
import trimFormValues from '../../../utils/trimFormValues';
import Loading from '../../../components/loading/Loading';

const EditChildBirthRecords = () => {
    localStorage.setItem('selectedView', 'categories');
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        weight: '',
        birthNumber: '',
        city: '',
    });

    useEffect(() => {
        // Permission validation
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        // Query data
        (async () => {
            const url = new URL(`${API}/api/v1/birth/${id}`);
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (!data || data.error) {
                        navigate('/child-birth-records');
                        return;
                    }
                    setFormData({
                        name: data.name,
                        dob: data.dob,
                        weight: data.weight,
                        birthNumber: data.birthNumber,
                        city: data.city
                    });
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    navigate('/child-birth-records');
                    return;
                })
        })();
    }, [id, navigate]);

    const handleChange = (event) => {
        console.log(event.target.value)
        setFormData({
            ...formData,
            [event.target.id]: event.target.value

        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedFormData = trimFormValues(formData);
        console.log(trimmedFormData)
        setSubmitDisabled(true);
        try {
            const response = await fetch(`${API}/api/v1/birth/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedFormData),
            });

            if (response.ok) {
                navigate('/child-birth-records');
                return;
            }
            alert("Category could not be updated, please check the data");
        } catch (error) {
            console.log(error);
            alert("Error updating category");
        }
        setSubmitDisabled(false);
    }

    return (
        <div className="editCategory-container">

            <div className="text">Edit Child Birth Records</div>
            {!isLoading ? (
                <div className='form-container'>
                    <form onSubmit={handleSubmit}>
                        <div className="grid-form">
                            <div className="form-item">
                                <label htmlFor="name">Name</label>
                                <input
                                    className='input'
                                    type="text"
                                    id="name"
                                    maxLength="45"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="weight">Weight</label>
                                <input
                                    className="input"
                                    type="text"
                                    id="weight"
                                    maxLength="45"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    required
                                />
                                 <label htmlFor="birthNumber">Date Of Birth</label>
                                <input
                                    className="input"
                                    type="text"
                                    id="birthNumber"
                                    maxLength="45"
                                    value={formData.birthNumber}
                                    onChange={handleChange}
                                    required
                                />
                                 <label htmlFor="address">Address</label>
                                <input
                                    className="input"
                                    type="text"
                                    id="address"
                                    maxLength="45"
                                    value={formData.address}
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
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default EditChildBirthRecords;