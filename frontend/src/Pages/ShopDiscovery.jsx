import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ShopCard from '../components/ShopCard.jsx';
import FilterSidebar from '../components/FilterSidebar.jsx';
import { shopAPI } from '../services/api.js';
import { PackageSearch } from 'lucide-react';

export default function ShopDiscovery() {
  const location = useLocation();
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [filters, setFilters] = useState({
    category: '',
    rating: '',
    verified: false
  });
  useEffect(() => {
    fetchShops();
    fetchCategories();
  }, []);
  const fetchShops = async () => {
    setLoading(true);
    try {
      const res = await shopAPI.getAll();
      setShops(res.data && res.data.length > 0 ? res.data : []);
    } catch {
      console.error('Failed to fetch shops from backend');
      setShops([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await shopAPI.getCategories();
      setCategories(res.data || []);
    } catch {
      setCategories([]);
    }
  };

  // Filter and sort shops
  const filteredShops = useMemo(() => {
    let result = [...shops];
    const searchQuery = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';

    // Search
    if (searchQuery) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(searchQuery) || 
        s.ownerName.toLowerCase().includes(searchQuery) || 
        (s.category && s.category.toLowerCase().includes(searchQuery))
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(s => s.category === filters.category);
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseInt(filters.rating);
      result = result.filter(s => s.rating >= minRating);
    }

    // Verified filter
    if (filters.verified) {
      result = result.filter(s => s.verified);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return result;
  }, [shops, location.search, filters, sortBy]);
  return (
    <main className="discovery-page">
      <div className="discovery-header">
        <h1>Discover Local Shops</h1>
        <p>Find trusted shops near you — browse products with full transparency</p>
      </div>

      <div className="discovery-layout">
        <FilterSidebar filters={filters} onFilterChange={setFilters} categories={categories} />

        <div>
          <div className="shop-grid-header">
            <span className="result-count">
              {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''} found
            </span>
            <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="rating">Sort by Rating</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          {loading ? <div className="loading-container">
              <div className="spinner"></div>
              <span className="loading-text">Loading shops from database...</span>
            </div> : filteredShops.length === 0 ? <div className="empty-state">
              <PackageSearch size={48} style={{
            marginBottom: '1rem',
            opacity: 0.4
          }} />
              <h3>No shops found</h3>
              <p>Try adjusting your filters or search query</p>
            </div> : <div className="shop-grid">
              {filteredShops.map((shop, index) => <ShopCard key={shop._id || shop.id || index} shop={shop} index={index} />)}
            </div>}
        </div>
      </div>
    </main>
  );
}
