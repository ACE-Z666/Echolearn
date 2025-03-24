import React, { useState } from 'react';
import axios from 'axios';
import './FlashCards.css'; // Import the CSS file for styles

const API_KEY = "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"; // Your API Key
const API_URL = "https://openrouter.ai/api/v1/chat/completions"; // Your API URL

const FlashCards = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (pdfFile.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB");
      return;
    }

    const formData = new FormData();
    formData.append('pdf_file', pdfFile);

    try {
      const response = await axios.post(API_URL, {
        model: "google/gemini-2.0-flash-thinking-exp:free",
        messages: [
          {
            role: "system",
            content: "You are an AI that processes study notes for engineering students. Extract key points and structure the content in a markdown format."
          },
          { role: "user", content: pdfFile }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const extractedQuestions = response.data.choices[0].message.content; // Adjust based on actual response structure
      generateQuestions(extractedQuestions);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const generateQuestions = (text) => {
    // Assuming the API returns questions in a specific format
    const generatedQuestions = text.split('\n').map((line, index) => ({
      question: line,
      answer: "Answer for question " + (index + 1) // Placeholder for actual answers
    })).slice(0, 15); // Limit to 15 questions
    setQuestions(generatedQuestions);
  };

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    setShowAnswer(false);
  };

  return (
    <div className="flashcards-container">
      <h1>FlashCards</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload PDF</button>

      {questions.length > 0 && (
        <div className="question-container">
          <h2>{questions[currentQuestionIndex].question}</h2>
          {showAnswer && <p>{questions[currentQuestionIndex].answer}</p>}
          <button onClick={handleShowAnswer}>{showAnswer ? "Hide Answer" : "Show Answer"}</button>
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      )}
    </div>
  );
};

export default FlashCards;
