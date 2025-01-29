import { useState } from "react";
import axios from "axios";
import '../index.css';

function PdfSummarizer() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [minWords, setMinWords] = useState(50);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("min_words", minWords);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/summarize/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error: ", error);
      alert(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="container">
      <h2>PDF Summarizer</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <input 
        type="number" 
        value={minWords} 
        onChange={(e) => setMinWords(e.target.value)} 
        placeholder="Min words for summary" 
      />
      <button onClick={handleUpload}>Summarize</button>
      {summary && (
        <div>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default PdfSummarizer;
