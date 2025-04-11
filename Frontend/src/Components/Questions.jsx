import React, { useState } from 'react';
import { Card, Button } from '@mui/material';
import styled from '@emotion/styled';

const QuestionsSection = styled.section`
  background-color: beige;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QuestionCard = styled(Card)`
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Questions = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const questions = [
    {
      id: 1,
      question: "What is your name?",
      options: ["Skip"]
    },
    {
      id: 2,
      question: "How old are you?",
      options: ["Under 18", "18-30", "31-50", "Above 50"]
    },
    {
      id: 3,
      question: "What is your favorite color?",
      options: ["Red", "Blue", "Green", "Yellow"]
    },
    {
      id: 4,
      question: "How often do you exercise?",
      options: ["Daily", "Weekly", "Monthly", "Never"]
    },
    {
      id: 5,
      question: "What is your preferred programming language?",
      options: ["JavaScript", "Python", "Java", "Other"]
    },
    {
      id: 6,
      question: "How many hours do you sleep per day?",
      options: ["Less than 6", "6-8", "More than 8"]
    },
    {
      id: 7,
      question: "Do you prefer working from home?",
      options: ["Yes", "No", "Sometimes"]
    },
    {
      id: 8,
      question: "What is your favorite season?",
      options: ["Spring", "Summer", "Fall", "Winter"]
    },
    {
      id: 9,
      question: "How do you prefer to learn?",
      options: ["Reading", "Video", "Practice", "Audio"]
    },
    {
      id: 10,
      question: "Are you satisfied with this survey?",
      options: ["Yes", "No", "Maybe"]
    }
  ];

  const handleAnswer = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <QuestionsSection>
      {currentQuestion < questions.length && (
        <QuestionCard elevation={3}>
          <h2>Question {questions[currentQuestion].id}</h2>
          <p>{questions[currentQuestion].question}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="contained"
                onClick={handleAnswer}
                sx={{ margin: '0.5rem' }}
              >
                {option}
              </Button>
            ))}
          </div>
        </QuestionCard>
      )}
      {currentQuestion === questions.length && (
        <QuestionCard elevation={3}>
          <h2>Thank you!</h2>
          <p>You have completed all questions.</p>
        </QuestionCard>
      )}
    </QuestionsSection>
  );
};

export default Questions;
