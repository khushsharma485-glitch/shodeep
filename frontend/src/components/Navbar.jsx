import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">◈</span>
                    <span className="brand-text">Shodeep</span>
                </Link>

                <div className="navbar-actions">
                    {user ? (
                        <>
                            <Link to="/cart" className="nav-icon-btn cart-btn" title="Cart">
                                <FiShoppingCart />
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>

                            <div className="user-menu">
                                <button className="nav-icon-btn user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                                    <FiUser />
                                    <span className="user-name">{user.name}</span>
                                </button>

                                {menuOpen && (
                                    <div className="dropdown-menu" onMouseLeave={() => setMenuOpen(false)}>
                                        <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                            <FiPackage /> My Orders
                                        </Link>
                                        {isAdmin() && (
                                            <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                                <FiSettings /> Admin Dashboard
                                            </Link>
                                        )}
                                        <button className="dropdown-item logout-item" onClick={handleLogout}>
                                            <FiLogOut /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="btn btn-ghost">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
