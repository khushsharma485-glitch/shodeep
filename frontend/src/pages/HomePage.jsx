import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('id');
    const [direction, setDirection] = useState('asc');

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [page, selectedCategory, sortBy, direction]);

    const loadCategories = async () => {
        try {
            const res = await productAPI.getCategories();
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to load categories', err);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            let res;
            if (searchQuery) {
                res = await productAPI.search(searchQuery, page, 12);
            } else if (selectedCategory) {
                res = await productAPI.getByCategory(selectedCategory, page, 12);
            } else {
                res = await productAPI.getAll(page, 12, sortBy, direction);
            }
            setProducts(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Failed to load products', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        loadProducts();
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSearchQuery('');
        setPage(0);
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Elevate Your <span className="gradient-text">Experience</span>
                    </h1>
                    <p className="hero-subtitle">
                        Discover premium products curated for the extraordinary
                    </p>
                    <form onSubmit={handleSearch} className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="btn btn-primary">Search</button>
                    </form>
                </div>
            </section>

            {/* Filters */}
            <section className="filters-section">
                <div className="container">
                    <div className="filters-row">
                        <div className="category-filters">
                            <button
                                className={`category-chip ${selectedCategory === '' ? 'active' : ''}`}
                                onClick={() => handleCategoryChange('')}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="sort-controls">
                            <FiFilter />
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                                <option value="id">Default</option>
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                            </select>
                            <select value={direction} onChange={(e) => setDirection(e.target.value)} className="sort-select">
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="products-section">
                <div className="container">
                    {loading ? (
                        <div className="loading-screen"><div className="spinner"></div></div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <h2>No products found</h2>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <>
                            <div className="product-grid">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setPage(p => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                    >
                                        <FiChevronLeft /> Previous
                                    </button>
                                    <span className="page-info">Page {page + 1} of {totalPages}</span>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                        disabled={page >= totalPages - 1}
                                    >
                                        Next <FiChevronRight />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
