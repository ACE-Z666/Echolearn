import React, { useState } from 'react';
import styled from 'styled-components';
import '../index.css'
import { PDFDocument } from 'pdf-lib';

// API Configuration
const API_CONFIG = {
  API_KEY: "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",
  API_URL: "https://openrouter.ai/api/v1/chat/completions",
  MODEL: "google/gemini-2.0-flash-thinking-exp:free"
};

const FlashCards = () => {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      setFile(file);
      await processPDF(file);
    } else {
      setError('Please upload a valid PDF file');
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      let fullText = '';

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const text = await page.getText();
        fullText += text + '\n';
      }

      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  const generateQuestions = async (text) => {
    const prompt = `Generate 15 questions and answers from the following text. Format the response as a JSON array of objects, each with 'question' and 'answer' fields. The questions should test understanding of key concepts. Text: ${text}`;

    const payload = {
      model: API_CONFIG.MODEL,
      messages: [
        {
          role: "system",
          content: "You are an AI that creates educational questions and answers. Format your response as valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    };

    const response = await fetch(API_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      // Parse the JSON response from the API
      const parsedQuestions = JSON.parse(content);
      return parsedQuestions;
    } catch (error) {
      console.error('Failed to parse API response:', error);
      throw new Error('Failed to parse questions from API response');
    }
  };

  const processPDF = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      // Extract text from PDF
      const extractedText = await extractTextFromPDF(file);
      
      // Generate questions using the API
      const generatedQuestions = await generateQuestions(extractedText);
      
      setQuestions(generatedQuestions);
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError('Failed to process PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const handleAnswer = (isCorrect) => {
    // Here you can implement logic to track correct/incorrect answers
    handleNextQuestion();
  };

  return (
    <Container>
      <Title>FlashCards</Title>
      
      {!questions.length && (
        <UploadSection>
          <UploadLabel htmlFor="pdf-upload">
            {file ? file.name : 'Upload PDF (Max 10MB)'}
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </UploadLabel>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </UploadSection>
      )}

      {loading && <LoadingMessage>Processing PDF...</LoadingMessage>}

      {questions.length > 0 && (
        <FlashCardContainer>
          <QuestionCounter>
            Question {currentQuestion + 1} of {questions.length}
          </QuestionCounter>
          
          <Card>
            <QuestionText>{questions[currentQuestion]?.question}</QuestionText>
            
            {!showAnswer ? (
              <ShowAnswerButton onClick={() => setShowAnswer(true)}>
                Show Answer
              </ShowAnswerButton>
            ) : (
              <>
                <AnswerText>{questions[currentQuestion]?.answer}</AnswerText>
                <ValidationButtons>
                  <Button correct onClick={() => handleAnswer(true)}>
                    Correct
                  </Button>
                  <Button onClick={() => handleAnswer(false)}>
                    Incorrect
                  </Button>
                </ValidationButtons>
              </>
            )}
          </Card>

          <NextButton 
            onClick={handleNextQuestion}
            disabled={currentQuestion === questions.length - 1}
          >
            Next Question
          </NextButton>
        </FlashCardContainer>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const UploadLabel = styled.label`
  padding: 15px 25px;
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const FlashCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const QuestionCounter = styled.div`
  font-size: 1.1em;
  color: #666;
`;

const Card = styled.div`
  width: 100%;
  max-width: 600px;
  min-height: 300px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const QuestionText = styled.h2`
  font-size: 1.5em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const AnswerText = styled.p`
  font-size: 1.2em;
  color: #666;
  text-align: center;
`;

const ShowAnswerButton = styled.button`
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  margin-top: auto;

  &:hover {
    background-color: #1976D2;
  }
`;

const ValidationButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.correct ? '#4CAF50' : '#f44336'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background-color: ${props => props.correct ? '#45a049' : '#d32f2f'};
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const NextButton = styled(Button)`
  background-color: #2196F3;
  &:hover {
    background-color: #1976D2;
  }
`;

export default FlashCards;
