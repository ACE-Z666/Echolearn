# EchoLearn 🧠📚

<div align="center">

**Transform the Way You Learn with AI-Powered Study Tools**

[![React](https://res.cloudinary.com/dl6b9yya3/image/upload/v1766854408/Screenshot_2025-04-01_121128_uetd8e.png)](https://reactjs.org/)
[![Python](https://res.cloudinary.com/dl6b9yya3/image/upload/v1766854427/Screenshot_2025-04-01_113333_nelamf.png)](https://www.python.org/)
[![Django](https://res.cloudinary.com/dl6b9yya3/image/upload/v1766854418/Screenshot_2025-04-01_113542_ovm6yd.png)](https://www.djangoproject.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 📖 About EchoLearn

EchoLearn is an intelligent learning companion that revolutionizes how students interact with study materials. By leveraging cutting-edge AI technologies, EchoLearn transforms dense PDFs into digestible notes, generates practice questions, and provides interactive learning through an AI chatbot—all tailored to enhance retention and understanding.

**The Problem:** Traditional studying often involves passive reading, which leads to poor retention and overwhelming content consumption.

**The Solution:** EchoLearn actively processes your study materials, structures information for optimal learning, generates practice questions, and provides an interactive AI tutor available 24/7.

---

## ✨ Features

### 🎯 Core Modules

#### 📄 Smart PDF Summarizer
Transform lengthy PDF documents into structured, easy-to-understand notes.
- **Intelligent Processing:** Page-by-page analysis with context preservation
- **Structured Output:** Clear headings, bullet points, and key concept highlighting
- **Markdown Export:** Clean, readable format for easy review
- **Multi-language Support:** Process documents in various languages

#### 🎓 AI-Powered Flashcards
Create and practice with intelligent flashcards for active recall.
- **Auto-Generation:** AI creates flashcards from your study materials
- **Custom Cards:** Add your own flashcards manually
- **Spaced Repetition:** Smart review scheduling based on your performance
- **Progress Tracking:** Monitor your learning journey with detailed statistics

#### 💬 Echo Chat - Your AI Study Buddy
Ask questions and get instant, context-aware answers from your materials.
- **Contextual Understanding:** Answers based on your uploaded documents
- **Natural Conversations:** Chat naturally like you would with a tutor
- **Citation Support:** Responses reference specific parts of your materials
- **Multi-document Queries:** Ask questions across multiple uploaded PDFs

#### 🎯 Q&A Generator
Automatically generate exam-style questions from your study materials.
- **Various Question Types:** Multiple choice, short answer, and conceptual questions
- **Difficulty Levels:** Questions scaled to different complexity levels
- **Practice Mode:** Test yourself before the real exam
- **Instant Feedback:** Get explanations for correct and incorrect answers

#### 💪 Daily Motivator
Stay inspired with motivational quotes and study tips.
- **Daily Inspiration:** Fresh motivational content every day
- **Personalized Messages:** Quotes tailored to your study goals
- **Progress Celebration:** Acknowledge your achievements along the way

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│                  (React.js + Tailwind CSS)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │Flashcards│  │ PDF View │  │   Chat   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│                  (Django REST Framework)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Auth API  │  │ PDF API  │  │Flash API │  │ Chat API │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│                      (Django Backend)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │PDF Processor │  │AI Integration│  │User Manager  │     │
│  │  (PyMuPDF)   │  │(Gemini/Mistral)│ │    (JWT)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │    MongoDB       │         │   PineconeDB     │         │
│  │  (User Data &    │         │(Vector Embeddings│         │
│  │   Documents)     │         │  & Similarity)   │         │
│  └──────────────────┘         └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### AI Processing Pipeline

```
PDF Upload ──▶ PyMuPDF Extraction ──▶ Text Chunking
                                            │
                                            ▼
                                    Gemini 2.5 Pro
                                   (Summarization)
                                            │
                    ┌───────────────────────┴───────────────────┐
                    ▼                                           ▼
            Structured Notes                           Q&A Generation
            (Markdown)                                 (Practice Questions)
                    │                                           │
                    ▼                                           ▼
              User Dashboard                            Flashcard Module
                                            
                                            
PDF Content ──▶ Text Embedding ──▶ PineconeDB Storage
                                            │
                                            ▼
User Question ──▶ Query Embedding ──▶ Similarity Search ──▶ Context Retrieval
                                                                    │
                                                                    ▼
                                                            Mistral AI Small 24B
                                                                    │
                                                                    ▼
                                                          Contextual Answer
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| React.js | UI Framework | 18.0+ |
| Tailwind CSS | Styling | 3.0+ |
| React Router | Navigation | 6.0+ |
| Axios | HTTP Client | 1.0+ |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| Django | Web Framework | 4.0+ |
| Django REST Framework | API Development | 3.14+ |
| PyMuPDF | PDF Processing | Latest |
| JWT | Authentication | Latest |

### AI & Machine Learning
| Service | Purpose | Model |
|---------|---------|-------|
| Google Gemini | Text Summarization & Q&A Generation | 2.5 Pro |
| Mistral AI | Conversational Chat | Small 24B |

### Databases
| Database | Purpose | Type |
|----------|---------|------|
| MongoDB | User data, documents, flashcards | NoSQL |
| PineconeDB | Vector embeddings for similarity search | Vector DB |

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js 16.0 or higher
- npm or yarn
- MongoDB instance (local or cloud)
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/ACE-Z666/Echolearn.git
cd Echolearn
```

2. **Set up Python virtual environment**
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. **Install backend dependencies**
```bash
# For Authentication Backend
cd Auth_Backend
pip install -r requirements.txt

# For Main Backend
cd ../Backend2
pip install -r requirements.txt

# For Chat Backend
cd ../Chat_Backend
pip install -r requirements.txt
```

4. **Configure environment variables**

Create a `.env` file in each backend directory with the following:

```env
# Auth_Backend/.env
SECRET_KEY=your_django_secret_key
DEBUG=True
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Backend2/.env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string

# Chat_Backend/.env
MISTRAL_API_KEY=your_mistral_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
MONGODB_URI=your_mongodb_connection_string
```

5. **Run database migrations**
```bash
cd Auth_Backend
python manage.py migrate

cd ../Backend2
python manage.py migrate
```

6. **Start backend servers**

Open three separate terminal windows:

```bash
# Terminal 1 - Auth Backend
cd Auth_Backend
python manage.py runserver 8000

# Terminal 2 - Main Backend
cd Backend2
python manage.py runserver 8001

# Terminal 3 - Chat Backend
cd Chat_Backend
python manage.py runserver 8002
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd Frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure API endpoints**

Create a `.env` file in the Frontend directory:

```env
REACT_APP_AUTH_API=http://localhost:8000/api
REACT_APP_MAIN_API=http://localhost:8001/api
REACT_APP_CHAT_API=http://localhost:8002/api
```

4. **Start the development server**
```bash
npm start
# or
yarn start
```

The application should now be running at `http://localhost:3000`

---

## 📱 Usage

### Getting Started

1. **Create an Account**
   - Navigate to the registration page
   - Enter your email, username, and password
   - Verify your email (if enabled)

2. **Upload Your First PDF**
   - Click on "Upload Document" in the dashboard
   - Select a PDF file from your device
   - Wait for AI processing (this may take 1-2 minutes)

3. **Access Structured Notes**
   - View automatically generated notes in the "Notes" section
   - Export notes as Markdown for offline study

4. **Practice with Flashcards**
   - Navigate to the "Flashcards" module
   - Review AI-generated cards or create your own
   - Use spaced repetition mode for optimal retention

5. **Chat with Echo**
   - Open the "Echo Chat" interface
   - Ask questions about your uploaded materials
   - Get instant, context-aware answers

### Advanced Features

#### Custom Flashcard Creation
```
1. Go to Flashcards → Create New
2. Enter question on the front
3. Enter answer on the back
4. Add tags for organization
5. Save and start practicing
```

#### Bulk PDF Processing
```
1. Select multiple PDFs in the upload dialog
2. Choose processing options (summary depth, language)
3. Wait for batch processing to complete
4. Access all notes from the dashboard
```

#### Export Study Materials
```
1. Navigate to any note or flashcard set
2. Click the "Export" button
3. Choose format (Markdown, PDF, or Anki)
4. Download to your device
```

---

## 🔧 Configuration

### AI Model Settings

**Gemini 2.5 Pro Configuration** (`Backend2/settings.py`):
```python
GEMINI_CONFIG = {
    'temperature': 0.7,
    'top_p': 0.95,
    'top_k': 40,
    'max_output_tokens': 2048,
}
```

**Mistral AI Configuration** (`Chat_Backend/settings.py`):
```python
MISTRAL_CONFIG = {
    'model': 'mistral-small-24b',
    'temperature': 0.6,
    'max_tokens': 1024,
}
```

### Vector Database Settings

**Pinecone Configuration** (`Chat_Backend/settings.py`):
```python
PINECONE_CONFIG = {
    'index_name': 'echolearn-embeddings',
    'dimension': 1536,
    'metric': 'cosine',
    'pods': 1,
}
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd Auth_Backend
python manage.py test

cd ../Backend2
python manage.py test

cd ../Chat_Backend
python manage.py test
```

### Run Frontend Tests
```bash
cd Frontend
npm test
# or
yarn test
```

### Run Integration Tests
```bash
# From project root
python run_integration_tests.py
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Contribution Workflow

1. **Fork the repository**
```bash
git clone https://github.com/YOUR_USERNAME/Echolearn.git
```

2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
   - Write clean, documented code
   - Follow the existing code style
   - Add tests for new features

4. **Commit your changes**
```bash
git commit -m "Add amazing feature"
```

5. **Push to your fork**
```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Wait for review and feedback

### Code Style Guidelines

**Python (Backend)**
- Follow PEP 8 style guide
- Use meaningful variable names
- Add docstrings to all functions
- Maximum line length: 88 characters (Black formatter)

**JavaScript (Frontend)**
- Follow Airbnb JavaScript Style Guide
- Use ES6+ features
- Prefer functional components with hooks
- Use meaningful component names

### Areas We Need Help

- 🐛 Bug fixes and issue resolution
- 📝 Documentation improvements
- 🌐 Internationalization (i18n)
- ♿ Accessibility enhancements
- 🎨 UI/UX improvements
- 🧪 Test coverage expansion
- 🚀 Performance optimizations

---

## 📊 Project Structure

```
Echolearn/
│
├── Auth_Backend/                 # Authentication service
│   ├── api/                      # API endpoints
│   ├── models/                   # User models
│   ├── serializers/              # Data serializers
│   ├── utils/                    # Helper functions
│   └── requirements.txt          # Python dependencies
│
├── Backend2/                     # Main backend service
│   ├── pdf_processor/            # PDF handling logic
│   ├── ai_integration/           # Gemini API integration
│   ├── flashcards/               # Flashcard management
│   ├── notes/                    # Note structuring
│   └── requirements.txt
│
├── Chat_Backend/                 # Chat service
│   ├── chat/                     # Chat endpoints
│   ├── embeddings/               # Vector embedding logic
│   ├── pinecone_utils/           # Pinecone operations
│   └── requirements.txt
│
├── Frontend/                     # React application
│   ├── public/                   # Static files
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service layer
│   │   ├── hooks/                # Custom React hooks
│   │   ├── utils/                # Helper functions
│   │   ├── styles/               # Global styles
│   │   └── App.js                # Main app component
│   ├── package.json
│   └── tailwind.config.js
│
├── docs/                         # Additional documentation
├── tests/                        # Integration tests
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Module not found" error in Django**
```bash
# Solution: Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate      # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**Issue: "CORS error" in browser console**
```python
# Solution: Check CORS settings in Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

**Issue: "Cannot connect to MongoDB"**
```bash
# Solution: Verify MongoDB is running
# For local MongoDB:
sudo systemctl start mongodb  # Linux
brew services start mongodb   # macOS

# Check connection string in .env file
```

**Issue: "Gemini API rate limit exceeded"**
```python
# Solution: Implement rate limiting in your code
import time

def call_gemini_with_retry(prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = gemini.generate(prompt)
            return response
        except RateLimitError:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                raise
```

**Issue: Frontend not connecting to backend**
```bash
# Solution: Check if all backend servers are running
# Verify API endpoints in .env file
# Check browser network tab for failed requests
```

---

## 🔐 Security

### Best Practices Implemented

- 🔒 JWT-based authentication with token expiration
- 🛡️ Input validation and sanitization
- 🔑 Environment variables for sensitive data
- 🚫 CORS protection configured properly
- 📝 SQL injection prevention (Django ORM)
- 🔐 Password hashing with bcrypt
- 🌐 HTTPS enforcement in production

### Reporting Security Issues

If you discover a security vulnerability, please email security@echolearn.com. Do not create a public GitHub issue.

---

## 📈 Performance

### Optimization Techniques

- **Lazy Loading:** Components and routes loaded on demand
- **Caching:** Redis caching for frequently accessed data
- **Database Indexing:** MongoDB indexes on commonly queried fields
- **Vector Search:** Optimized Pinecone queries with metadata filtering
- **API Pagination:** Large datasets split into manageable chunks
- **Image Optimization:** Compressed assets for faster loading

### Benchmarks

| Operation | Average Time |
|-----------|-------------|
| PDF Upload & Processing | 45-60 seconds |
| Chat Response | 1-2 seconds |
| Flashcard Generation | 5-10 seconds |
| Note Summarization | 30-45 seconds |
| User Authentication | <200ms |

---

## 🗺️ Roadmap

### Q1 2025
- [ ] Mobile app (React Native)
- [ ] Collaborative study groups
- [ ] Advanced analytics dashboard
- [ ] Voice-to-text note taking

### Q2 2025
- [ ] Browser extension for instant summarization
- [ ] Integration with popular LMS platforms
- [ ] Multi-language support (Spanish, French, German)
- [ ] Gamification features (badges, leaderboards)

### Q3 2025
- [ ] AI-powered study schedule optimization
- [ ] Video content summarization
- [ ] Peer-to-peer flashcard sharing
- [ ] Advanced progress tracking

### Q4 2025
- [ ] Whiteboard collaboration tool
- [ ] Live tutoring sessions
- [ ] AR flashcard visualization
- [ ] Custom AI model fine-tuning

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 EchoLearn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**Abhijith J Nair**  
Project Creator & Lead Developer

- GitHub: [@ACE-Z666](https://github.com/ACE-Z666)
- Project: [EchoLearn](https://github.com/ACE-Z666/Echolearn)

---

## 🙏 Acknowledgments

- Google for providing the Gemini API
- Mistral AI for the conversational AI model
- Pinecone for vector database infrastructure
- The open-source community for incredible tools and libraries
- All contributors who help improve EchoLearn

---

## 📞 Support

Need help? Here's how to get support:

- 📧 Email: support@echolearn.com
- 💬 Discord: [Join our community](https://discord.gg/echolearn)
- 📖 Documentation: [docs.echolearn.com](https://docs.echolearn.com)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/ACE-Z666/Echolearn/issues)

---

## 🌟 Star History

If you find EchoLearn helpful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=ACE-Z666/Echolearn&type=Date)](https://star-history.com/#ACE-Z666/Echolearn&Date)

---

<div align="center">

**Made with ❤️ by students, for students**

[⬆ Back to Top](#echolearn-)

</div>
