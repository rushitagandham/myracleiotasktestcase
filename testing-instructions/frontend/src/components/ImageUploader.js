import React, { useState, useCallback } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [context, setContext] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [testCases, setTestCases] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);  

  const handleContextChange = (e) => {
    setContext(e.target.value);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = Array.from(e.dataTransfer.files);
    setSelectedFiles((prevFiles) => {
      const fileNames = prevFiles.map((file) => file.name);
      return [...prevFiles, ...newFiles.filter((file) => !fileNames.includes(file.name))];
    });
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => {
      const fileNames = prevFiles.map((file) => file.name);
      return [...prevFiles, ...newFiles.filter((file) => !fileNames.includes(file.name))];
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please upload at least one image.');
      return;
    }

    const formData = new FormData();
    formData.append('context', context);

    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.urls) {
        alert('Images uploaded successfully!');
        setUploadSuccess(true); 
        setSelectedFiles([]);   
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images.');
    }
  };

  const handleDelete = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const generateTestCases = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/generate-test-cases');
      if (response.data.testCases) {
        setTestCases(response.data.testCases);
      }
    } catch (error) {
      console.error('Error generating test cases:', error);
      alert('Failed to generate test cases.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Upload Screenshots</h1>

      <div className="form-group">
        <label>Optional Context</label>
        <textarea
          value={context}
          onChange={handleContextChange}
          placeholder="Enter optional context"
          className="context-input"
        />
      </div>

      <div
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Drag & drop images here or click to select files</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-btn">Select Files</label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="uploaded-images">
          <h3>Preview of Selected Images:</h3>
          <div className="image-preview">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="image-container">
                <img src={URL.createObjectURL(file)} alt={`selected-${idx}`} />
                <button onClick={() => handleDelete(idx)} className="delete-btn">x</button>
              </div>
            ))}
          </div>
          <button onClick={handleUpload} className="upload-btn">Upload Images</button>
        </div>
      )}

      {uploadSuccess && (
        <div>
          <p>Images uploaded successfully!</p>
          <button onClick={generateTestCases} className="generate-btn">
            Generate Testing Instructions
          </button>
        </div>
      )}

      {loading && <p>Generating test cases...</p>}

      {testCases && (
        <div className="generated-test-cases">
          <h3>Generated Test Cases:</h3>
          <pre>{testCases}</pre>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
