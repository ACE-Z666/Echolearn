import { useState } from 'react'
import '../index.css'
import { useAuth } from '../context/AuthContext';
import { createApi } from '../utils/api';
import logo1 from '../assets/logos/logo1.png';
import googleLogo from '../assets/logos/google.svg';
import facebookLogo from '../assets/logos/facebook.svg';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleForm = () => {
    setIsLogin(!isLogin)
    setError(null);
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isLogin && (!formData.username || !formData.fullName)) {
        throw new Error('Username and Full Name are required');
      }
      if (!formData.email || !formData.password) {
        throw new Error('Email and Password are required');
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      console.log('Sending request to:', endpoint);
      console.log('Request data:', isLogin ? {
        email: formData.email,
        password: formData.password
      } : formData);

      // Create API instance without token for auth requests
      const authApi = createApi();
      const response = await authApi.post(endpoint, isLogin ? {
        email: formData.email,
        password: formData.password
      } : formData);
      
      console.log('Raw API Response:', response);

      // Check if response has the expected structure
      if (!response.success || !response.data) {
        throw new Error('Invalid response format from server');
      }

      // Get token from the nested data structure
      const token = response.data.token;
      
      if (!token) {
        console.error('No token found in response. Full response:', response);
        throw new Error('Authentication failed: No token received from server');
      }

      console.log('Token received from server:', token ? 'Yes' : 'No');

      // Store token and update auth state
      try {
        login(token);
        console.log('Login function completed successfully');
      } catch (error) {
        console.error('Error during login function:', error);
        throw error;
      }
      
      // Create new API instance with token for subsequent requests
      const authenticatedApi = createApi(token);
      
      // Use navigate with token in URL
      navigate(`/?token=${encodeURIComponent(token)}`, { replace: true });
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className='leftbg'>
        <div className="form-container">
          <div className="logo">
            <img src={logo1} alt="EchoLearn Logo" />
          </div>
          
          <h2>{isLogin ? 'Welcome Back' : 'Create an account.'}</h2>
          <p className="subtitle">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={toggleForm} className="toggle-link">
              {isLogin ? 'Sign Up' : 'Sign in'}
            </span>
          </p>

          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className='input-group-container'>
                <div className="input-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="input-field"
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose your password"
                className="input-field"
              />
            </div>

            {!isLogin && (
              <div className="checkbox-group">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">I agree to the terms of service and privacy policy</label>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign Up')}
            </button>

            {!isLogin && (
              <div className="social-signup">
                <p>or sign up with</p>
                <div className="social-icons">
                  <button className="social-btn google">
                    <img src={googleLogo} alt="Google" />
                  </button>
                  <button className="social-btn facebook">
                    <img src={facebookLogo} alt="Facebook" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="welcome-text">
        <h1>
            Welcome To  <br /><span>EchoLearn!!</span>
        </h1>
        <p>
        EchoLearn is an AI-powered study toolkit designed to help students learn smarter and manage their studies efficiently. With features like automatic summarization, AI-generated flashcards, and intelligent study planning, it transforms learning into a structured and engaging process.
        </p>
      </div>
    </div>
  )
}

export default Login

/* Add this CSS to a new file: src/Components/login.css */

