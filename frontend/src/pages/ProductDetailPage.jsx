import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiArrowLeft, FiPackage, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const res = await productAPI.getById(id);
            setProduct(res.data);
        } catch (err) {
            toast.error('Product not found');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        await addToCart(product.id, quantity);
    };

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
    if (!product) return null;

    return (
        <div className="product-detail-page">
            <div className="container">
                <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Back
                </button>

                <div className="product-detail">
                    <div className="product-detail-image">
                        <img src={product.imageUrl || 'https://via.placeholder.com/600x400'} alt={product.name} />
                        <span className="product-category-tag">{product.category}</span>
                    </div>

                    <div className="product-detail-info">
                        <h1 className="product-detail-name">{product.name}</h1>
                        <p className="product-detail-price">${product.price?.toFixed(2)}</p>
                        <p className="product-detail-desc">{product.description}</p>

                        <div className="product-meta">
                            <div className="meta-item">
                                <FiPackage />
                                <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                            </div>
                            <div className="meta-item">
                                <FiTruck />
                                <span>Free shipping over $50</span>
                            </div>
                        </div>

                        {product.stock > 0 && (
                            <div className="add-to-cart-section">
                                <div className="quantity-selector">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                                </div>
                                <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                                    <FiShoppingCart /> Add to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
