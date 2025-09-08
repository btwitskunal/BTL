import React, { useState, useEffect } from 'react';

const TemplateManager = () => {
  // Set page title
  useEffect(() => {
    document.title = "Template Manager - Shree Portal";
  }, []);
  
  const [schema, setSchema] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:4443';
    
    fetch(`${apiBaseUrl}/api/template`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setSchema(data.columns || []))
      .catch((error) => {
        console.error('Failed to fetch template schema:', error);
        setError('Unable to load template structure. Please check your connection and try again.');
      });
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    setUploading(true);
    setMessage('');
    setError('');
    const formData = new FormData();
    formData.append('template', file);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:4443';
      const res = await fetch(`${apiBaseUrl}/api/template`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Template updated successfully');
        // Refresh schema
        fetch(`${apiBaseUrl}/api/template`)
          .then(res => res.json())
          .then(data => setSchema(data.columns || []))
          .catch(error => {
            console.error('Failed to refresh schema:', error);
          });
      } else {
        setError(data.error || 'Failed to update template. Please try again.');
      }
    } catch (err) {
      console.error('Template upload error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError('Failed to upload template. Please try again in a few moments.');
      }
    }
    setUploading(false);
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    setMessage('');
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:4443';
      const res = await fetch(`${apiBaseUrl}/api/template/download`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setMessage('Template downloaded successfully');
    } catch (err) {
      console.error('Template download error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError('Failed to download template. Please try again in a few moments.');
      }
    }
    setDownloading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Template Management</h2>
      <button onClick={handleDownload} disabled={downloading} style={{ marginBottom: 16 }}>
        {downloading ? 'Downloading...' : 'Download Current Template'}
      </button>
      <h3>Current Template Structure</h3>
      {schema.length === 0 ? <p>No schema found.</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 4 }}>Column Name</th>
              <th style={{ border: '1px solid #ccc', padding: 4 }}>Type</th>
              <th style={{ border: '1px solid #ccc', padding: 4 }}>Position</th>
            </tr>
          </thead>
          <tbody>
            {schema.map(col => (
              <tr key={col.name}>
                <td style={{ border: '1px solid #ccc', padding: 4 }}>{col.name}</td>
                <td style={{ border: '1px solid #ccc', padding: 4 }}>{col.type}</td>
                <td style={{ border: '1px solid #ccc', padding: 4 }}>{col.position + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <form onSubmit={handleUpload} style={{ marginBottom: 16 }}>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        <button type="submit" disabled={uploading} style={{ marginLeft: 8 }}>
          {uploading ? 'Uploading...' : 'Upload New Template'}
        </button>
      </form>
      {message && <div style={{ color: 'green', marginBottom: 8 }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
    </div>
  );
};

export default TemplateManager; 