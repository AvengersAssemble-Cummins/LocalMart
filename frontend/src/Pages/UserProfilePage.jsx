import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, LogOut, Package } from 'lucide-react';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('localmart_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('localmart_user');
    localStorage.removeItem('localmart_token');
    navigate('/');
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)', padding: '4rem 1rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ 
               backgroundColor: 'white', 
               padding: '2.5rem', 
               borderRadius: '32px', 
               textAlign: 'center',
               border: '1px solid #f1f5f9'
             }}>
               <div style={{ 
                 width: '120px', 
                 height: '120px', 
                 borderRadius: '50%', 
                 backgroundColor: '#e0f2fe',
                 color: '#0369a1',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '3rem',
                 margin: '0 auto 1.5rem',
                 fontWeight: '800'
               }}>
                 {user.name.charAt(0).toUpperCase()}
               </div>
               <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.3rem' }}>{user.name}</h2>
               <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>LocalMart Member</p>
               
               <button 
                onClick={handleLogout}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '16px', 
                  border: 'none', 
                  backgroundColor: '#fee2e2', 
                  color: '#b91c1c', 
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
               >
                 <LogOut size={18} /> Logout
               </button>
             </div>

             <div style={{ 
               backgroundColor: 'white', 
               padding: '1.5rem', 
               borderRadius: '24px', 
               border: '1px solid #f1f5f9'
             }}>
                <button style={{ width: '100%', textAlign: 'left', padding: '12px', borderRadius: '12px', border: 'none', background: '#f8fafc', marginBottom: '8px', fontWeight: '700', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={18} /> Profile Details
                </button>
                <button style={{ width: '100%', textAlign: 'left', padding: '12px', borderRadius: '12px', border: 'none', background: 'transparent', marginBottom: '8px', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Package size={18} /> My Orders
                </button>
             </div>
          </div>

          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem' }}>Personal Information</h3>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="info-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                      <Mail size={14} /> Email Address
                    </label>
                    <p style={{ fontWeight: '600', color: '#1e293b' }}>{user.email}</p>
                  </div>
                  <div className="info-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                      <Phone size={14} /> Phone Number
                    </label>
                    <p style={{ fontWeight: '600', color: '#1e293b' }}>{user.phone || 'Not provided'}</p>
                  </div>
                  <div className="info-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                      <Calendar size={14} /> Date of Birth
                    </label>
                    <p style={{ fontWeight: '600', color: '#1e293b' }}>{user.dob || 'Not provided'}</p>
                  </div>
                  <div className="info-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                      <MapPin size={14} /> Default Address
                    </label>
                    <p style={{ fontWeight: '600', color: '#1e293b' }}>{user.address || 'Not provided'}</p>
                  </div>
               </div>

               <button style={{ marginTop: '3rem', padding: '1rem 2rem', borderRadius: '16px', border: 'none', backgroundColor: '#f1f5f9', color: '#1e293b', fontWeight: '800', cursor: 'pointer' }}>
                 Edit Profile Settings
               </button>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)', 
              padding: '2.5rem', 
              borderRadius: '32px', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
               <div style={{ position: 'relative', zIndex: 1 }}>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>LocalMart Prime</h3>
                 <p style={{ opacity: 0.9, marginBottom: '1.5rem', maxWidth: '300px' }}>Get unlimited free delivery and exclusive member-only pricing.</p>
                 <button style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', backgroundColor: 'white', color: '#0369a1', fontWeight: '800', cursor: 'pointer' }}>
                   Upgrade Now
                 </button>
               </div>
               <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '8rem', opacity: 0.2 }}>🌟</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
