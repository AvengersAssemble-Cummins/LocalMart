export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      borderBottom: '1px solid #f1f5f9',
      backgroundColor: 'white'
    }}>
      <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'cover' }} />
      <div style={{ flex: 1 }}>
        <h4 style={{ fontWeight: 'bold' }}>{item.name}</h4>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>₹{item.price}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="qty-btn">-</button>
        <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)} className="qty-btn">+</button>
      </div>
      <button onClick={() => onRemove(item.productId)} style={{
        background: 'none',
        border: 'none',
        color: '#ef4444',
        cursor: 'pointer',
        fontSize: '1.2rem'
      }}>🗑️</button>
    </div>
  );
}
