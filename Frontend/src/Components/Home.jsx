import React from 'react';
import { Link } from 'react-router-dom';
import Rectblur from './rectblur.jsx';
import Navbar from "./Navbar.jsx";
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (<>
    <Navbar/>
    <div className="home-container">
      <div className="rectblur-container">
        <Rectblur />
      </div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Gateway to<br /><span className="highlight">Smarter</span> Learning 
          </h1>
          <p className="hero-subtitle">
            Your AI-powered learning companion. Upload documents, ask questions, and get instant, accurate answers.
          </p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/chatit" className="primary-button">
                  Start Learning
                </Link>
                <Link to="/pdf" className="secondary-button">
                  Upload Documents
                </Link>
              </>
            ) : (
              <Link to="/login" className="primary-button">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Echolearn?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Learning</h3>
            <p>Advanced AI technology to understand and answer your questions accurately</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Document Analysis</h3>
            <p>Upload and analyze any document to get instant insights and answers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Responses</h3>
            <p>Get immediate, contextual answers to your questions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Accurate Results</h3>
            <p>Precise information with source references for verification</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Your Documents</h3>
            <p>Simply upload your PDF documents or text files</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Ask Questions</h3>
            <p>Ask any question about your documents</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Answers</h3>
            <p>Receive accurate answers with source references</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students who are already using Echolearn</p>
          {isAuthenticated ? (
            <Link to="/chatit" className="cta-button">
              Try It Now
            </Link>
          ) : (
            <Link to="/login" className="cta-button">
              Get Started
            </Link>
          )}
        </div>
      </section>
    </div>
  </>);
};

export default Home;
