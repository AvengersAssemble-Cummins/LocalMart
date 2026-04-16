import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import SignUp from './Pages/SignUp.jsx';
import Home from './Pages/Home.jsx';
import ShopDiscovery from './Pages/ShopDiscovery.jsx';
import ShopDetailPage from './Pages/ShopDetailPage.jsx';
import ProductListingPage from './Pages/ProductListingPage.jsx';
import ProductDetailPage from './Pages/ProductDetailPage.jsx';
import CartPage from './Pages/CartPage.jsx';
import UserProfilePage from './Pages/UserProfilePage.jsx';
import CheckoutPage from './Pages/CheckoutPage.jsx';
import OrderTrackingPage from './Pages/OrderTrackingPage.jsx';
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
