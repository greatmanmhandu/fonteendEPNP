import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import './items.css';
import '../../styles/addbox.css';
import SearchBox from '../../components/search-box/SearchBox';
import Pagination from '../../components/pagination/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { API } from '../../env';
import Loading from '../../components/loading/Loading';

const Products = () => {
    localStorage.setItem('selectedView', 'items');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [isLoading, setIsLoading] = useState(true);

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

        const url = new URL(`${API}/api/v1/article`);
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
        <div className="items-container">

            <div className="text">Product List</div>

            <div className="options">
                <SearchBox onSearch={handleSearch} disabled={isLoading} />
                <Link to="/add-product" className="add-box">
                    <FontAwesomeIcon icon={faPlus} className="icon" />
                    <span className="text">New Product</span>
                </Link>
            </div>

            {!isLoading ? (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>SHOP</th>
                                <th>NAME</th>
                                <th>CODE</th>
                                {/* <th>CATEGORY</th> */}
                                <th>STOCK Qnty</th>
                                <th>PURCHASE PRICE</th>
                                <th>SALE PRICE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginator.articles && paginator.articles.length > 0 ? (
                                paginator.articles.map(article => (
                                    <tr key={article.articleId}>
                                        <td>{article.unitDTO.name}</td>
                                        <td>{article.name}</td>
                                        <td>{article.productCode}</td>
                                        {/* <td>{article.category.name}</td> */}
                                        <td>{article.stock}</td>
                                        <td>{article.purchasePrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                                        <td>{article.salePrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                                   
                                   
                               
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10">No results</td>
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

export default Products;
