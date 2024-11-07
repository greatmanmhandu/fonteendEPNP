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

const OverrideProduct = () => {
    localStorage.setItem('selectedView', 'items');
    const navigate = useNavigate();
    const [dataArray, setDataArray] = useState([]);
    const [code, setCode] = useState('');
    const [uID, setUID] = useState(0);
    const [unitLists, setUnitLists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalQuantity, setTotalQuantity] = useState(0); // State variable to store the total quantity
    const { productCode } = useParams();

    useEffect(() => {
        // Permission validation
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }
    }, [navigate]);

    const [submitDisabled, setSubmitDisabled] = useState(false);

    const handleQuantityChange = (index, value) => {
        const updatedArray = [...dataArray];
        updatedArray[index] = { ...updatedArray[index], stock: value };
        setDataArray(updatedArray);
    };

    const handleSellingPriceChange = (index, value) => {
        const updatedArray = [...dataArray];
        updatedArray[index] = { ...updatedArray[index], salePrice: value };
        setDataArray(updatedArray);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Assuming dataArray is defined or passed as a parameter
        const trimmedFormData = trimFormValues(dataArray);

        setSubmitDisabled(true);

        try {
            const response = await fetch(`${API}/api/v1/article/update-product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataArray),
            });

            if (response.ok) {
                toast.success("Stock has been update successfully");

                fetchData(code, uID); // Assuming fetchData is defined
                setSubmitDisabled(false);
                return;
            }

            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        } catch (error) {
            console.error(error);
            alert('Error updating the stock');
        }

        setSubmitDisabled(false);
    };

    const fetchData = async (code, userId) => {
        try {
            const response = await fetch(`${API}/api/v1/article/get-product-by-code/${code}/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setDataArray(data.articles)
                const total = data.articles.reduce((acc, curr) => acc + curr.stock, 0);
                setTotalQuantity(total);
                setIsLoading(false)
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setUID(userId);
        setCode(productCode);
        fetchData(productCode, userId)

    }, []);

    return (
        <div className="newItem-container">
            <div className="text">Stock Adjustment ( Override )</div>
            <div className="form-container">
                {/* <form onSubmit={handleSubmit}> */}
                <div >
                    <div style={{ backgroundColor: 'lightgray', padding: '0.2rem', marginTop: '0.8rem' }}><h1>Shops Information</h1></div>
                    {!isLoading ? (
                        <table className="table" style={{ marginTop: '1rem' }}>
                            <thead>
                                <tr>
                                    <th>Shop </th>
                                    <th>Product </th>
                                    <th>Quantity</th>
                                    <th>Selling Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataArray.length > 0 ? (
                                    dataArray.map((data, index) => (
                                        <tr key={index}>
                                            <td>{data.unitDTO.name}</td>
                                            <td>{data.name} - {data.productCode}</td>
                                            <td>
                                                <input
                                                    style={{ borderWidth: '1px', borderColor: 'red', paddingLeft: '3px' }}
                                                    value={data.stock}
                                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                    type="number"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    style={{ borderWidth: '1px', borderColor: 'red', paddingLeft: '3px' }}
                                                    value={data.salePrice}
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
                    <div style={{ backgroundColor: 'lightgray', color: 'black', padding: '0.3rem', marginTop: '0.8rem', textAlign: 'right' }}>
                        <h1 style={{ margin: 0 }}>Total Quantity  : {totalQuantity}</h1>
                    </div>
                </div>


                <div className="button-container">
                    <button onClick={handleSubmit} className="btn" type="submit" disabled={submitDisabled}>
                        Update
                    </button>
                </div>
                {/* </form> */}


            </div>
            <ToastContainer />
        </div>

    );
}

export default OverrideProduct;