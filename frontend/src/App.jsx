import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import OrderPage from './pages/OrderPage';
import ServicePage from './pages/ServicePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import AdminHistory from './pages/AdminHistory';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/service" element={<ServicePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/history"
                element={
                  <ProtectedRoute>
                    <AdminHistory />
                  </ProtectedRoute>
                }
              />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
