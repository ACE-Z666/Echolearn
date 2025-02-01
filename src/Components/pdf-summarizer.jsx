import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const PDFProcessor = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [markdownOutput, setMarkdownOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a PDF file first.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("pdf", selectedFile);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/process_pdf/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMarkdownOutput(response.data.markdown_output);
        } catch (err) {
            setError("Error processing PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Upload PDF for Q&A Extraction</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Processing..." : "Upload"}
            </button>
            
            {error && <p className="error">{error}</p>}
            
            {markdownOutput && (
                <div className="markdown-container">
                    <h3>Generated Markdown Output</h3>
                    <ReactMarkdown>{markdownOutput}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default PDFProcessor;
