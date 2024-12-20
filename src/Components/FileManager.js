import React, { useState } from "react";
import axios from "axios";

const FileManager = () => {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState("");
  const [downloadId, setDownloadId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:92/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFileId(response.data.split(": ")[1]); // Extract file ID from response
      setMessage(response.data);
      setError("");
    } catch (err) {
      setError(err.response ? err.response.data : "File upload failed");
    }
  };

  const handleDownload = async (event) => {
    event.preventDefault();

    if (!downloadId) {
      setError("Please enter a file ID to download.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:92/api/files/download/${downloadId}`, {
        responseType: "blob", // Ensure the response is treated as a file
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "downloadedFile");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage("File downloaded successfully.");
      setError("");
    } catch (err) {
      setError(err.response ? err.response.data : "File download failed");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>File Manager</h2>

      {/* Upload Section */}
      <form onSubmit={handleUpload}>
        <h3>Upload File</h3>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {fileId && <p>Uploaded File ID: <strong>{fileId}</strong></p>}

      <hr />

      {/* Download Section */}
      <form onSubmit={handleDownload}>
        <h3>Download File</h3>
        <input
          type="text"
          placeholder="Enter File ID"
          value={downloadId}
          onChange={(e) => setDownloadId(e.target.value)}
        />
        <button type="submit">Download</button>
      </form>

      {/* Messages */}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FileManager;
