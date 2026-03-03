import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { FiPackage, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, [page]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await orderAPI.getMyOrders(page, 10);
            setOrders(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Failed to load orders', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        const statusMap = {
            PENDING: 'status-pending',
            PROCESSING: 'status-processing',
            SHIPPED: 'status-shipped',
            DELIVERED: 'status-delivered',
            CANCELLED: 'status-cancelled',
        };
        return statusMap[status] || '';
    };

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    if (orders.length === 0) {
        return (
            <div className="empty-page">
                <div className="empty-state">
                    <FiPackage className="empty-icon" />
                    <h2>No orders yet</h2>
                    <p>Your order history will appear here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container">
                <h1 className="page-title">My Orders</h1>

                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <h3>Order #{order.id}</h3>
                                    <p className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="order-header-right">
                                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <span className="order-total">${order.totalAmount?.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="order-items">
                                {order.items.map(item => (
                                    <div key={item.id} className="order-item">
                                        <img src={item.productImageUrl || 'https://via.placeholder.com/60'} alt={item.productName} />
                                        <div className="order-item-info">
                                            <p className="order-item-name">{item.productName}</p>
                                            <p className="order-item-qty">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button className="btn btn-ghost" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                            <FiChevronLeft /> Previous
                        </button>
                        <span className="page-info">Page {page + 1} of {totalPages}</span>
                        <button className="btn btn-ghost" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
                            Next <FiChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
