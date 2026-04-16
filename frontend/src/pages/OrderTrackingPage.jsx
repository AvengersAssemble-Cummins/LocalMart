import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  const steps = [
    { id: 'PLACED', label: 'Order Placed', sub: 'We have received your order' },
    { id: 'PROCESSING', label: 'Processing', sub: 'Your order is being packed' },
    { id: 'SHIPPED', label: 'Shipped', sub: 'Your item is on the way' },
    { id: 'DELIVERED', label: 'Delivered', sub: 'Package has arrived' }
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { orderService } = await import('../services/api');
        const res = await orderService.getById(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order', err);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!order) return <div style={{ padding: '3rem', textAlign: 'center' }}>🔄 Finding your order...</div>;

  const currentStepIndex = steps.findIndex(s => s.id === order.status);

  return (
    <div style={{ background: 'linear-gradient(180deg, #a0d1f2 0%, #ffffff 100%)', minHeight: '100vh', padding: '1.5rem 1rem' }}>
      <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginBottom: '1rem' }}>&larr;</button>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: '800', fontSize: '1.5rem', margin: 0 }}>📍 Track Order</h2>
        <p style={{ color: '#0369a1', fontSize: '0.9rem', marginTop: '0.4rem', fontWeight: '700' }}>Order ID: #{orderId}</p>
      </div>

      {/* Status Timeline */}
      <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem 1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', backgroundColor: '#f1f5f9', zIndex: 0 }}></div>
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isActive = index === currentStepIndex;
            return (
              <div key={step.id} style={{ display: 'flex', gap: '1.5rem', zIndex: 1, alignItems: 'start' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  backgroundColor: isCompleted ? '#10b981' : 'white',
                  border: `2px solid ${isCompleted ? '#10b981' : '#e2e8f0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: isActive ? '0 0 0 4px #d1fae5' : 'none'
                }}>
                  {isCompleted && <span style={{ color: 'white', fontSize: '10px' }}>✓</span>}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: '800', color: isCompleted ? '#1e293b' : '#94a3b8', fontSize: isActive ? '1.1rem' : '1rem' }}>{step.label}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: isCompleted ? '#64748b' : '#cbd5e1' }}>{step.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: '800', color: '#64748b' }}>🏠 Delivering to</p>
        <p style={{ margin: 0, fontWeight: '700', color: '#1e293b', lineHeight: '1.4' }}>{order.address}</p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '1rem' }}>🛍️ Summary</h3>
        {order.items?.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#475569', fontSize: '0.95rem' }}>
            <span>{item.quantity} x {item.name}</span>
            <span style={{ fontWeight: '700', color: '#1e293b' }}>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px dashed #f1f5f9' }}>
          <span style={{ fontWeight: '800' }}>To Pay</span>
          <span style={{ fontWeight: '800', color: '#10b981', fontSize: '1.2rem' }}>₹{order.totalAmount || order.total}</span>
        </div>
        {(order.paymentMethod === 'CARD' || order.paymentMethod === 'PAYTM') && order.status !== 'DELIVERED' && (
          <button 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              marginTop: '1rem', 
              padding: '1rem', 
              borderRadius: '12px', 
              fontWeight: '800', 
              fontSize: '1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={() => alert('Redirecting to secure payment gateway...')}
          >
            💳 Pay ₹{order.totalAmount || order.total} Now
          </button>
        )}
      </div>
    </div>
  );
}
