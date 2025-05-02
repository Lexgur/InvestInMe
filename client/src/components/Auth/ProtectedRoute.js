import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loader from '../Loader';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div><Loader /></div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;