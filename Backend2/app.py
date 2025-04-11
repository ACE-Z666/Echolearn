from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import requests
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Configure CORS with specific options
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# DeepSeek API Details
API_KEY = "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"
API_URL = "https://openrouter.ai/api/v1/chat/completions"

def extract_text_from_pdf(pdf_file) -> str:
    """
    Extracts text from the entire PDF and returns it as a single string.
    """
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    full_text = "\n".join([page.get_text("text") for page in doc])
    return full_text

def process_with_deepseek(text: str) -> str:
    """
    Sends the extracted text to DeepSeek API for processing.
    """
    payload = {
        "model": "google/gemini-2.5-pro-exp-03-25:free",
        "messages": [
            {
                "role": "system",
                "content": "You are an AI that processes study notes for engineering students. "
                           "Extract key points and structure the content in a markdown format. "
                           "Remove any irrelevant layout texts from the PDF."
            },
            {"role": "user", "content": text}
        ]
    }
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    MAX_RETRIES = 5
    WAIT_TIME = 2  # Initial wait time in seconds

    for attempt in range(MAX_RETRIES):
        try:
            response = requests.post(API_URL, json=payload, headers=headers, timeout=10)
            response.raise_for_status()

            # Log the full API response for debugging
            print("API Response:", response.json())

            # Extracting the first choice from the response
            data = response.json()
            choices = data.get("choices", [])
            if choices:
                return choices[0]["message"]["content"]
            else:
                print("No 'choices' field in the API response.")
                return None

        except requests.exceptions.HTTPError as http_err:
            if response.status_code == 429:  # Too Many Requests
                wait = WAIT_TIME * (2 ** attempt)
                print(f"Rate limited! Retrying in {wait} seconds...")
                time.sleep(wait)
            else:
                print(f"HTTP error occurred: {http_err}")
                print(f"Response content: {response.content}")
                return None

        except requests.exceptions.RequestException as req_err:
            print(f"Request error occurred: {req_err}")
            return None

        except Exception as e:
            print(f"Unexpected error occurred: {e}")
            return None

    return None  # If all retries fail

@app.route('/api/process_pdf/', methods=['POST', 'OPTIONS'])
def process_pdf():
    """
    Handles PDF file uploads, extracts all text, and processes it using DeepSeek API.
    """
    if request.method == 'OPTIONS':
        return '', 204

    if 'pdf_file' not in request.files:
        return jsonify({"error": "No PDF file uploaded"}), 400

    pdf_file = request.files['pdf_file']

    if not pdf_file.filename.endswith('.pdf'):
        return jsonify({"error": "File is not a PDF"}), 400

    try:
        # Step 1: Extract full text from the PDF
        full_text = extract_text_from_pdf(pdf_file)

        if not full_text.strip():
            return jsonify({"error": "No text could be extracted from the PDF"}), 400

        # Step 2: Process using DeepSeek API
        structured_output = process_with_deepseek(full_text)

        if structured_output is None:
            return jsonify({"error": "Failed to process"}), 500

        # Return structured output as JSON
        return jsonify({"markdown_output": structured_output}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080) 