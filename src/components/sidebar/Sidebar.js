import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight,faStore, faHouse, faTags, faBoxesStacked, faTruckFast, faBasketShopping, faUsers, faHandHoldingDollar, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets//pregaz.jpeg';
import './sidebar.css';
import { API } from '../../env';

const menuItems = [
    { key: "home", icon: faHouse, text: "Dashbord", link: "/home" },
    { key: "medical-issues", icon: faBoxesStacked, text: "Medical Issues", link: "/medical-issues" },
    { key: "medical-centers", icon: faUsers, text: "Medical Centers", link: "/medical-centers" },
    { key: "pre-term-records", icon: faHandHoldingDollar, text: "Pre-Term Records", link: "/pre-term-records" },
    { key: "child-birth-records", icon: faTags, text: "Child Birth Records", link: "/child-birth-records" },
    { key: "vaccination", icon: faTruckFast, text: "Vaccination Records", link: "/vaccination" },
 
];

const Sidebar = () => {
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [menuLists, setMenuLists] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [selectedView, setSelectedView] = useState(localStorage.getItem('selectedView') || 'home');
    useEffect(() => {

        setUser(JSON.parse(localStorage.getItem('user')));
    }, []);
    useEffect(() => {
        if (user && user.userId) {
            fetchData(user.userId);
        }
    }, [user]);
    useEffect(() => {
        setSelectedView(localStorage.getItem('selectedView') || 'home');
    }, []);

    const fetchData = async (id) => {

        try {
            const response = await fetch(`${API}/api/v1/user-menu/menus/${id}`);
            if (response.ok) {
                const data = await response.json();
                setMenuLists(data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleMenuClick = (key) => {
        setSelectedView(key === selectedView ? null : key);
    };
    return (
        <nav className={`sidebar-container ${isSidebarOpen ? 'close' : ''}`}>
            <header>
                <div className="image-text">
                    <span className="image">
                        <img src={logo} alt="" />
                    </span>
                    <div className="text logo-text">
                        <span className="name">E-HP-N-P</span>
                        <span className="profession"></span>
                    </div>
                </div>
                <FontAwesomeIcon
                    icon={faAngleRight}
                    className="toggle"
                    onClick={toggleSidebar}
                />
            </header>
            <div className="menu-bar">
                <div className="menu">
                    {user && user.admin === true && (
                        <ul className="menu-links">
                            {menuItems.map(item => (
                                <li key={item.key} className={`nav-link ${selectedView === item.key ? "selected" : ""}`}>
                                    <Link to={item.link} onClick={() => handleMenuClick(item.key)}>
                                        <FontAwesomeIcon icon={item.icon} className="icon" />
                                        <span className="text nav-text">{item.text}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    {user && user.admin === false && (
                        <ul className="menu-links">
                            {menuLists.map(menuObj => (
                                menuObj.menuList.map(item => (
                                    <li key={item.key} className={`nav-link ${selectedView === item.key ? "selected" : ""}`}>
                                        <Link to={item.link} onClick={() => handleMenuClick(item.key)}>
                                            <FontAwesomeIcon icon={item.icon} className="icon" />
                                            <span className="text nav-text">{item.text}</span>
                                        </Link>
                                    </li>
                                ))
                            ))}
                        </ul>
                    )}
                </div>
                {user && user.admin === true && (
                    <div className="bottom-content">
                        <ul>

                            <li className={`${selectedView === "user-and-roles" ? "selected" : ""}`}>
                                <Link to="/user-and-roles" onClick={() => handleMenuClick("user-and-roles")}>
                                    <FontAwesomeIcon icon={faUsersGear} className="icon" />
                                    <span className="text nav-text">User Management</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Sidebar;