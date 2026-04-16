import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Clock, ShieldCheck, ShoppingBag, Info, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import TrustBadge from '../components/TrustBadge.jsx';
import { shopAPI, productService } from '../services/api.js';

export default function ShopDetailPage() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopRes, productsRes] = await Promise.all([
          shopAPI.getById(id),
          productService.getByShopId(id)
        ]);
        setShop(shopRes.data);
        setProducts(productsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading shop details...</p>
    </div>
  );

  if (!shop) return (
    <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <h2>Shop not found</h2>
      <Link to="/discover" className="btn-primary">Back to Search</Link>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Shop Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
            <div style={{ 
              width: '180px', 
              height: '180px', 
              borderRadius: '24px', 
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}>
              🏪
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>{shop.name}</h1>
                {shop.verified && <ShieldCheck color="#0ea5e9" fill="#e0f2fe" size={28} />}
              </div>
              
              <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1.5rem', maxWidth: '600px' }}>
                Managed by <span style={{ fontWeight: '700', color: '#1e293b' }}>{shop.ownerName}</span> • 
                Serving your neighborhood with quality {shop.category?.toLowerCase() || 'goods'}.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.95rem' }}>
                  <MapPin size={18} color="#94a3b8" /> {shop.address || 'Local Neighborhood'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.95rem' }}>
                  <Star size={18} color="#f59e0b" fill="#f59e0b" /> {shop.rating} / 5.0 Rating
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.95rem' }}>
                  <Phone size={18} color="#94a3b8" /> {shop.phone || 'Contact shop'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          borderBottom: '2px solid #e2e8f0', 
          marginBottom: '2rem'
        }}>
          <button 
            onClick={() => setActiveTab('products')}
            style={{ 
              padding: '1rem 0.5rem', 
              border: 'none', 
              background: 'none', 
              fontSize: '1rem', 
              fontWeight: '700',
              color: activeTab === 'products' ? '#0ea5e9' : '#64748b',
              borderBottom: activeTab === 'products' ? '3px solid #0ea5e9' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            Available Products ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            style={{ 
              padding: '1rem 0.5rem', 
              border: 'none', 
              background: 'none', 
              fontSize: '1rem', 
              fontWeight: '700',
              color: activeTab === 'about' ? '#0ea5e9' : '#64748b',
              borderBottom: activeTab === 'about' ? '3px solid #0ea5e9' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            About & Reviews
          </button>
        </div>

        {activeTab === 'products' ? (
          <div>
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <ShoppingBag size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#64748b' }}>No products listed yet</h3>
                <p>Check back later for fresh updates from this shop.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', paddingBottom: '4rem' }}>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', paddingBottom: '4rem' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
               <h3>Shop Verification Details</h3>
               <p style={{ color: '#64748b', margin: '1rem 0' }}>This shop has been manually verified by the LocalMart team to ensure authentic pricing and quality standards.</p>
               <TrustBadge type="verified" />
               <TrustBadge type="speed" />
               <TrustBadge type="quality" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                  <Clock size={20} color="#0ea5e9" />
                  <h4 style={{ margin: 0 }}>Business Hours</h4>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Mon - Sat</span>
                    <span style={{ fontWeight: '700' }}>9:00 AM - 9:00 PM</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Sunday</span>
                    <span style={{ fontWeight: '700', color: '#ef4444' }}>Closed</span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #bae6fd' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#0369a1' }}>Contact Shop</h4>
                <p style={{ fontSize: '0.85rem', color: '#075985', marginBottom: '1rem' }}>Need special bulk pricing or have questions about delivery?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href={`tel:${shop.phone}`} style={{ textDecoration: 'none', color: '#0369a1', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} /> Call Store
                  </a>
                  <a href={`mailto:${shop.email}`} style={{ textDecoration: 'none', color: '#0369a1', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} /> Send Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
