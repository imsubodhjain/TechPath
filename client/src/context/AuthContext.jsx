import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, registerUser } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('techpath_token');
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('techpath_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    localStorage.setItem('techpath_token', res.token);
    setUser(res.data);
    return res;
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    localStorage.setItem('techpath_token', res.token);
    setUser(res.data);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('techpath_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
