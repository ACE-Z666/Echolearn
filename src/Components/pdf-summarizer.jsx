import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // Import rehype-raw for HTML rendering
import "../index.css";
import Rectblur from "./rectblur";

const PDFProcessor = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [markdownOutput, setMarkdownOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileSizeError, setFileSizeError] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setFileName(file ? file.name : "");
        setFileSizeError(file && file.size > 10 * 1024 * 1024); // Limit file size to 10MB
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
            const backendUrl = "http://127.0.0.1:8000"; // Hardcode the backend URL temporarily
            console.log("📡 Sending request to:", `${backendUrl}/api/process_pdf/`);
            console.log("📂 File being sent:", selectedFile);

            const response = await axios.post(`${backendUrl}/api/process_pdf/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("✅ Response received:", response);
            console.log("📜 Response Data:", response.data);

            // Check if the response has the 'choices' array and process accordingly
            if (response.data?.choices && response.data.choices.length > 0) {
                // Extract text from the first choice object
                setMarkdownOutput(response.data.choices[0]?.text || "No content available");
            } else {
                // Fallback if no 'choices' field is present
                setMarkdownOutput(response.data?.markdown_output || "No content available");
            }

        } catch (err) {
            console.error("❌ Full Error Object:", err); // Log the full error object
            console.error("❌ Response:", err.response); // Log the response (if available)

            if (err.response) {
                setError(err.response.data?.error || "Error processing PDF. Please try again.");
            } else {
                setError("Network error or backend not reachable.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-pdf">
            <div className="rectblur-container">
                <Rectblur />
            </div>

            <h2 className="title-pdf">Summarize Your PDF File</h2>
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
                {loading ? "Wait few Seconds.." : (
                    "Upload"
                )}
            </button>

            {error && <p className="error">{error}</p>}

            {markdownOutput && (
                <div className="markdown-container">
                    <h3 className="markdown-title">Generated Markdown Output</h3>
                    {/* Use rehypeRaw to render HTML in Markdown */}
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} className="markdown-content">
                        {markdownOutput}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default PDFProcessor;
