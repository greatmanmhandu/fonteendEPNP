import React, { useEffect, useState } from 'react';
import '../../../styles/new-edit-form.css';
import { useNavigate } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import { API } from '../../../env';
import SearchSelect from '../../../components/search-select/SearchSelect';
import trimFormValues from '../../../utils/trimFormValues';

const NewExpense = () => {
    localStorage.setItem('selectedView', 'expense');
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
        brand: '',
        stock: 0,
        purchasePrice: 0,
        salePrice: 0,
        weight: '',
        providerId: 0,
        categoryId: 0
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        });
    }

    const handleProviderSelect = (provider) => {
        setFormData({
            ...formData,
            providerId: provider.providerId
        });
    }

    const handleCategorySelect = (category) => {
        setFormData({
            ...formData,
            categoryId: category.categoryId
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedFormData = trimFormValues(formData);

        setSubmitDisabled(true);
        try {
            const response = await fetch(`${API}/api/v1/article`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedFormData),
            });

            if (response.ok) {
                navigate('/expense');
                return;
            }
            alert("The article could not be created, please verify the data");
        } catch (error) {
            console.log(error);
            alert("Error creating the article");
        }
        setSubmitDisabled(false);
    }

    return (
        <div className="newItem-container">
            <div className="text">New Expense</div>
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
                        <SearchSelect
                            label="Expense Category"
                            placeholder="Search expense category..."
                            onSelected={handleProviderSelect}
                            apiUrl={`${API}/api/v1/expense/get-category`}
                            optionsAttr="roles"
                            isRequired={true}
                        />


                        <div className="two-together">
                        <div className="form-item">
                                <label htmlFor="stock">Quantity</label>
                                <input 
                                    className="input"
                                    type="number"
                                    id="stock"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-item">
                                <label htmlFor="purchasePrice">Cost Price</label>
                                <input
                                    className="input"
                                    type="number"
                                    id="purchasePrice"
                                    min="0"
                                    value={formData.purchasePrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
          
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

export default NewExpense;