import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import './categories.css';
import '../../styles/addbox.css';
import SearchBox from '../../components/search-box/SearchBox';
import Pagination from '../../components/pagination/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { API } from '../../env';
import Loading from '../../components/loading/Loading';

const Roles = () => {
    localStorage.setItem('selectedView', 'categories');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [isLoading, setIsLoading] = useState(false);

    const [paginator, setPaginator] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        // Permission validation
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        // Query paginated data
        const data = new FormData();
        if (query.length > 0) {
            data.append('searchCriteria', query);
        }
        data.append('page', page);
        data.append('pageSize', pageSize);

        const url = new URL(`${API}/api/v1/role`);
        url.search = new URLSearchParams(data).toString();
        (async () => {
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    setPaginator(data);
                    setIsLoading(false);
                })
                .catch(error => console.log(error))
        })();
    }, [navigate, query, page]);

    const handleSearch = (query) => {
        setQuery(query);
    }

    const handlePage = (page) => {
        setPage(page);
    }

    return (
        <div className="categories-container">

            <div className="text">Roles</div>

            <div className="options">
                <SearchBox onSearch={handleSearch} disabled={isLoading} />
                <Link to="/new-role" className="add-box">
                    <FontAwesomeIcon icon={faPlus} className="icon" />
                    <span className="text">New role</span>
                </Link>
            </div>

            {!isLoading ? (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                {/* <th>ID</th> */}
                                <th>NAME</th>
                                <th>EDIT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginator.roles && paginator.roles.length > 0 ? (
                                paginator.roles.map(role => (
                                    <tr key={role.roleId}>
                                        {/* <td>{role.roleId}</td> */}
                                        <td>{role.name}</td>
                                        <td>
                                            <Link to={`/edit-role/${role.roleId}`}>
                                                <FontAwesomeIcon icon={faPen} className="pen-icon" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No results</td>
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
}

export default Roles;
