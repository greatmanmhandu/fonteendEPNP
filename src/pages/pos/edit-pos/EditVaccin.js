import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import '../../../styles/new-edit-form.css';
import './edit-category.css';
import { API } from '../../../env';
import trimFormValues from '../../../utils/trimFormValues';
import Loading from '../../../components/loading/Loading';

const EditVaccin = () => {
    localStorage.setItem('selectedView', 'categories');
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        stage: '',
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
            const url = new URL(`${API}/api/v1/vaccination/${id}`);
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (!data || data.error) {
                        navigate('/vaccination');
                        return;
                    }
                    setFormData({
                        name: data.name,
                        stage: data.stage,
                        description: data.description
                    });
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    navigate('/vaccination');
                    return;
                })
        })();
    }, [id, navigate]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedFormData = trimFormValues(formData);

        setSubmitDisabled(true);
        try {
            const response = await fetch(`${API}/api/v1/vaccination/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedFormData),
            });

            if (response.ok) {
                navigate('/vaccination');
                return;
            }
            alert(" could not be updated, please check the data");
        } catch (error) {
            console.log(error);
            alert("Error updating category");
        }
        setSubmitDisabled(false);
    }


    return (
        <div className="editCategory-container">

            <div className="text">Edit Vaccination Details</div>
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
                            </div>
                            <div className="form-item">
                                <label htmlFor="stage">Stage</label>
                                <input
                                    className='input'
                                    type="text"
                                    id="stage"
                                    maxLength="45"
                                    value={formData.stage}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-item">
                                <label htmlFor="description">Description</label>
                                <input
                                    className='input'
                                    type="text"
                                    id="description"
                                    maxLength="45"
                                    value={formData.description}
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

export default EditVaccin;