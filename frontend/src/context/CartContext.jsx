import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCart(null);
            return;
        }
        try {
            setLoading(true);
            const response = await cartAPI.get();
            setCart(response.data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        try {
            const response = await cartAPI.addItem({ productId, quantity });
            setCart(response.data);
            toast.success('Added to cart!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
            throw error;
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const response = await cartAPI.updateItem(itemId, quantity);
            setCart(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update cart');
            throw error;
        }
    };

    const removeItem = async (itemId) => {
        try {
            const response = await cartAPI.removeItem(itemId);
            setCart(response.data);
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            await cartAPI.clear();
            setCart(null);
        } catch (error) {
            toast.error('Failed to clear cart');
        }
    };

    const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <CartContext.Provider value={{ cart, loading, cartCount, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
