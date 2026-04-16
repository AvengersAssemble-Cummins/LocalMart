import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Phone, Package, ArrowLeft, ShoppingBag } from 'lucide-react';
import { orderAPI } from '../services/api.js';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getById(orderId);
      setOrder(res.data);
    } catch (err) {
      console.error('Failed to fetch order', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  if (!order) return (
    <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
      <h2>Order not found</h2>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontWeight: '600', marginBottom: '2rem' }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', backgroundColor: '#f0f9ff', color: '#0ea5e9', marginBottom: '1.5rem' }}>
              <CheckCircle size={48} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>Order Confirmed!</h1>
            <p style={{ color: '#64748b' }}>Order ID: <span style={{ fontWeight: '700', color: '#1e293b' }}>#{orderId}</span></p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             {/* Status Steps */}
             <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 2rem' }}>
                <div style={{ position: 'absolute', top: '15px', left: '15%', right: '15%', height: '2px', background: '#f1f5f9', zIndex: 0 }}></div>
                {[
                  { label: 'Confirmed', done: true },
                  { label: 'Preparing', done: order?.status !== 'PENDING' },
                  { label: 'On the way', done: order?.status === 'DELIVERED' },
                  { label: 'Delivered', done: order?.status === 'DELIVERED' }
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: step.done ? '#0ea5e9' : 'white', 
                      border: '2px solid ' + (step.done ? '#0ea5e9' : '#e2e8f0'),
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: step.done ? 'white' : '#cbd5e1'
                    }}>
                      {step.done ? <CheckCircle size={16} /> : i+1}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: step.done ? '#1e293b' : '#94a3b8' }}>{step.label}</span>
                  </div>
                ))}
             </div>

             <div style={{ height: '1px', background: '#f1f5f9' }}></div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '24px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><MapPin size={18} color="#0ea5e9" /> Delivery to</h4>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>{order.address}</p>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '24px' }}>
                   <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><ShoppingBag size={18} color="#0ea5e9" /> Store Details</h4>
                   <p style={{ fontWeight: '800', margin: 0 }}>{order.shopName || 'Local Shop'}</p>
                   <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Store ID: {order.shopId}</p>
                </div>
             </div>

             {order.paymentMethod === 'PREPAID' && order.status === 'PENDING' && (
               <button className="btn-primary" style={{ padding: '1rem', borderRadius: '16px', background: '#10b981' }}>
                 Pay ₹{order.totalAmount} Now
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
