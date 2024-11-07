import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faBars,faUniversity } from '@fortawesome/free-solid-svg-icons';
import './users.css';
import '../../styles/addbox.css';
import SearchBox from '../../components/search-box/SearchBox';
import Pagination from '../../components/pagination/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../../env';
import userVerification from '../../utils/userVerification';
import Loading from '../../components/loading/Loading';

const Users = () => {
    localStorage.setItem('selectedView', 'users');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [isLoading, setIsLoading] = useState(true);

    const [paginator, setPaginator] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        // Permission validation
        const userVer = userVerification();
        if (!userVer.isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        } else if (!userVer.isAdmin) {
            navigate('/home');
            return;
        }

        // Query paginated data
        //console.log('Executing effect with query:', query, 'and page:', page);
        const data = new FormData();
        if (query.length > 0) {
            data.append('searchCriteria', query);
        }
        data.append('page', page);
        data.append('pageSize', pageSize);

        const url = new URL(`${API}/api/v1/user`);
        url.search = new URLSearchParams(data).toString();
        (async () => {
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    setPaginator(data);
                    setIsLoading(false);
                })
                .catch(error => console.log(error));
        })();
    }, [navigate, query, page]);

    const handleSearch = (query) => {
        setQuery(query);
    };

    const handlePage = (page) => {
        setPage(page);
    };

    return (
        <div className="users-container">

            <div className="text">Users</div>

            <div className="options">
                <SearchBox onSearch={handleSearch} disabled={isLoading} />
                <Link to="/new-user" className="add-box">
                    <FontAwesomeIcon icon={faPlus} className="icon" />
                    <span className="text">New User</span>
                </Link>
            </div>

            {!isLoading ? (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                {/* <th>ID</th> */}
                                <th>NAME</th>
                                <th>USERNAME</th>
                                {/* <th>PHONE</th> */}
                                {/* <th>EMAIL</th> */}
                                <th>Role</th>
                                {/* <th>ADMIN</th> */}
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginator.users && paginator.users.length > 0 ? (
                                paginator.users.map(user => (
                                    <tr key={user.userId}>
                                        {/* <td>{user.userId}</td> */}
                                        <td>{user.name}</td>
                                        <td>{user.username}</td>
                                        {/* <td>{user.phoneNumber}</td> */}
                                        {/* <td>{user.email}</td> */}
                                        <td>{user.role}</td>
                                        {/* <td>{user.admin ? 'Yes' : 'No'}</td> */}
                                        <td>
                                            <Link to={`/add-user-unit/${user.userId}`} title="Assign shop to user" style={{ marginRight: '1.3rem' }}>
                                                <FontAwesomeIcon icon={faUniversity} style={{ color: 'purple' }} className="pen-icon" />
                                            </Link>
                                            <Link to={`/add-user-menu/${user.userId}`} title="Add user menus" style={{ marginRight: '1.3rem' }}>
                                                <FontAwesomeIcon icon={faBars} style={{ color: 'green' }} className="pen-icon" />
                                            </Link>
                                            <Link to={`/edit-user/${user.userId}`} title="Edit User">
                                                <FontAwesomeIcon icon={faPen} className="pen-icon" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No results</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <Pagination paginator={paginator} onChangePage={handlePage} />
                </div>
            ) : (
                <Loading />
            )}

        </div>
    );
};

export default Users;