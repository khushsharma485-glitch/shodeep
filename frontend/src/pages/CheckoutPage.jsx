import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { FiCheck, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const { cart, fetchCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            await orderAPI.checkout();
            setOrderPlaced(true);
            await fetchCart();
            toast.success('Order placed successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="empty-page">
                <div className="empty-state success-state">
                    <div className="success-icon"><FiCheck /></div>
                    <h2>Order Placed Successfully!</h2>
                    <p>Thank you for your purchase. Your order is being processed.</p>
                    <div className="success-actions">
                        <button className="btn btn-primary" onClick={() => navigate('/orders')}>
                            View Orders
                        </button>
                        <button className="btn btn-ghost" onClick={() => navigate('/')}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!cart || cart.items?.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="page-title">Checkout</h1>

                <div className="checkout-layout">
                    <div className="checkout-items">
                        <h2>Order Review</h2>
                        {cart.items.map(item => (
                            <div key={item.id} className="checkout-item">
                                <img src={item.productImageUrl || 'https://via.placeholder.com/80'} alt={item.productName} />
                                <div className="checkout-item-info">
                                    <h3>{item.productName}</h3>
                                    <p>Qty: {item.quantity} × ${item.productPrice?.toFixed(2)}</p>
                                </div>
                                <span className="checkout-item-total">${item.subtotal?.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Payment Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${cart.totalPrice?.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free-shipping">FREE</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax</span>
                            <span>$0.00</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${cart.totalPrice?.toFixed(2)}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-block"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-sm"></span>
                            ) : (
                                <><FiCreditCard /> Place Order</>
                            )}
                        </button>
                        <p className="checkout-note">
                            By placing your order, you agree to our terms and conditions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
