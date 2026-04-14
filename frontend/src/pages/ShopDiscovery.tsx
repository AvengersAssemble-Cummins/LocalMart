import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import ShopCard from '../components/ShopCard'
import FilterSidebar from '../components/FilterSidebar'
import { shopAPI } from '../services/api'
import { PackageSearch } from 'lucide-react'

interface ShopAddress {
  shopNo?: string
  area?: string
  city?: string
  state?: string
  pincode?: string
}

interface Shop {
  _id?: string
  id?: string
  name: string
  ownerName: string
  email?: string
  phone?: string
  address?: ShopAddress | string
  rating: number
  verified: boolean
  category?: string
  categories?: string[]
}

export default function ShopDiscovery() {
  const [shops, setShops] = useState<Shop[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [filters, setFilters] = useState({
    category: '',
    rating: '',
    verified: false,
  })

  useEffect(() => {
    fetchShops()
    fetchCategories()
  }, [])

  const fetchShops = async () => {
    setLoading(true)
    try {
      const res = await shopAPI.getAll()
      setShops(res.data && res.data.length > 0 ? res.data : [])
    } catch {
      console.error('Failed to fetch shops from backend')
      setShops([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await shopAPI.getCategories()
      setCategories(res.data || [])
    } catch {
      setCategories([])
    }
  }

  // Filter and sort shops
  const filteredShops = useMemo(() => {
    let result = [...shops]

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.ownerName.toLowerCase().includes(q) ||
          (s.category && s.category.toLowerCase().includes(q))
      )
    }

    // Category filter
    if (filters.category) {
      result = result.filter((s) => s.category === filters.category)
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseInt(filters.rating)
      result = result.filter((s) => s.rating >= minRating)
    }

    // Verified filter
    if (filters.verified) {
      result = result.filter((s) => s.verified)
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    return result
  }, [shops, searchQuery, filters, sortBy])

  return (
    <div>
      <Navbar onSearch={setSearchQuery} searchValue={searchQuery} />

      <main className="discovery-page">
        <div className="discovery-header">
          <h1>Discover Local Shops</h1>
          <p>Find trusted shops near you — browse products with full transparency</p>
        </div>

        <div className="discovery-layout">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
          />

          <div>
            <div className="shop-grid-header">
              <span className="result-count">
                {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''} found
              </span>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <span className="loading-text">Loading shops from database...</span>
              </div>
            ) : filteredShops.length === 0 ? (
              <div className="empty-state">
                <PackageSearch size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                <h3>No shops found</h3>
                <p>Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="shop-grid">
                {filteredShops.map((shop, index) => (
                  <ShopCard key={shop._id || shop.id || index} shop={shop} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
