import React, { useState } from 'react';
import axios from 'axios';
import * as pdfjs from 'pdfjs-dist';

// Import the worker from the correct location
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// Set the worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const FlashCards = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flashCards, setFlashCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "");
  };

  const extractTextFromPDF = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const typedarray = new Uint8Array(event.target.result);
          const pdf = await pdfjs.getDocument({ data: typedarray }).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(' ');
          }
          resolve(fullText);
        } catch (error) {
          console.error('Error processing PDF:', error);
          resolve(''); // Return empty string in case of error
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const generateFlashCards = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pdfText = await extractTextFromPDF(selectedFile);
      
      const response = await axios.post(
        API_URL,
        {
          messages: [{
            role: "user",
            content: `Generate exactly 15 question-answer pairs from the following text. Format the response as a JSON array of objects, each with 'question' and 'answer' keys. Make questions that test understanding of key concepts. Use only information from the provided text: ${pdfText}`
          }],
          model: "mistralai/mistral-small-3.1-24b-instruct:free",
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const cards = JSON.parse(response.data.choices[0].message.content);
      setFlashCards(cards);
      setCurrentCardIndex(0);
      setShowAnswer(false);
    } catch (err) {
      setError("Failed to generate flash cards. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < flashCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="flashcards-container">
      <div className="upload-section">
        <h2>Create Your Study Cards</h2>
        <div className="file-input-container">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            id="pdf-upload"
            className="file-input"
          />
          <label htmlFor="pdf-upload" className="file-label">
            {fileName || "Choose PDF File"}
          </label>
        </div>
        <button 
          className="generate-btn"
          onClick={generateFlashCards}
          disabled={loading}
        >
          {loading ? "Generating Cards..." : "Generate Flash Cards"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>

      {flashCards.length > 0 && (
        <div className="flashcard-section">
          <div className="flashcard" onClick={() => setShowAnswer(!showAnswer)}>
            <div className="card-content">
              <div className="card-number">Card {currentCardIndex + 1} of {flashCards.length}</div>
              <div className="question">{flashCards[currentCardIndex].question}</div>
              {showAnswer && (
                <div className="answer">{flashCards[currentCardIndex].answer}</div>
              )}
              <div className="card-hint">
                {!showAnswer ? "Click to reveal answer" : "Click to hide answer"}
              </div>
            </div>
          </div>

          <div className="navigation-buttons">
            <button 
              onClick={previousCard}
              disabled={currentCardIndex === 0}
              className="nav-btn"
            >
              Previous
            </button>
            <button 
              onClick={nextCard}
              disabled={currentCardIndex === flashCards.length - 1}
              className="nav-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashCards;
