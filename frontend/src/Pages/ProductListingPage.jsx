import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import FilterSidebar from '../components/FilterSidebar.jsx';
import { productService } from '../services/api.js';

export default function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  const [filters, setFilters] = useState({
    category: new URLSearchParams(location.search).get('category') || '',
    rating: '',
    verified: false
  });

  useEffect(() => {
    Promise.all([
      productService.getAll(),
      productService.getCategories()
    ])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data);
        setCategories(catRes.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...products];
    const searchQuery = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.category?.toLowerCase().includes(searchQuery)
      );
    }

    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    setFilteredProducts(filtered);
  }, [filters, products, location.search]);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
      <div className="spinner"></div>
      <p style={{ fontWeight: '700', color: '#64748b' }}>Loading fresh products...</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>🛒 Fresh Picks</h1>
          <p style={{ color: '#64748b' }}>Discover trusted products from local shops near you</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', alignItems: 'start' }}>
          <aside style={{ position: 'sticky', top: '100px' }}>
            <FilterSidebar filters={filters} onFilterChange={setFilters} categories={categories} />
          </aside>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: '700', color: '#475569' }}>{filteredProducts.length} Products Found</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '3rem' }}>🔍</span>
                <h3 style={{ marginTop: '1rem', fontWeight: '800' }}>No products found</h3>
                <p style={{ color: '#64748b' }}>Try adjusting your filters to find what you're looking for.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
