import React, { useEffect, useState } from 'react';
import '../../../styles/new-edit-form.css';
import { useNavigate, Link, useParams } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import { API } from '../../../env';
import SearchSelect from '../../../components/search-select/SearchSelect';
import trimFormValues from '../../../utils/trimFormValues';
import { faPlus, faPen, faTrashAlt, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../../components/loading/Loading';

const NewItem = () => {
    localStorage.setItem('selectedView', 'items');
    const navigate = useNavigate();
    const [dataArray, setDataArray] = useState([]);
    const [selling, setSelling] = useState(0);
    const [availableCode, setAvailableCode] = useState({});
    const [unitLists, setUnitLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userId = localStorage.getItem('userId');


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
        productCode: '',
        providerId: 0,
        categoryId: 0,
        userId: userId
    });

    const [formQtyData, setFormQtyData] = useState({
        productName: '',
        categoryId: 0,
        unitName: '',
        quantity: 0,
        selling: 0
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

    const handleQuantityChange = (index, value) => {
        const updatedArray = dataArray.map((item, i) => {
            if (i === index) {
                return { ...item, quantity: value };
            }
            return item;
        });
        setDataArray(updatedArray);
    };

    const handleSellingPriceChange = (index, value) => {
        const updatedArray = dataArray.map((item, i) => {
            if (i === index) {
                return { ...item, sellingPrice: value };
            }
            return item;
        });
        setDataArray(updatedArray);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = {
            articleCreationDTO: formData,
            productAndUnitDTOS: dataArray
        }

        const trimmedFormData = trimFormValues(dataToSend);

        setSubmitDisabled(true);
        try {
            const response = await fetch(`${API}/api/v1/article/add-product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedFormData),
            });

            if (response.ok) {
                navigate('/products');
                toast.success("Product has been update successfully");
                return;
            }
            toast.error("Error in creation");
        } catch (error) {
            console.log(error);
            alert("Error creating the article");
        }
        setSubmitDisabled(false);
    }


    const fetchData = async (id) => {
        try {
            const response = await fetch(`${API}/api/v1/unit/units/${id}`);
            if (response.ok) {
                const data = await response.json();
                setUnitLists(data);
                setIsLoading(false);
                console.log("object here.........");
                console.log(unitLists);

                // Initialize an array to store all mapped units
                let updatedDataArray = [];

                // Iterate over each user unit
                data.forEach((userUnit) => {
                    // Map over the unitList for each user unit and add to updatedDataArray
                    const mappedUnits = userUnit.unitList.map((unit) => ({
                        productName: '',
                        unitId: unit.unitId,
                        unitName: unit.name,
                        quantity: 0,
                        sellingPrice: selling
                    }));

                    // Concatenate the mapped units to the updatedDataArray
                    updatedDataArray = updatedDataArray.concat(mappedUnits);
                });

                // Set the updated data array
                setDataArray(updatedDataArray);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const checkCodeExistance = async (id) => {
        try {
            const response = await fetch(`${API}/api/v1/article/check-code-last/${id}`);
            if (response.ok) {
                const data = await response.json();
                setAvailableCode(data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        fetchData(userId)
        checkCodeExistance(userId)

    }, []);

    return (
        <div className="newItem-container">
            <div className="text">Add Product</div>
            <div className="form-container">
                {/* <form onSubmit={handleSubmit}> */}
                <div >
                    <div style={{ backgroundColor: 'lightgray', padding: '0.2rem' }}><h1>Product Information </h1></div>

                    <div className="two-together">
                        <div className="form-item">
                            <label htmlFor="stock">Name</label>
                            <input
                                className="input"
                                type="name"
                                id="name"
                                min="0"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-item">
                            <SearchSelect
                                label="Category"
                                placeholder="Search category..."
                                onSelected={handleCategorySelect}
                                apiUrl={`${API}/api/v1/category`}
                                optionsAttr="categories"
                                isRequired={false}
                            />
                        </div>
                    </div>

                    <div className="two-together">
                        <div className="form-item">
                            <label htmlFor="brand">Brand</label>
                            <input
                                className="input"
                                type="text"
                                id="brand"
                                maxLength="15"
                                value={formData.brand}
                                onChange={handleChange}

                            />
                        </div>
                        <div className="form-item">
                            <SearchSelect
                                label="Unit of measure"
                                placeholder="Search category..."
                                onSelected={handleCategorySelect}
                                apiUrl={`${API}/api/v1/unit-of-measure`}
                                optionsAttr="unitOfMeasureList"
                                isRequired={false}
                            />
                        </div>
                    </div>
                    <div className="two-together">
                        <div className="form-item">
                            <SearchSelect
                                label="Supplier"
                                placeholder="Search supplier..."
                                onSelected={handleProviderSelect}
                                apiUrl={`${API}/api/v1/provider`}
                                optionsAttr="providers"
                                isRequired={false}
                            />
                        </div>
                        <div className="form-item">
                            <label htmlFor="brand">Product Code <span style={{color:'red',fontSize:'0.9rem',marginLeft:'0.6rem'}}> last entered code was {availableCode.code} </span> </label>
                            <input
                                className="input"
                                type="text"
                                id="productCode"
                                maxLength="15"
                                value={formData.productCode}
                                onChange={handleChange}

                            />
                        </div>
                    </div>


                    <div style={{ backgroundColor: 'lightgray', padding: '0.2rem', marginTop: '0.8rem' }}><h1>Price Information</h1></div>

                    <div className="two-together">
                        <div className="form-item">
                            <label htmlFor="purchasePrice">Purchase Price</label>
                            <input
                                className="input"
                                type="text"
                                id="purchasePrice"
                                min="0"
                                value={formData.purchasePrice}
                                onChange={handleChange}

                            />
                        </div>
                        <div className="form-item">
                            <label htmlFor="salePrice">Sale Price</label>
                            <input
                                className="input"
                                type="text"
                                id="salePrice"
                                min="0"
                                value={formData.salePrice}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div style={{ backgroundColor: 'lightgray', padding: '0.2rem', marginTop: '0.8rem' }}><h1>Shops Information</h1></div>
                    {!isLoading ? (
                        <table className="table" style={{ marginTop: '1rem' }}>
                            <thead>
                                <tr>
                                    <th>Shop NAME</th>
                                    <th>QUANTITY</th>
                                    <th>Selling Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataArray.length > 0 ? (
                                    dataArray.map((data, index) => (
                                        <tr key={index}>
                                            <td>{data.unitName}</td>
                                            <td>
                                                <input
                                                    style={{ borderWidth: '1px', borderColor: 'red', paddingLeft: '3px' }}
                                                    value={data.quantity}
                                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                    type="number"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    style={{ borderWidth: '1px', borderColor: 'red', paddingLeft: '3px' }}
                                                    value={data.sellingPrice}
                                                    onChange={(e) => handleSellingPriceChange(index, e.target.value)}
                                                    type="number"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No data added yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    ) : (
                        <Loading />
                    )}
                </div>


                <div className="button-container">
                    <button onClick={handleSubmit} className="btn" type="submit" disabled={submitDisabled}>
                        Create
                    </button>
                </div>
                {/* </form> */}


            </div>
            <ToastContainer />
        </div>
    );
}

export default NewItem;