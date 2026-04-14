import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ShopDiscovery from './pages/ShopDiscovery'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/discover" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/discover" element={<ShopDiscovery />} />
    </Routes>
  )
}

export default App
