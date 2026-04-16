import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';
import { getCurrentUserId } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!getCurrentUserId();

  const handleSearch = (query) => {
    const params = new URLSearchParams(location.search);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    
    // If not on products or discover page, go to products page for search results
    if (location.pathname !== '/products' && location.pathname !== '/discover') {
      navigate(`/products?${params.toString()}`);
    } else {
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  };

  const currentQuery = new URLSearchParams(location.search).get('q') || '';

  return (
    <nav className="navbar" style={{ backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1.5px solid #f1f5f9', padding: '0.8rem 0' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
        <Link to="/" className="logo" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: '900', color: '#1e293b' }}>
          Local<span style={{ color: '#7bb3d4' }}>Mart</span>
        </Link>

        <div className="search-container" style={{ flex: 1, margin: '0 2rem', position: 'relative', maxWidth: '600px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '12px', border: '1.5px solid #f1f5f9', backgroundColor: '#f8fafc', fontSize: '0.9rem' }} 
            placeholder="Search shops, products..." 
            value={currentQuery} 
            onChange={e => handleSearch(e.target.value)} 
          />
        </div>

          <div className="navbar-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/products" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: '700' }}>Products</Link>
          <Link to="/discover" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: '700' }}>Shops</Link>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '1rem' }}>
            {isLoggedIn ? (
              <>
                <Link to="/cart" className="nav-icon-btn" style={{ textDecoration: 'none', padding: '8px 12px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
                  <ShoppingCart size={18} /> Cart
                </Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('localmart_user');
                    localStorage.removeItem('localmart_token');
                    window.location.href = '/';
                  }} 
                  className="nav-icon-btn" 
                  style={{ border: 'none', cursor: 'pointer', textDecoration: 'none', padding: '8px 12px', borderRadius: '10px', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}
                >
                  <User size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none', color: '#0ea5e9', fontWeight: '700', padding: '8px 16px', borderRadius: '10px' }}>Sign In</Link>
                <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', borderRadius: '10px', border: 'none', fontSize: '0.9rem', width: 'auto' }}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
