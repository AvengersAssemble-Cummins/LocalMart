import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI, getCurrentUserId } from '../services/api.js';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    address: '',
    paymentMethod: 'COD'
  });

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
      navigate('/login');
      return;
    }
    cartAPI.getCart(userId)
      .then(res => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
      
    const userData = localStorage.getItem('localmart_user');
    if (userData) {
      setFormData(prev => ({ ...prev, address: JSON.parse(userData).address || '' }));
    }
  }, [navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const userId = getCurrentUserId();
    if (!userId || !cart || cart.items.length === 0) return;

    try {
      const orderData = {
        userId,
        items: cart.items,
        totalAmount: cart.totalPrice,
        status: 'PENDING',
        paymentMethod: formData.paymentMethod,
        address: formData.address,
        shopId: cart.items[0]?.shopId,
        shopName: cart.items[0]?.shopName
      };

      const res = await orderAPI.createOrder(orderData);
      await cartAPI.clearCart(userId);
      navigate(`/order/${res.data.id}`);
    } catch (err) {
      alert('Failed to place order');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem' }}>Checkout Details</h2>
          <form onSubmit={handlePlaceOrder}>
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #f1f5f9', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Delivery Address</h3>
              <textarea 
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                required
                placeholder="Where should we deliver?"
                style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1.5px solid #e2e8f0', minHeight: '120px' }}
              />
            </div>

            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
               <h3 style={{ marginBottom: '1.5rem' }}>Payment Method</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                    style={{ 
                      padding: '1.5rem', 
                      borderRadius: '20px', 
                      border: formData.paymentMethod === 'COD' ? '2px solid #0ea5e9' : '1.5px solid #e2e8f0',
                      background: formData.paymentMethod === 'COD' ? '#f0f9ff' : 'white',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    💵 Cash on Delivery
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, paymentMethod: 'PREPAID' })}
                    style={{ 
                      padding: '1.5rem', 
                      borderRadius: '20px', 
                      border: formData.paymentMethod === 'PREPAID' ? '2px solid #0ea5e9' : '1.5px solid #e2e8f0',
                      background: formData.paymentMethod === 'PREPAID' ? '#f0f9ff' : 'white',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    🚀 Online Payment
                  </button>
               </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '2rem', width: '100%', padding: '1.5rem', borderRadius: '20px', fontSize: '1.1rem' }}>
              Confirm & Place Order
            </button>
          </form>
        </div>

        <div>
           <div style={{ backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '32px', color: 'white' }}>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Order Review</h3>
              {cart?.items.map(item => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', opacity: 0.9 }}>
                  <span>{item.quantity}x {item.productName}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '900' }}>
                 <span>Total</span>
                 <span>₹{cart?.totalPrice}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
