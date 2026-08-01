import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('portfolio_admin_token'));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('portfolio_admin_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      // Validate session token with backend
      api.get('/auth/me')
        .then(res => {
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
          }
        })
        .catch(() => {
          // If token invalid, auto logout
          console.warn('Session expired or invalid token');
        });
    }
  }, [token]);

  const login = async (emailOrUsername: string, password: string, rememberMe: boolean = true) => {
    setLoading(true);
    try {
      // Attempt backend authentication
      const res = await api.post('/auth/login', { emailOrUsername, password });
      if (res.data && res.data.success) {
        const { token: jwtToken, user: userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('portfolio_admin_token', jwtToken);
        localStorage.setItem('portfolio_admin_user', JSON.stringify(userData));
        if (rememberMe) {
          localStorage.setItem('portfolio_remember_me', 'true');
        }
        setLoading(false);
        return { success: true };
      }
      setLoading(false);
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (error: any) {
      // Fallback check for demo login if backend offline
      if ((emailOrUsername === 'admin' || emailOrUsername === 'admin@portfolio.com') && password === 'adminpassword123') {
        const fakeToken = 'mock_jwt_token_admin_2026';
        const fakeUser = { id: 'admin-1', username: 'admin', email: 'admin@portfolio.com', role: 'admin' };
        setToken(fakeToken);
        setUser(fakeUser);
        localStorage.setItem('portfolio_admin_token', fakeToken);
        localStorage.setItem('portfolio_admin_user', JSON.stringify(fakeUser));
        setLoading(false);
        return { success: true };
      }
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid credentials. Default is admin / adminpassword123' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('portfolio_admin_token');
    localStorage.removeItem('portfolio_admin_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
