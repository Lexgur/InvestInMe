import { useState, useEffect } from 'react';
import axios from 'axios';
import * as C from './constants';
import { useNavigate } from 'react-router-dom';
import AuthContext, { useAuth } from './useAuth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(C.SERVER_URL + 'get-user', { 
          withCredentials: true 
        });

        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
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
        navigate('/dashboard');
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await axios.post(C.URL + '/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
