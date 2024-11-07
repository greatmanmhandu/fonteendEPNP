import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import userVerification from '../../../../utils/userVerification';
import '../../../../styles/new-edit-form.css';
import '../add-user-menu.css';
import { API } from '../../../../env';
import trimFormValues from '../../../../utils/trimFormValues';
import Loading from '../../../../components/loading/Loading';
import SearchSelect from '../../../../components/search-select/SearchSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrashAlt ,faUniversity } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddUserUnit = () => {
    localStorage.setItem('selectedView', 'menus');
    const { id } = useParams();
    const navigate = useNavigate();
    const [paginator, setPaginator] = useState({});
    const [unitLists, setUnitLists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const [formData, setFormData] = useState({
        unitId: ''
    });

    const fetchData = async () => {
        try {
            const response = await fetch(`${API}/api/v1/unit/units/${id}`);
            if (response.ok) {
                const data = await response.json();
                setUnitLists(data);
                setIsLoading(false);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const deleteUserUnit = async () => {
        const trimmedFormData = trimFormValues(formData);
        try {
            const response = await fetch(`${API}/api/v1/unit/delete/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedFormData),
            });

            if (response.ok) {
                fetchData();
                toast.success("Successfully deleted");
                return;
            }
            toast.error("error in deletion");

        } catch (error) {
            console.log(error);
            toast.error("error in deletion");

        }
    };


    useEffect(() => {
   
        fetchData();
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
        } else {
            fetchData();
        }
    }, [id, navigate]);

    const handleUnitSelect = (unit) => {
        setFormData({
            ...formData,
            unitId: unit.unitId,
            userId: id
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedFormData = trimFormValues(formData);

        setSubmitDisabled(true);
        try {
            const response = await fetch(`${API}/api/v1/unit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedFormData),
            });

            if (response.ok) {
                fetchData();
                toast.success("Successfully created"); 
                return;
            }
            toast.error("error in addition");
        } catch (error) {
            console.log(error);
            toast.error("error in adding");

        }
        setSubmitDisabled(false);
    }

    return (
        <div className="editCategory-container">

            <div className="text">Add user shops</div>
            {!isLoading ? (
                <div className='form-container'>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', }}>
                            <SearchSelect
                                label="Shop List"
                                placeholder="Search shops..."
                                onSelected={handleUnitSelect}
                                apiUrl={`${API}/api/v1/unit`}
                                optionsAttr="unitDTOS"
                                isRequired={true}
                            />

                            <div className="button-container" style={{ marginTop: '2.8rem', marginLeft: '2rem' }} >
                                <button className="btn" type="submit" >
                                    Add user Shop
                                </button>
                            </div>
                        </div>
                    </form>
                    <table className="table">
                        <thead>
                            <tr>
                                {/* <th>USER ID</th> */}
                                <th>NAME</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unitLists.map(unit => (
                                unit.unitList.map(unit => (
                                    <tr key={unit.unitId}>
                                        {/* <td>{id}</td> */}
                                        <td>{unit.name}</td>
                                        <td>
                                            <Link to={`/add-user-unit/${id}`} onClick={deleteUserUnit} title="delete user" style={{ marginRight: '1.3rem' }}>
                                                <FontAwesomeIcon icon={faTrashAlt } style={{ color: 'red' }} className="pen-icon" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <Loading />
            )}
                   <ToastContainer />
        </div>
    );
}

export default AddUserUnit;