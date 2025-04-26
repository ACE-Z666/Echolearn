# EchoLearn 🧠📚

**EchoLearn** is an AI-powered learning assistant designed to help students learn smarter, not harder. With modules like Flashcards, PDF Note Structuring, Motivation Quotes, and an Interactive Chatbot, EchoLearn transforms traditional study practices into a personalized and dynamic experience.

---

## 🚀 Features

- 🎓 **Flashcards Module**: Create, view, and practice with AI-generated or user-created flashcards.
- 📄 **PDF Summarizer**: Upload PDFs and receive structured notes with clear headings and key points.
- 💬 **Echo Chat**: An intelligent chatbot that answers questions based on your uploaded content.
- 🔋 **Motivator Module**: Get daily motivational quotes to keep your spirits high.
- 🔐 **Authentication**: Secure login and registration using JWT.
- 📊 **User Dashboard**: Track your progress and manage your content easily.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** + Tailwind CSS
- React Router for page navigation
- Axios for API communication

### Backend
- **Django** & **Django REST Framework**
- PDF processing with `PyMuPDF`
- DeepSeek R1 API for note structuring
- TinyBERT for Q&A generation
- MongoDB for user data
- PineconeDB for vector similarity searches

---

## 🧠 How It Works

1. **PDF Upload**  
   → Processed page-by-page → Converted to Markdown  
   → Sent to **DeepSeek R1** model  
   → Output: Simplified structured notes 📘

2. **Q&A Generator**  
   → Embedded text from PDF  
   → Processed via **TinyBERT**  
   → Generates potential exam-style questions

3. **Chat with Echo**  
   → Ask questions based on your notes  
   → Echo responds with context-aware answers using PineconeDB

---
