import React, { useState, useRef, useEffect } from 'react';
import '../index.css';

const ChatIt = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    try {
      // Update messages with user message first
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputMessage('');
      setIsLoading(true);
      setError(null);

      console.log('Sending request to API...'); // Debug log

      const response = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputMessage
        })
      });

      console.log('Response received:', response.status); // Debug log

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received:', data); // Debug log

      if (data.error) {
        throw new Error(data.error);
      }
      
      // Add bot message with formatted sources
      const botMessage = {
        text: data.answer || 'Sorry, I received an empty response.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        sources: data.source_documents?.map(doc => ({
          content: doc.page_content,
          source: doc.metadata.source,
          page: doc.metadata.page
        })) || []
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error('Error in handleSubmit:', error); // Debug log
      setError(error.message);
      
      // Add error message to chat
      const errorMessage = {
        text: `Error: ${error.message || "Couldn't process your request. Please try again."}`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h1>Chat-it</h1>
        {error && <div className="error-banner">{error}</div>}
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-chat">
            <h2>How can I help you today?</h2>
            <p>Start a conversation and I'll assist you with your questions.</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-wrapper ${message.isUser ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              <div className="message-icon">
                {message.isUser ? '👤' : '🤖'}
              </div>
              <div className={`message-bubble ${message.isError ? 'error-message' : ''}`}>
                <p>{message.text}</p>
                <span className="timestamp">{message.timestamp}</span>
                {message.sources && message.sources.length > 0 && (
                  <div className="sources">
                    <p className="sources-title">Sources:</p>
                    <ul>
                      {message.sources.map((source, idx) => (
                        <li key={idx}>
                          {source.source} {source.page ? `(Page ${source.page})` : ''}
                          <p className="source-content">{source.content}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message-wrapper bot-message">
            <div className="message-content">
              <div className="message-icon">🤖</div>
              <div className="message-bubble loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="chat-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="send-button"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatIt;
