import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import '../index.css';
import Rectblur from './rectblur';

const FlashCards = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [flashCards, setFlashCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSizeError, setFileSizeError] = useState(false);
  const [visibleAnswers, setVisibleAnswers] = useState({});

  const API_KEY = "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";
  const API_URL = "https://openrouter.ai/api/v1/chat/completions";

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "");
    setFileSizeError(file && file.size > 10 * 1024 * 1024);
  };

  const toggleAnswer = (index) => {
    setVisibleAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file first.");
      return;
    }

    if (fileSizeError) {
      alert("File is too large. Please select a file smaller than 10MB.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Read the PDF file
      const fileReader = new FileReader();
      
      fileReader.onload = async (e) => {
        const pdfData = e.target.result;
        
        try {
          // Send the extracted text to OpenRouter AI for Q&A generation
          console.log("📡 Sending text to OpenRouter AI...");
          
          const aiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': window.location.origin,
              'X-Title': 'Flash Cards Generator'
            },
            body: JSON.stringify({
              model: "mistralai/mistral-small-3.1-24b-instruct:free",
              messages: [
                {
                  role: "system",
                  content: "You are a helpful assistant that creates educational flash cards. Always respond with valid JSON."
                },
                {
                  role: "user",
                  content: `Based on the following PDF content, generate 15 question-answer pairs. Format your response EXACTLY as a JSON array of objects, each with 'question' and 'answer' fields. Content: ${pdfData}`
                }
              ]
            })
          });

          if (!aiResponse.ok) {
            throw new Error(`OpenRouter AI API error: ${aiResponse.status}`);
          }

          const result = await aiResponse.json();
          
          if (!result.choices?.[0]?.message?.content) {
            throw new Error("Invalid response format from OpenRouter AI");
          }

          console.log("✅ AI Response:", result);

          try {
            const qaContent = JSON.parse(result.choices[0].message.content);
            if (!Array.isArray(qaContent)) {
              throw new Error("Response is not an array");
            }
            setFlashCards(qaContent);
          } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            throw new Error("Failed to parse AI response as JSON");
          }

        } catch (err) {
          console.error("Error processing content:", err);
          setError(err.message);
        }
      };

      fileReader.onerror = () => {
        setError("Failed to read the PDF file");
        setLoading(false);
      };

      fileReader.readAsText(selectedFile);

    } catch (err) {
      console.error("❌ Error Details:", err);
      setError(err.message || "Failed to process the PDF and generate flash cards");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-pdf">
      <div className="rectblur-container">
        <Rectblur />
      </div>

      <h2 className="title-pdf">Generate Flash Cards from PDF</h2>
      
      <div className="pdf-2">
        <label className="pdf-upload-label" htmlFor="pdf-upload">
          Upload PDF:
        </label>
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>

      {fileName && !fileSizeError && <p className="file-name">Selected file: {fileName}</p>}
      {fileSizeError && <p className="error">File size exceeds 10MB. Please select a smaller file.</p>}

      <button className="button2" onClick={handleUpload} disabled={loading}>
        {loading ? "Generating Flash Cards..." : "Generate"}
      </button>

      {error && <p className="error">{error}</p>}

      {flashCards.length > 0 && (
        <div className="flash-cards-container">
          <h3 className="flash-cards-title">Flash Cards</h3>
          <div className="cards-grid">
            {flashCards.map((card, index) => (
              <div key={index} className="flash-card">
                <h4 className="question">Question {index + 1}:</h4>
                <ReactMarkdown 
                  rehypePlugins={[rehypeRaw]} 
                  remarkPlugins={[remarkGfm]} 
                  className="markdown-content"
                >
                  {card.question}
                </ReactMarkdown>
                <button 
                  className="show-answer-btn"
                  onClick={() => toggleAnswer(index)}
                >
                  {visibleAnswers[index] ? 'Hide Answer' : 'Show Answer'}
                </button>
                {visibleAnswers[index] && (
                  <div className="answer">
                    <strong>Answer:</strong>
                    <ReactMarkdown 
                      rehypePlugins={[rehypeRaw]} 
                      remarkPlugins={[remarkGfm]} 
                      className="markdown-content"
                    >
                      {card.answer}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashCards;
