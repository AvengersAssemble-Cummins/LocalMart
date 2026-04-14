import { Star, MapPin } from 'lucide-react'
import TrustBadge from './TrustBadge'

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
  reviewCount?: number
}

interface ShopCardProps {
  shop: Shop
  index?: number
}

const categoryIcons: Record<string, string> = {
  'Premium Essentials': '⭐',
  'Daily Fresh & Dairy Specialists': '🥛',
  'Wholesale & Grains': '🌾',
  'Neighborhood General Stores': '🏪',
  default: '🏪',
}

const gradients = [
  'linear-gradient(135deg, #a0d1f2 0%, #6ba8d4 100%)',
  'linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #86efac 0%, #22c55e 100%)',
  'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)',
  'linear-gradient(135deg, #67e8f9 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)',
  'linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)',
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= Math.round(rating) ? 'star' : 'star empty'}
          fill={i <= Math.round(rating) ? '#fbbf24' : 'none'}
        />
      ))}
    </div>
  )
}

function formatAddress(address?: ShopAddress | string): string {
  if (!address) return ''
  if (typeof address === 'string') return address
  const parts: string[] = []
  if (address.area) parts.push(address.area)
  if (address.city) parts.push(address.city)
  return parts.join(', ')
}

export default function ShopCard({ shop, index = 0 }: ShopCardProps) {
  // Use category for icon, or default
  const icon = categoryIcons[shop.category || ''] || categoryIcons.default
  const gradient = gradients[index % gradients.length]

  return (
    <div className="shop-card" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="shop-card-placeholder" style={{ background: gradient }}>
        <span className="placeholder-icon">{icon}</span>
        {shop.verified && (
          <div className="shop-card-badge">
            <TrustBadge />
          </div>
        )}
      </div>

      <div className="shop-card-body">
        <h3>{shop.name}</h3>
        <p className="shop-card-owner">by {shop.ownerName}</p>

        <div className="shop-card-meta">
          <div className="shop-card-rating">
            <StarRating rating={shop.rating} />
            <span>{shop.rating?.toFixed(1)}</span>
          </div>
          {shop.category && (
            <span className="shop-card-category">
              {categoryIcons[shop.category] || ''} {shop.category}
            </span>
          )}
        </div>

        {shop.address && (
          <div className="shop-card-address">
            <MapPin size={13} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
            <span>{formatAddress(shop.address)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
