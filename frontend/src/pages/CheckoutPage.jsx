import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getCurrentUserId, orderService } from '../services/api';

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const userId = getCurrentUserId();

  const { cartItems } = state || {
    cartItems: [{ id: "demo-1", name: "Sample Item", price: 29, quantity: 1, imageUrl: "🥛" }]
  };

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState('Cummins College of Engineering, Karve Nagar, Pune');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [loading, setLoading] = useState(false);

  const itemTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = itemTotal > 199 ? 0 : 9;
  const totalToPay = itemTotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'CARD' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      alert("Please fill in all card details");
      return;
    }
    
    setLoading(true);
    try {
      const order = {
        userId: userId,
        items: cartItems.map(item => ({
          productId: item.productId || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          shopId: item.shopId,
          shopName: item.shopName
        })),
        totalAmount: totalToPay,
        status: 'PLACED',
        paymentMethod: paymentMethod, // passing payment method
        address: address // passing address
      };
      
      const res = await orderService.create(order);
      
      // Clear the cart
      await Promise.all(cartItems.map(item => 
        import('../services/api').then(mod => mod.cartService.remove(userId, item.productId || item.id))
      ));

      const placedOrder = res.data;
      navigate(`/order/${placedOrder.id}`);
    } catch (err) {
      console.error('Order creation failed', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, #a0d1f2 0%, #ffffff 100%)', minHeight: '100vh', padding: '1.5rem 1rem' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#0369a1', marginBottom: '1rem', cursor: 'pointer' }}>&larr; Back to Cart</button>
      <h2 style={{ fontWeight: '800', marginBottom: '1.5rem', fontSize: '1.5rem', color: '#1e293b' }}>Checkout</h2>

      {/* Address Section */}
      <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        {isEditingAddress ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', fontFamily: 'inherit' }}
              rows="2"
            />
            <button className="btn-primary" onClick={() => setIsEditingAddress(false)} style={{ alignSelf: 'flex-end', padding: '0.4rem 1.2rem' }}>Save Address</button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: '700', fontSize: '0.95rem', margin: '0 0 4px 0', color: '#1e293b' }}>📍 Delivery Address</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>{address}</p>
            </div>
            <button onClick={() => setIsEditingAddress(true)} style={{ color: '#7bb3d4', fontWeight: 'bold', fontSize: '0.9rem', border: 'none', background: 'none', cursor: 'pointer' }}>Change</button>
          </div>
        )}
      </div>

      {/* Bill Summary */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: '800', fontSize: '1.1rem', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>📋 Bill Summary</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
            <span>Item Total</span>
            <span style={{ fontWeight: '700', color: '#1e293b' }}>₹{itemTotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Delivery Fee</span>
              <small style={{ color: '#7bb3d4', fontSize: '0.75rem', fontWeight: '700' }}>Free above ₹199</small>
            </div>
            <span style={{ fontWeight: '700', color: '#1e293b' }}>₹{deliveryFee}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
            <span style={{ color: '#475569' }}>Handling Fee</span>
            <span style={{ color: '#10b981', fontWeight: '800' }}>FREE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', fontSize: '1.2rem' }}>
            <span style={{ fontWeight: '800', color: '#1e293b' }}>To Pay</span>
            <span style={{ fontWeight: '800', color: '#10b981' }}>₹{totalToPay}</span>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <h4 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '1.25rem', marginTop: 0 }}>💳 Payment Options</h4>
        
        <PaymentRow icon="💳" label="Credit / Debit Cards" selected={paymentMethod === 'CARD'} onClick={() => setPaymentMethod('CARD')} />
        {paymentMethod === 'CARD' && (
          <div style={{ marginTop: '12px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Card Number" maxLength="16" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input placeholder="MM/YY" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} />
              <input placeholder="CVV" type="password" maxLength="3" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }} onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} />
            </div>
          </div>
        )}

        <div style={{ margin: '1rem 0' }}>
          <PaymentRow icon="🅿️" label="Paytm / UPI" onClick={() => setPaymentMethod('PAYTM')} selected={paymentMethod === 'PAYTM'} />
          <PaymentRow icon="💵" label="Cash On Delivery" selected={paymentMethod === 'COD'} onClick={() => setPaymentMethod('COD')} />
        </div>
      </div>

      <button 
        onClick={handlePlaceOrder} 
        disabled={!paymentMethod} 
        className="btn-primary"
        style={{ 
          marginTop: '2rem', 
          width: '100%', 
          padding: '1.1rem', 
          borderRadius: '16px', 
          fontWeight: '800', 
          fontSize: '1.1rem',
          opacity: paymentMethod ? 1 : 0.6
        }}>
        {paymentMethod === 'CARD' ? 'Secure Pay & Order' : 'Place Order'} • ₹{totalToPay}
      </button>
    </div>
  );
}

function PaymentRow({ icon, label, selected, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 12px', cursor: 'pointer', borderRadius: '12px', backgroundColor: selected ? '#f0f9ff' : 'transparent', border: selected ? '1px solid #7bb3d4' : '1px solid transparent', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', backgroundColor: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>{icon}</div>
        <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>{label}</span>
      </div>
      <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${selected ? '#7bb3d4' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selected && <div style={{ width: '12px', height: '12px', backgroundColor: '#7bb3d4', borderRadius: '50%' }} />}
      </div>
    </div>
  );
}
