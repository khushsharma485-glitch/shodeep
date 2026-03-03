import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const CartPage = () => {
    const { cart, loading, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    if (!cart || cart.items?.length === 0) {
        return (
            <div className="empty-page">
                <div className="empty-state">
                    <FiShoppingBag className="empty-icon" />
                    <h2>Your cart is empty</h2>
                    <p>Discover amazing products and add them to your cart</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="page-title">Shopping Cart</h1>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.items.map(item => (
                            <div key={item.id} className="cart-item">
                                <img
                                    src={item.productImageUrl || 'https://via.placeholder.com/120'}
                                    alt={item.productName}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-info">
                                    <h3 onClick={() => navigate(`/products/${item.productId}`)} className="cart-item-name">
                                        {item.productName}
                                    </h3>
                                    <p className="cart-item-price">${item.productPrice?.toFixed(2)}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-selector">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                            <FiMinus />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            <FiPlus />
                                        </button>
                                    </div>
                                    <p className="cart-item-subtotal">${item.subtotal?.toFixed(2)}</p>
                                    <button className="btn btn-ghost btn-danger" onClick={() => removeItem(item.id)}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Items ({cart.items.length})</span>
                            <span>${cart.totalPrice?.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free-shipping">FREE</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${cart.totalPrice?.toFixed(2)}</span>
                        </div>
                        <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout <FiArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
