import { Link, useLocation } from 'react-router-dom'
import { Search, MapPin, ShoppingCart, User } from 'lucide-react'

interface NavbarProps {
  onSearch?: (query: string) => void
  searchValue?: string
}

export default function Navbar({ onSearch, searchValue }: NavbarProps) {
  const location = useLocation()
  const isLoggedIn = !!localStorage.getItem('localmart_token')

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/discover" className="logo" style={{ textDecoration: 'none' }}>
          Local<span>Mart</span>
        </Link>

        {location.pathname === '/discover' && (
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search shops, products..."
              value={searchValue || ''}
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        )}

        <div className="navbar-actions">
          <button className="nav-btn">
            <MapPin size={16} />
            <span>Location</span>
          </button>

          {isLoggedIn ? (
            <>
              <button className="nav-btn">
                <ShoppingCart size={16} />
              </button>
              <button className="nav-btn">
                <User size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button className="nav-btn">Sign In</button>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <button className="nav-btn nav-btn-primary">Get Started</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
