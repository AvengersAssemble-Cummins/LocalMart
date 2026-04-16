import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Home from './pages/Home.jsx';
import ShopDiscovery from './pages/ShopDiscovery.jsx';
import ShopDetailPage from './pages/ShopDetailPage.jsx';
import ProductListingPage from './pages/ProductListingPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/discover" element={<ShopDiscovery />} />
        <Route path="/shop/:id" element={<ShopDetailPage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:orderId" element={<OrderTrackingPage />} />
      </Routes>
    </>
  );
}
export default App;
