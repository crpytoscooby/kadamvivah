import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute - Wrapper component that protects routes from unauthenticated access
 * 
 * Usage:
 * <Route path="/profiles" element={<ProtectedRoute><Profiles /></ProtectedRoute>} />
 * 
 * Props:
 * - children: Component to render if authenticated
 * - requireAdmin: If true, also checks for admin role
 */

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};
