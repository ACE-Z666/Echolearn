import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../index.css';

// Add API URL constant at the top
const API_URL = 'https://echo-chat-production.up.railway.app';

// Add the sendQuery function
const sendQuery = async (question, chatHistory) => {
  try {
    const response = await fetch("https://echo-chat-production.up.railway.app/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        query: question,
        chat_history: chatHistory 
      }),
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  }
};

const ChatIt = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
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

      // Update chat history with the new user message
      const updatedChatHistory = [
        ...chatHistory,
        { role: 'user', content: inputMessage }
      ];
      setChatHistory(updatedChatHistory);

      console.log('Sending request to API...', {
        query: inputMessage,
        chat_history: updatedChatHistory
      });

      // Use the sendQuery function instead of direct fetch
      const data = await sendQuery(inputMessage, updatedChatHistory);
      console.log('Data received:', data);

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

      // Update chat history with the bot's response
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.answer }]);
      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        stack: error.stack,
        error: error
      });
      setError(`Failed to fetch: ${error.message}`);
      
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
        <h1>ECHO AI</h1>
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
                <div className="markdown-content">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
                <span className="timestamp">{message.timestamp}</span>
                {message.sources && message.sources.length > 0 && (
                  <div className="sources">
                    <p className="sources-title">Sources:</p>
                    <ul>
                      {message.sources.map((source, idx) => (
                        <li key={idx}>
                          {source.source} {source.page ? `(Page ${source.page})` : ''}
                          <div className="source-content">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                            >
                              {source.content}
                            </ReactMarkdown>
                          </div>
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
