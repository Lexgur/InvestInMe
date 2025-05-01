import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from './useAuth';
import Loader from './Loader';
import * as C from './constants';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(C.SERVER_URL + 'get-user', {
          withCredentials: true,
        });

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(C.URL + C.LOGIN_PAGE, {
        email,
        password,
      }, { withCredentials: true });

      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post(C.URL + 'logout', {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <Loader />; // You can also return a skeleton screen or some loading state here
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
