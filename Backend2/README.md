# PDF Summarizer Flask Backend

This is the Flask backend for the PDF Summarizer application. It processes PDF files and generates structured summaries using the DeepSeek API.

## Features

- PDF text extraction
- Integration with DeepSeek API for text processing
- CORS support for frontend integration
- Error handling and retries for API calls
- Environment variable support for API keys

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory and add your DeepSeek API key:
```
DEEPSEEK_API_KEY=your_api_key_here
```

## Running the Application

1. Start the Flask server:
```bash
python app.py
```

2. The server will run on `http://127.0.0.1:8000`

## API Endpoints

### POST /api/process_pdf/

Processes a PDF file and returns a structured summary.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: 
  - `pdf_file`: PDF file to process

**Response:**
- Success (200):
  ```json
  {
    "markdown_output": "Processed markdown content"
  }
  ```
- Error (400/500):
  ```json
  {
    "error": "Error message"
  }
  ```

## Frontend Integration

The backend is configured to work with the React frontend. Make sure your frontend is making requests to `http://127.0.0.1:8000/api/process_pdf/`. 