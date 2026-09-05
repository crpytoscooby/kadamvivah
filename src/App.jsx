import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profiles } from './pages/Profiles';
import { ProfileDetail } from './pages/ProfileDetail';
import { Admin } from './pages/Admin';
import { AdminImport } from './pages/AdminImport';
import { ChangePassword } from './pages/ChangePassword';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';

import './App.css';

/**
 * Main App Component
 * 
 * Features:
 * - React Router for navigation
 * - AuthProvider for global authentication state
 * - Protected routes for authenticated-only pages
 * - Admin-only routes
 * - Consistent layout with Navbar and Footer
 */

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Protected routes - require authentication */}
              <Route
                path="/profiles"
                element={
                  <ProtectedRoute>
                    <Profiles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profiles/:id"
                element={
                  <ProtectedRoute>
                    <ProfileDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes - require admin role */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/import"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminImport />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
