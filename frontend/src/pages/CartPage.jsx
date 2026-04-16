import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { cartService, getCurrentUserId } from '../services/api';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = getCurrentUserId();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [userId, navigate]);

  const fetchCart = () => {
    cartService.get(userId)
      .then(res => {
        setCartItems(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    await cartService.update(userId, productId, newQuantity);
    fetchCart();
  };

  const handleRemove = async (productId) => {
    await cartService.remove(userId, productId);
    fetchCart();
  };

  const grouped = cartItems.reduce((acc, item) => {
    if (!acc[item.shopId]) acc[item.shopId] = { shopName: item.shopName, items: [] };
    acc[item.shopId].items.push(item);
    return acc;
  }, {});

  if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>🔄 Loading cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1rem' }}>Continue Shopping 🛍️</button>
      </div>
    );
  }

  return (
    <div className="container animate-slide-up" style={{ padding: '1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #2c3e50, #a0d1f2)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginBottom: '2rem' }}>🛒 Your Cart</h1>
      {Object.values(grouped).map(shopGroup => (
        <div key={shopGroup.shopId} className="cart-group" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '1rem', borderLeft: '5px solid #a0d1f2', paddingLeft: '0.8rem' }}>📦 {shopGroup.shopName}</h3>
          {shopGroup.items.map(item => <CartItem key={item.id} item={item} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemove} />)}
        </div>
      ))}
      <div style={{ textAlign: 'right' }}>
        <button className="btn-primary" style={{ padding: '0.8rem 2rem' }} onClick={() => navigate('/checkout', { state: { cartItems } })}>Proceed to Checkout → 💳</button>
      </div>
    </div>
  );
}
