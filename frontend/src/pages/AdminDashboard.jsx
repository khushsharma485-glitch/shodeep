import { useState, useEffect } from 'react';
import { productAPI, orderAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiBox, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: '', imageUrl: '', category: ''
    });

    useEffect(() => {
        setPage(0);
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'products') loadProducts();
        else loadOrders();
    }, [activeTab, page]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await productAPI.getAll(page, 10, 'id', 'desc');
            setProducts(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await orderAPI.getAllOrders(page, 10);
            setOrders(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            };
            if (editingProduct) {
                await productAPI.update(editingProduct.id, payload);
                toast.success('Product updated');
            } else {
                await productAPI.create(payload);
                toast.success('Product created');
            }
            resetForm();
            loadProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            imageUrl: product.imageUrl || '',
            category: product.category || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await productAPI.delete(id);
            toast.success('Product deleted');
            loadProducts();
        } catch (err) {
            toast.error('Failed to delete product');
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            await orderAPI.updateStatus(orderId, status);
            toast.success('Status updated');
            loadOrders();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '', category: '' });
    };

    const getStatusClass = (status) => {
        const map = {
            PENDING: 'status-pending', PROCESSING: 'status-processing',
            SHIPPED: 'status-shipped', DELIVERED: 'status-delivered', CANCELLED: 'status-cancelled'
        };
        return map[status] || '';
    };

    return (
        <div className="admin-page">
            <div className="container">
                <h1 className="page-title">Admin Dashboard</h1>

                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <FiBox /> Products
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <FiPackage /> Orders
                    </button>
                </div>

                {activeTab === 'products' && (
                    <div className="admin-section">
                        <div className="section-header">
                            <h2>Manage Products</h2>
                            <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
                                <FiPlus /> Add Product
                            </button>
                        </div>

                        {showForm && (
                            <form onSubmit={handleSubmit} className="admin-form">
                                <h3>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Name *</label>
                                        <input
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <input
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Stock *</label>
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Image URL</label>
                                        <input
                                            value={formData.imageUrl}
                                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        {editingProduct ? 'Update' : 'Create'} Product
                                    </button>
                                    <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>
                                </div>
                            </form>
                        )}

                        {loading ? (
                            <div className="loading-screen"><div className="spinner"></div></div>
                        ) : (
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product.id}>
                                                <td>
                                                    <div className="table-product">
                                                        <img src={product.imageUrl || 'https://via.placeholder.com/40'} alt="" />
                                                        <span>{product.name}</span>
                                                    </div>
                                                </td>
                                                <td><span className="category-tag">{product.category}</span></td>
                                                <td>${product.price?.toFixed(2)}</td>
                                                <td>
                                                    <span className={product.stock < 10 ? 'low-stock' : ''}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="btn btn-sm btn-ghost" onClick={() => handleEdit(product)}>
                                                            <FiEdit2 />
                                                        </button>
                                                        <button className="btn btn-sm btn-ghost btn-danger" onClick={() => handleDelete(product.id)}>
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="admin-section">
                        <h2>All Orders</h2>
                        {loading ? (
                            <div className="loading-screen"><div className="spinner"></div></div>
                        ) : orders.length === 0 ? (
                            <div className="empty-state"><h3>No orders yet</h3></div>
                        ) : (
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order #</th>
                                            <th>Date</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>#{order.id}</td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td>{order.items?.length} items</td>
                                                <td>${order.totalAmount?.toFixed(2)}</td>
                                                <td>
                                                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        value={order.status}
                                                        onChange={e => handleStatusChange(order.id, e.target.value)}
                                                        className="status-select"
                                                    >
                                                        <option value="PENDING">Pending</option>
                                                        <option value="PROCESSING">Processing</option>
                                                        <option value="SHIPPED">Shipped</option>
                                                        <option value="DELIVERED">Delivered</option>
                                                        <option value="CANCELLED">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

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

export default AdminDashboard;
