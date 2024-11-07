import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import userVerification from '../../../../utils/userVerification';
import '../../../../styles/new-edit-form.css';
import '../add-user-menu.css';
import { API } from '../../../../env';
import trimFormValues from '../../../../utils/trimFormValues';
import Loading from '../../../../components/loading/Loading';
import SearchMenuSelect from '../../../../components/search-select/SearchMenuSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const AddUserMenu = () => {
    localStorage.setItem('selectedView', 'menus');
    const { id } = useParams();
    const navigate = useNavigate();
    const [paginator, setPaginator] = useState({});
    const [menuLists, setMenuLists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        menuId: ''
    });
    const handleSelect = (menu) => {
        setFormData({
            ...formData,
            menuId: menu.menuId
        });
    }
    const fetchData = async () => {
        try {
            const response = await fetch(`${API}/api/v1/user-menu/menus/${id}`);
            if (response.ok) {
                const data = await response.json();
                setMenuLists(data);
                setIsLoading(false);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.log(error);
            navigate(`/add-user-menu/${id}`);
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
            const response = await fetch(`${API}/api/v1/user-menu/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedFormData),
            });

            if (response.ok) {
                fetchData();
                navigate(`/add-user-menu/${id}`); // Corrected
                return;
            }
            alert("menu could not be updated, please check the data");
        } catch (error) {
            console.log(error);
            alert("Error updating menu");
        }
        setSubmitDisabled(false);
    }

    return (
        <div className="editCategory-container">

            <div className="text">Add user menus</div>
            {!isLoading ? (
                <div className='form-container'>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', }}>

                            <SearchMenuSelect
                                label="Menu list"
                                placeholder="Search menus..."
                                onSelected={handleSelect}
                                apiUrl={`${API}/api/v1/menu`}
                                optionsAttr="menu"
                                isRequired={true}
                            />

                            <div className="button-container" style={{ marginTop: '2.8rem', marginLeft: '2rem' }} >
                                <button className="btn" type="submit" >
                                    Add user menu
                                </button>
                            </div>
                        </div>
                    </form>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>USER ID</th>
                                <th>NAME</th>
                                <th>PATH</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuLists.map(menuObj => (
                                menuObj.menuList.map(menu => (
                                    <tr key={menu.menuId}>
                                        <td>{id}</td>
                                        <td>{menu.text}</td>
                                        <td>{menu.link}</td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default AddUserMenu;