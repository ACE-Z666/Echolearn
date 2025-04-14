import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import '../index.css';
import Rectblur from './Rectblur';

const FlashCards = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [flashCards, setFlashCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSizeError, setFileSizeError] = useState(false);
  const [visibleAnswers, setVisibleAnswers] = useState({});

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

    const formData = new FormData();
    formData.append("pdf_file", selectedFile);

    try {
      const backendUrl = "http://127.0.0.1:8080";
      console.log("📡 Sending request to:", `${backendUrl}/api/generate_flashcards/`);

      const response = await axios.post(`${backendUrl}/api/generate_flashcards/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Response received:", response.data);

      // Parse the flashcards from the response
      const qaContent = response.data?.flashcards || [];
      setFlashCards(qaContent);

    } catch (err) {
      console.error("❌ Full Error Object:", err);
      setError(err.response?.data?.error || "Failed to process the PDF. Check the backend logs.");
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
