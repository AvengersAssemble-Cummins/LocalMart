import { ShieldCheck } from 'lucide-react'

export default function TrustBadge() {
  return (
    <div className="trust-badge">
      <ShieldCheck size={12} />
      <span>Verified</span>
    </div>
  )
}
