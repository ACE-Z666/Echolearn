import { useState } from 'react'
import '../index.css'
const Login = () => {
  const [isLogin, setIsLogin] = useState(false) // Set default to false for signup view

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="auth-container">
        <div className='leftbg'>
      <div className="form-container">
        <div className="logo">
          <img src="../src/assets/logos/logo1.png"/>
        </div>
        
        <h2>{isLogin ? 'Welcome Back' : 'Create an account.'}</h2>
        <p className="subtitle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={toggleForm} className="toggle-link">
            {isLogin ? 'Sign Up' : 'Sign in'}
          </span>
        </p>

        <form>
          {!isLogin && (
            <div className='input-group-container'>
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
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
              placeholder="Enter your email"
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
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

          <button type="submit" className="submit-btn">
            {isLogin ? 'Sign in' : 'Sign Up'}
          </button>

          {!isLogin && (
            <div className="social-signup">
              <p>or sign up with</p>
              <div className="social-icons">
                <button className="social-btn google">
                  <img src="../src/assets/logos/google.svg" alt="Google" />
                </button>
                <button className="social-btn facebook">
                  <img src="../src/assets/logos/facebook.svg" alt="Facebook" />
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
        Lorem ipsum Ashwin dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariat.
        </p>
      </div>
    </div>
  )
}

export default Login

/* Add this CSS to a new file: src/Components/login.css */

