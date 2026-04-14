import { SlidersHorizontal, RotateCcw } from 'lucide-react'

interface FilterState {
  category: string
  rating: string
  verified: boolean
}

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  categories?: string[]
}

const defaultCategories = [
  'Grocery',
  'Pharmacy',
  'Bakery',
  'Electronics',
  'Clothing',
  'Vegetables',
  'Fruits',
  'Dairy',
  'Stationery',
  'Hardware',
]

export default function FilterSidebar({ filters, onFilterChange, categories }: FilterSidebarProps) {
  const categoryList = categories && categories.length > 0 ? categories : defaultCategories

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category: category === 'All' ? '' : category })
  }

  const handleRatingChange = (rating: string) => {
    onFilterChange({ ...filters, rating })
  }

  const handleVerifiedToggle = () => {
    onFilterChange({ ...filters, verified: !filters.verified })
  }

  const resetFilters = () => {
    onFilterChange({ category: '', rating: '', verified: false })
  }

  return (
    <aside className="filter-sidebar">
      <h3>
        <SlidersHorizontal size={18} />
        Filters
      </h3>

      {/* Category Filter */}
      <div className="filter-section">
        <h4>Category</h4>
        <label className="filter-option">
          <input
            type="radio"
            name="category"
            checked={filters.category === ''}
            onChange={() => handleCategoryChange('All')}
          />
          All
        </label>
        {categoryList.map((cat) => (
          <label key={cat} className="filter-option">
            <input
              type="radio"
              name="category"
              checked={filters.category === cat}
              onChange={() => handleCategoryChange(cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      {/* Rating Filter */}
      <div className="filter-section">
        <h4>Minimum Rating</h4>
        {['4', '3', '2', '1'].map((r) => (
          <label key={r} className="filter-option">
            <input
              type="radio"
              name="rating"
              checked={filters.rating === r}
              onChange={() => handleRatingChange(r)}
            />
            {r}+ Stars
          </label>
        ))}
      </div>

      {/* Verified Filter */}
      <div className="filter-section">
        <h4>Trust</h4>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.verified}
            onChange={handleVerifiedToggle}
          />
          Verified shops only
        </label>
      </div>

      <button className="filter-btn-reset" onClick={resetFilters}>
        <RotateCcw size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
        Reset Filters
      </button>
    </aside>
  )
}
