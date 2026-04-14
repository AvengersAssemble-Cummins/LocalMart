import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, Store, Clock, Heart } from 'lucide-react'
import { authAPI } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const res = await authAPI.login(formData.email, formData.password)
      localStorage.setItem('localmart_token', res.data.token || 'demo-token')
      localStorage.setItem('localmart_user', JSON.stringify(res.data.user || { name: 'User' }))
      navigate('/discover')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left illustration panel */}
      <div className="auth-illustration">
        <h1>Welcome Back!</h1>
        <p>Sign in to discover trusted local shops and fresh products near you.</p>

        <div className="feature-list">
          <div className="feature-item">
            <div className="feature-icon">
              <Store size={18} />
            </div>
            <span>Browse shops in your neighbourhood</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <ShieldCheck size={18} />
            </div>
            <span>Verified & trusted shop owners</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <Clock size={18} />
            </div>
            <span>Full expiry transparency on products</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <Heart size={18} />
            </div>
            <span>Support your local businesses</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          <h2 className="logo">
            Local<span>Mart</span>
          </h2>
          <p className="subtitle">Sign in to your account</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="password-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: '1.25rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider">or</div>

          <div className="auth-link">
            Don't have an account?{' '}
            <Link to="/signup">Create one now</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
