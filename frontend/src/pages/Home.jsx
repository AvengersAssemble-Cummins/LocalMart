import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import CategoryCard, { CategoryCardSkeleton } from '../components/CategoryCard.jsx';
import { productService, categoryService } from '../services/api.js';
import { banners } from '../data/dummyData.js';
import './Home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [cats, prods] = await Promise.all([
          categoryService.getAll(),
          productService.getAll(),
        ]);
        setCategories(cats);
        // Backend returns ResponseEntity<List<Product>>, which axios maps to res.data
        setProducts(prods.data || prods);
      } catch (e) {
        console.error("Home load failed", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveBanner(b => (b + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const banner = banners[activeBanner];

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-banner" style={{ background: banner.bg }} key={activeBanner}>
          <div className="container hero-inner">
            <div className="hero-content">
              <span className="hero-badge">{banner.badge}</span>
              <h1 className="hero-title">{banner.title}</h1>
              <p className="hero-subtitle">{banner.subtitle}</p>
              <span className="hero-offer">{banner.offer}</span>
              <div style={{ marginTop: '1rem' }}>
                <Link to="/products" className="hero-cta">{banner.cta} →</Link>
              </div>
            </div>
            <div className="hero-emoji">{banner.image}</div>
          </div>
          <div className="hero-dots">
            {banners.map((_, i) => (
              <button key={i} className={`hero-dot ${i === activeBanner ? 'active' : ''}`} onClick={() => setActiveBanner(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Strip */}
      <div className="delivery-strip">
        <div className="container delivery-strip-inner">
          {[
            { icon: '🚀', label: '10-min delivery' },
            { icon: '🌿', label: 'Fresh & Organic' },
            { icon: '💰', label: 'Best Prices' },
            { icon: '🔒', label: 'Safe Payments' },
            { icon: '↩️', label: 'Easy Returns' },
          ].map(item => (
            <div className="strip-item" key={item.label}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '0 1rem 4rem' }}>
        {/* Categories Section */}
        <section style={{ marginBottom: '3rem' }}>
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/products">View all →</Link>
          </div>
          {error && <div style={{ color: '#e65100', background: '#fff3e0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>⚠️ Connection failed. Showing demo mode.</div>}
          <div className="categories-grid">
            {loading ? Array(4).fill(0).map((_, i) => <CategoryCardSkeleton key={i} />) : 
             categories.map((c, i) => <CategoryCard key={c.id || i} category={{ ...c, image: banners[i % banners.length].image }} />)}
          </div>
        </section>

        {/* Promo Grid */}
        <section className="promo-grid">
          <div className="promo-card blue">
            <div className="promo-text">
              <span className="promo-tag">🎉 New User Offer</span>
              <h3>Get ₹100 OFF</h3>
              <p>on your first order above ₹299</p>
              <Link to="/login" className="promo-btn">Claim Now</Link>
            </div>
            <div className="promo-emoji">🎁</div>
          </div>
          <div className="promo-card green">
            <div className="promo-text">
              <span className="promo-tag">🌿 Health Week</span>
              <h3>Organic Picks</h3>
              <p>Fresh from farm, no chemicals</p>
              <Link to="/products?category=Vegetables" className="promo-btn">Shop Now</Link>
            </div>
            <div className="promo-emoji">🥗</div>
          </div>
        </section>

        {/* Popular Products */}
        <section style={{ marginBottom: '3rem' }}>
          <div className="section-header">
            <h2>🔥 Popular Products</h2>
            <Link to="/products">See all →</Link>
          </div>
          <div className="products-grid">
            {loading ? <p>Loading products...</p> : products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
