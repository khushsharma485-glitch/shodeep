import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            window.location.href = '/login';
            return;
        }
        await addToCart(product.id, 1);
    };

    return (
        <Link to={`/products/${product.id}`} className="product-card">
            <div className="product-card-image">
                <img
                    src={product.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.name}
                    loading="lazy"
                />
                <span className="product-category-tag">{product.category}</span>
            </div>
            <div className="product-card-body">
                <h3 className="product-card-title">{product.name}</h3>
                <p className="product-card-desc">{product.description?.substring(0, 80)}...</p>
                <div className="product-card-footer">
                    <span className="product-price">${product.price?.toFixed(2)}</span>
                    <button
                        className="btn btn-sm btn-primary add-cart-btn"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? 'Out of Stock' : <><FiShoppingCart /> Add</>}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
