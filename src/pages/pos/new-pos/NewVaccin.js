import React, { useEffect, useState } from 'react';
import '../../../styles/new-edit-form.css';
import './new-category.css'
import { useNavigate } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import { API } from '../../../env';
import trimFormValues from '../../../utils/trimFormValues';
import Loading from '../../../components/loading/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewVaccin = () => {
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
        description:'',
        stage:'',
        id:''
    });

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
            const response = await fetch(`${API}/api/v1/vaccination`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedFormData),
            });

            if (response.ok) {
                toast.success("Successfully created");
                navigate('/vaccination');
              
                return;
            }
            toast.error("Error in creation");
        } catch (error) {
            console.log(error);
            toast.error("Error in creation");  
        }
        setSubmitDisabled(false);
    }

    return (
        <div className="newCategory-container">

            <div className="text">New vaccination</div>
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
                        </div>
                        <div className="form-item">
                            <label htmlFor="description">Description</label>
                            <input
                                className="input"
                                type="text"
                                id="description"
                                maxLength="45"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-item">
                            <label htmlFor="nastageme">Stage</label>
                            <input
                                className="input"
                                type="text"
                                id="stage"
                                maxLength="45"
                                value={formData.stage}
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
            <ToastContainer />
        </div>
    );
}

export default NewVaccin;
