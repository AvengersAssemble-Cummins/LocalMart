import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { cartAPI, getCurrentUserId } from '../services/api.js';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      navigate('/login');
      return;
    }
    try {
      const res = await cartAPI.getCart(userId);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await cartAPI.updateQuantity(getCurrentUserId(), productId, newQty);
      fetchCart();
    } catch (err) {
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartAPI.removeFromCart(getCurrentUserId(), productId);
      fetchCart();
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 1rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Your cart is lonely</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Add some fresh items from local shops to get started!</p>
        <Link to="/products" className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '16px' }}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)', padding: '3rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '2rem' }}>Shopping Cart</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.items.map(item => (
              <div key={item.productId} style={{ 
                backgroundColor: 'white', 
                padding: '1.5rem', 
                borderRadius: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.5rem',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '16px', 
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem'
                }}>
                   {item.category === 'Vegetables' ? '🥦' : '📦'}
                </div>
                
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {item.shopName}
                  </p>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>{item.productName}</h3>
                  <p style={{ fontWeight: '700', color: '#0ea5e9' }}>₹{item.price}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f1f5f9', padding: '6px', borderRadius: '12px' }}>
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} style={{ border: 'none', background: 'white', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><Minus size={16} /></button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: '800' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} style={{ border: 'none', background: 'white', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><Plus size={16} /></button>
                </div>

                <button onClick={() => removeItem(item.productId)} style={{ border: 'none', background: 'none', color: '#ef4444', padding: '10px', cursor: 'pointer' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Card */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Order Summary</h3>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Subtotal</span>
                    <span>₹{cart.totalPrice}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Delivery Fee</span>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>FREE</span>
                  </div>
                  <div style={{ height: '1px', background: '#f1f5f9', margin: '0.5rem 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: '900', color: '#1e293b' }}>
                    <span>Total</span>
                    <span>₹{cart.totalPrice}</span>
                  </div>
               </div>

               <Link to="/checkout" className="btn-primary" style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                 Proceed to Checkout <ArrowRight size={20} />
               </Link>

               <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.85rem', justifyContent: 'center', fontWeight: '600' }}>
                 <ShieldCheck size={16} /> Secure Checkout by LocalMart
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
