import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, ShieldCheck, ArrowLeft, Plus, Minus, Store } from 'lucide-react';
import { productService, cartAPI, getCurrentUserId } from '../services/api.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    productService.getById(id)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      navigate('/login');
      return;
    }

    setAdding(true);
    try {
      await cartAPI.addToCart({
        userId,
        productId: product.id,
        shopId: product.shopId,
        shopName: product.shopName || 'Local Shop',
        quantity,
        price: product.price,
        productName: product.name,
        category: product.category
      });
      alert('Product added to cart!');
    } catch (err) {
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading product details...</p>
    </div>
  );

  if (!product) return (
    <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <h2>Product not found</h2>
      <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
      <div className="container" style={{ padding: '2rem 1rem 5rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'none', 
            border: 'none', 
            color: '#64748b', 
            fontWeight: '600', 
            cursor: 'pointer',
            marginBottom: '2rem'
          }}
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4rem', 
          backgroundColor: 'white', 
          padding: '3rem', 
          borderRadius: '32px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          border: '1px solid #f1f5f9'
        }}>
          {/* Image Section */}
          <div style={{ 
            backgroundColor: '#f8fafc', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '8rem',
            aspectRatio: '1/1',
            border: '1px solid #f1f5f9'
          }}>
            {product.category === 'Vegetables' ? '🥦' : 
             product.category === 'Fruits' ? '🍎' : 
             product.category === 'Dairy' ? '🥛' : '📦'}
          </div>

          {/* Content Section */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ 
                backgroundColor: '#e0f2fe', 
                color: '#0369a1', 
                padding: '4px 12px', 
                borderRadius: '8px', 
                fontSize: '0.85rem', 
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {product.category}
              </span>
              <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1e293b', marginTop: '0.8rem', marginBottom: '0.5rem' }}>
                {product.name}
              </h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={18} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontWeight: '700', color: '#1e293b' }}>4.8</span>
                  <span style={{ color: '#94a3b8' }}>(120+ reviews)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: '600' }}>
                  <ShieldCheck size={18} /> Price Guaranteed
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>
                ₹{product.price}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '1.1rem', marginLeft: '8px' }}>
                / {product.unit || 'unit'}
              </span>
            </div>

            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              Fresh, high-quality {product.name.toLowerCase()} sourced directly from your trusted local marketplace. 
              Our shop owners ensure that every item meets the LocalMart standard for freshness and value.
            </p>

            <div style={{ 
              backgroundColor: '#f8fafc', 
              padding: '1.5rem', 
              borderRadius: '20px',
              border: '1px solid #f1f5f9',
              marginBottom: '2.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Store size={20} color="#64748b" />
                <div>
                   <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Sold by</p>
                   <Link to={`/shop/${product.shopId}`} style={{ fontWeight: '700', color: '#1e293b', textDecoration: 'none' }}>
                     {product.shopName || 'Local Partner Shop'}
                   </Link>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#f1f5f9', 
                borderRadius: '12px',
                padding: '4px'
              }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ border: 'none', background: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <Minus size={18} />
                </button>
                <span style={{ width: '50px', textAlign: 'center', fontWeight: '800', fontSize: '1.1rem' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ border: 'none', background: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <Plus size={18} />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={adding}
                style={{ 
                  flex: 1, 
                  backgroundColor: '#0ea5e9', 
                  color: 'white', 
                  border: 'none', 
                  padding: '1.1rem', 
                  borderRadius: '16px', 
                  fontWeight: '800', 
                  fontSize: '1rem', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.3)'
                }}
              >
                {adding ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div> : <><ShoppingCart size={20} /> Add to Cart</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
