import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import '../../../styles/new-edit-form.css';
import './edit-category.css';
import { API } from '../../../env';
import trimFormValues from '../../../utils/trimFormValues';
import Loading from '../../../components/loading/Loading';
import SearchSelect from '../../../components/search-select/SearchSelect';

const EditUnit = () => {
    localStorage.setItem('selectedView', 'categories');
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        posId: ''
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
            const url = new URL(`${API}/api/v1/unit/${id}`);
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (!data || data.error) {
                        navigate('/unit');
                        return;
                    }
                    setFormData({
                        name: data.name,
                        phone: data.phone,
                        address: data.address,
                        posId:data.posId
                    });
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    navigate('/unit');
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
            const response = await fetch(`${API}/api/v1/unit/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedFormData),
            });

            if (response.ok) {
                navigate('/unit');
                return;
            }
            alert("Category could not be updated, please check the data");
        } catch (error) {
            console.log(error);
            alert("Error updating category");
        }
        setSubmitDisabled(false);
    }
    const handlePosSelect = (pos) => {
        setFormData({
            ...formData,
            pos: pos.posId
        });
    }

    return (
        <div className="editCategory-container">

            <div className="text">Edit Shop</div>
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

                                <label htmlFor="name">Address</label>
                                <input
                                    className="input"
                                    type="text"
                                    id="name"
                                    maxLength="45"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />

                                <label htmlFor="name">Phone Number</label>
                                <input
                                    className="input"
                                    type="text"
                                    id="name"
                                    maxLength="45"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                                <SearchSelect
                                    label="Pos"
                                    placeholder="Search pos..."
                                    onSelected={handlePosSelect}
                                    apiUrl={`${API}/api/v1/pos`}
                                    optionsAttr="posList"
                                    isRequired={true}
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

export default EditUnit;