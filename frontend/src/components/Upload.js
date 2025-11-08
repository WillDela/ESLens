import React, { useState } from 'react';
import './Upload.css';

function Upload({ language, onHomeworkUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('language', language);

      const response = await fetch('/api/homework/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onHomeworkUploaded(data);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Failed to upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        {!preview ? (
          <label className="upload-area" htmlFor="file-input">
            <div className="upload-icon">📸</div>
            <h3>Upload Homework Photo</h3>
            <p>Click to select an image or drag and drop</p>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </label>
        ) : (
          <div className="preview-area">
            <img src={preview} alt="Homework preview" className="preview-image" />
            <button className="clear-button" onClick={handleClear}>
              ✕ Clear
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {selectedFile && !uploading && (
          <button className="primary-button" onClick={handleUpload}>
            🚀 Process Homework
          </button>
        )}

        {uploading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing your homework...</p>
            <p className="loading-sub">Extracting text, translating, preparing tutor...</p>
          </div>
        )}
      </div>

      <div className="instructions">
        <h4>📋 Tips for best results:</h4>
        <ul>
          <li>✓ Make sure the image is clear and well-lit</li>
          <li>✓ Include the full question</li>
          <li>✓ Avoid shadows or glare</li>
          <li>✓ Works best with printed text</li>
        </ul>
      </div>
    </div>
  );
}

export default Upload;
