import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, Store, Leaf, Users } from 'lucide-react'
import { authAPI } from '../services/api'

export default function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    address: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const getPasswordStrength = (password: string): { level: number; label: string } => {
    if (!password) return { level: 0, label: '' }
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 2) return { level: 1, label: 'weak' }
    if (score <= 3) return { level: 2, label: 'medium' }
    return { level: 3, label: 'strong' }
  }

  const strength = getPasswordStrength(formData.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await authAPI.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
      })
      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || ''
      if (errorMessage === 'Email already registered') {
        setError('')
        setSuccess("You're already a registered customer, redirecting you to login...")
        setTimeout(() => navigate('/login'), 3000)
      } else {
        setError(errorMessage || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left illustration panel */}
      <div className="auth-illustration">
        <h1>Join LocalMart</h1>
        <p>Create your account and start shopping from trusted local stores in your area.</p>

        <div className="feature-list">
          <div className="feature-item">
            <div className="feature-icon">
              <Store size={18} />
            </div>
            <span>Choose your preferred local shop</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <ShieldCheck size={18} />
            </div>
            <span>100% transparency on product freshness</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <Leaf size={18} />
            </div>
            <span>See expiry dates on every product</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <Users size={18} />
            </div>
            <span>Read reviews from locals in your area</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          <h2 className="logo">
            Local<span>Mart</span>
          </h2>
          <p className="subtitle">Create your free account</p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="signup-name">Full Name *</label>
              <input
                id="signup-name"
                type="text"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email Address *</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="signup-password">Password *</label>
                <div className="password-wrapper">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
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
                {formData.password && (
                  <div className="password-strength">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`strength-bar ${i <= strength.level ? `active ${strength.label}` : ''}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirm">Confirm Password *</label>
                <input
                  id="signup-confirm"
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="signup-phone">Phone Number *</label>
                <input
                  id="signup-phone"
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-dob">Date of Birth</label>
                <input
                  id="signup-dob"
                  type="date"
                  name="dob"
                  className="form-input"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-address">Address</label>
              <input
                id="signup-address"
                type="text"
                name="address"
                className="form-input"
                placeholder="Your delivery address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="divider">or</div>

          <div className="auth-link">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
