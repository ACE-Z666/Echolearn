import React, { useState } from 'react';
import './Motivator.css';

const Motivator = () => {
  const [problem, setProblem] = useState('');
  const [motivation, setMotivation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Using the same API configuration as the PDF Summarizer
  const API_KEY = "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";
  const API_URL = "https://openrouter.ai/api/v1/chat/completions";

  const formatPrompt = (problem) => {
    return `As a motivational coach, please provide encouragement for this problem: "${problem}"

Please respond ONLY with a JSON object in this exact format:
{
  "response": "A detailed motivational message addressing the problem",
  "quote": "A relevant inspirational quote",
  "author": "The author of the quote",
  "steps": ["Specific action step 1", "Specific action step 2", "Specific action step 3"]
}

Ensure your response is valid JSON and includes all fields.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Motivator App'
        },
        body: JSON.stringify({
          model: "mistralai/mistral-small-3.1-24b-instruct:free",
          messages: [
            {
              role: "system",
              content: "You are a motivational coach that provides encouragement and actionable advice."
            },
            {
              role: "user",
              content: formatPrompt(problem)
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // For debugging

      const responseText = data.choices[0].message.content;
      console.log("Response Text:", responseText); // For debugging

      let motivationalContent;
      try {
        motivationalContent = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse API response:', parseError);
        motivationalContent = {
          response: responseText,
          quote: null,
          author: null,
          steps: []
        };
      }

      setMotivation(motivationalContent);
    } catch (error) {
      console.error('Error:', error);
      setMotivation({
        response: `Error: ${error.message || "Couldn't process your request. Please try again."}`,
        quote: null,
        author: null,
        steps: [],
        isError: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="motivator-container">
      <div className="motivator-content">
        <h1 className="motivator-title">Need Some Motivation?</h1>
        <p className="motivator-subtitle">Share your problem, and let me help you overcome it!</p>

        <form onSubmit={handleSubmit} className="motivator-form">
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="What's troubling you? Let me motivate you!"
            className="motivator-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="motivate-button"
            disabled={isLoading}
          >
            {isLoading ? 'Getting Motivation...' : 'Motivate Me!'}
          </button>
        </form>

        {isLoading && (
          <div className="motivation-loading">
            <div className="loading-spinner"></div>
            <p>Preparing your motivation...</p>
          </div>
        )}

        {motivation && (
          <div className="motivation-response">
            <div className={`motivation-card ${motivation.isError ? 'error-card' : ''}`}>
              {!motivation.isError && (
                <>
                  <div className="motivation-main">
                    <div className="motivation-icon">✨</div>
                    <p className="motivation-message">{motivation.response}</p>
                  </div>

                  {motivation.quote && motivation.author && (
                    <div className="motivation-quote">
                      <div className="quote-icon">"</div>
                      <blockquote>
                        <p>{motivation.quote}</p>
                        <footer>— {motivation.author}</footer>
                      </blockquote>
                    </div>
                  )}

                  {motivation.steps && motivation.steps.length > 0 && (
                    <div className="motivation-steps">
                      <h3>Your Action Plan</h3>
                      <ol>
                        {motivation.steps.map((step, index) => (
                          <li key={index}>
                            <span className="step-number">{index + 1}</span>
                            <span className="step-text">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </>
              )}
              
              {motivation.isError && (
                <div className="error-message">
                  <div className="error-icon">⚠️</div>
                  <p>{motivation.response}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Motivator;
