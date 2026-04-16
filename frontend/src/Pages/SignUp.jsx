import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api.js';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.signup(formData);
      localStorage.setItem('localmart_user', JSON.stringify(res.data));
      localStorage.setItem('localmart_token', 'logged_in_' + res.data.id);
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join LocalMart and support your local community</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe"
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="user@example.com"
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              placeholder="10 digit number"
              required 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Date of Birth</label>
            <input 
              type="date" 
              required 
              value={formData.dob}
              onChange={e => setFormData({...formData, dob: e.target.value})}
            />
          </div>
          
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Full Address</label>
            <textarea 
              placeholder="Flat no, Building, Area, City"
              required 
              style={{ padding: '0.8rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', minHeight: '80px' }}
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ gridColumn: 'span 2' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
