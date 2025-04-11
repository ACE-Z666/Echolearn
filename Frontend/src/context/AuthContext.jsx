import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Check for token in URL first, then localStorage
  const getInitialToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      console.log('Token found in URL');
      localStorage.setItem('userToken', urlToken);
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return urlToken;
    }
    return localStorage.getItem('userToken');
  };

  const initialToken = getInitialToken();
  console.log('Initial token:', initialToken ? 'Token exists' : 'No token');
  
  const [token, setToken] = useState(initialToken);
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      console.log('Validating token:', token ? 'Token exists' : 'No token');
      console.log('Current isAuthenticated state:', isAuthenticated);
      
      if (!token) {
        console.log('No token found, setting isAuthenticated to false');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verify token validity with your backend
        console.log('Verifying token with backend...');
        const response = await fetch('http://localhost:5001/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Token verification response:', response.status);
        
        if (!response.ok) {
          throw new Error('Invalid token');
        }

        console.log('Token is valid, setting isAuthenticated to true');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('userToken');
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const login = (newToken) => {
    console.log('Login called with token:', newToken ? 'Token provided' : 'No token');
    if (!newToken) {
      throw new Error('No token provided');
    }
    
    // Log the token before storing
    console.log('Storing token in localStorage...');
    localStorage.setItem('userToken', newToken);
    
    // Verify token was stored
    const storedToken = localStorage.getItem('userToken');
    console.log('Token stored successfully:', storedToken ? 'Yes' : 'No');
    
    setToken(newToken);
    setIsAuthenticated(true);
    console.log('Login completed, isAuthenticated set to true');
  };

  const logout = () => {
    console.log('Logout called');
    localStorage.removeItem('userToken');
    setToken(null);
    setIsAuthenticated(false);
    console.log('Logout completed, isAuthenticated set to false');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, isLoading }}>
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