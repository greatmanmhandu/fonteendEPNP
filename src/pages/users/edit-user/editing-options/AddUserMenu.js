import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import userVerification from '../../../../utils/userVerification';
import '../../../../styles/new-edit-form.css';
import '../add-user-menu.css';
import { API } from '../../../../env';
import trimFormValues from '../../../../utils/trimFormValues';
import Loading from '../../../../components/loading/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddUserMenu = () => {
    localStorage.setItem('selectedView', 'menus');
    const { id } = useParams();
    const navigate = useNavigate();
    const [paginator, setPaginator] = useState({});
    const [menuLists, setMenuLists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [selectedMenuIds, setSelectedMenuIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        menuIds: []
    });

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

    const getAllMenus = async () => {
        const initialSelectedOption = null;
        const data = new FormData();
        if (searchQuery.length > 0) {
            data.append('searchCriteria', searchQuery);
        } else if (initialSelectedOption && searchQuery.length === 0 && options.length === 0) {
            const searchTerm = initialSelectedOption.text || initialSelectedOption.link;
            data.append('searchCriteria', searchTerm);
        }
        data.append('page', 1);
        data.append('pageSize', 6);

        const url = new URL(`${API}/api/v1/menu`);
        url.search = new URLSearchParams(data).toString();

        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setOptions(data);

            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        fetchData();
        getAllMenus();
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
        } else {
            fetchData();
        }
    }, [id, navigate]);

    const handleSelect = (menuId) => {
        if (selectedMenuIds.includes(menuId)) {
            setSelectedMenuIds(selectedMenuIds.filter(id => id !== menuId));
        } else {
            setSelectedMenuIds([...selectedMenuIds, menuId]);
        }
    };

    const handleSelectAll = () => {
        const allMenuIds = options.map(menu => menu.menuId);
        setSelectedMenuIds(allMenuIds);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitDisabled(true);
        try {
            const trimmedFormData = trimFormValues(formData);
            const response = await fetch(`${API}/api/v1/user-menu/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ menuIds: selectedMenuIds }),
            });

            if (response.ok) {
                fetchData();
                navigate(`/add-user-menu/${id}`);
                return;
            }
            alert("Menu could not be updated, please check the data");
        } catch (error) {
            console.log(error);
            alert("Error updating menu");
        }
        setSubmitDisabled(false);
    };

    return (
        <div className="editCategory-container">
            <div className="text">Add user menus</div>
            {!isLoading ? (
                <div className='form-container'>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex' }}>
                            <div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="selectAll"
                                        onChange={handleSelectAll}
                                    />
                                    <label htmlFor="selectAll">Select All</label>
                                </div>
                                {options.map(menu => (
                                    <div key={menu.menuId}>
                                        <input
                                            type="checkbox"
                                            id={menu.menuId}
                                            onChange={() => handleSelect(menu.menuId)}
                                            checked={selectedMenuIds.includes(menu.menuId)}
                                        />
                                        <label htmlFor={menu.menuId}>{menu.text}</label>
                                    </div>
                                ))}
                            </div>
                            <div className="button-container" style={{ marginLeft: '10rem' }}>
                                <button className="btn" type="submit">
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
};

export default AddUserMenu;