import React, { useState, useRef, useContext } from 'react';
import * as XLSX from 'xlsx';
import shreeLogoShort from '../assets/shree-logo-short.png'
import { Upload, FileSpreadsheet, Download, LogOut, X, Eye, Trash2, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { UserContext } from '../App';
import LoadingSpinner from './LoadingSpinner';
import ProgressBar from './ProgressBar';

const UploadPortal = () => {
  const { user } = useContext(UserContext);
  
  // Set page title
  React.useEffect(() => {
    document.title = "Upload Data - Shree Portal";
  }, []);
  
  if (user?.role !== 'DO') {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>Access denied: Only DO users can upload files.</div>;
  }
  const [fileName, setFileName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [reportUrl, setReportUrl] = useState(null);
  const fileInputRef = useRef(null);

  const styles = {
    container: {
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      backgroundColor: '#f8fafc',
      color: '#1e293b',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      width: '100%',
      boxSizing: 'border-box',
      flexShrink: 0
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    logo: {
      width: '40px',
      height: '40px',
      // backgroundColor: '#3b82f6',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'black',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerActions: {
      display: 'flex',
      gap: '0.75rem'
    },
    headerBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '500',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: 'none'
    },
    primaryBtn: {
      backgroundColor: '#3b82f6',
      color: '#ffffff'
    },
    secondaryBtn: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
      border: '1px solid #cbd5e1'
    },
    main: {
      flex: 1,
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'auto'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      padding: '2rem',
      width: '100%',
      boxSizing: 'border-box'
    },
    cardHeader: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    cardTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem'
    },
    cardSubtitle: {
      fontSize: '1rem',
      color: '#64748b',
      margin: 0
    },
    dropZone: {
      border: '2px dashed #cbd5e1',
      borderRadius: '12px',
      padding: '3rem 2rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: '#f8fafc',
      marginBottom: '1.5rem'
    },
    dropZoneActive: {
      borderColor: '#3b82f6',
      backgroundColor: '#f0f9ff'
    },
    uploadIcon: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1rem',
      color: '#94a3b8'
    },
    dropZoneTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem'
    },
    dropZoneText: {
      color: '#64748b',
      marginBottom: '1rem'
    },
    supportedFormats: {
      fontSize: '0.875rem',
      color: '#64748b',
      backgroundColor: '#f1f5f9',
      padding: '0.75rem',
      borderRadius: '8px',
      display: 'inline-block'
    },
    fileInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '8px',
      marginBottom: '1rem'
    },
    fileDetails: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    fileName: {
      fontWeight: '600',
      color: '#1e293b'
    },
    fileType: {
      fontSize: '0.875rem',
      color: '#64748b'
    },
    iconButton: {
      background: 'none',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '6px',
      transition: 'background-color 0.2s ease'
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      textDecoration: 'none'
    },
    buttonPrimary: {
      backgroundColor: '#3b82f6',
      color: '#ffffff'
    },
    buttonSecondary: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
      border: '1px solid #cbd5e1'
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      color: '#3b82f6',
      border: '1px solid #3b82f6'
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'flex-end',
      marginTop: '1.5rem'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '8px',
      marginBottom: '1rem',
      color: '#0369a1'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid #bae6fd',
      borderTopColor: '#0369a1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    message: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem'
    },
    messageSuccess: {
      backgroundColor: '#f0fdf4',
      color: '#15803d',
      border: '1px solid #bbf7d0'
    },
    messageError: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca'
    },
    messageWarning: {
      backgroundColor: '#fffbeb',
      color: '#d97706',
      border: '1px solid #fed7aa'
    },
    modal: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    },
    modalContent: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem',
      borderBottom: '1px solid #e2e8f0'
    },
    modalTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    previewContent: {
      padding: '1.5rem',
      maxHeight: '60vh',
      overflow: 'auto'
    },
    footer: {
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '0.75rem 2rem',
      textAlign: 'center',
      width: '100%',
      boxSizing: 'border-box',
      flexShrink: 0
    },
    footerText: {
      margin: 0,
      fontSize: '0.875rem',
      color: '#64748b'
    }
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    preventDefaults(e);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = () => {
    const files = fileInputRef.current.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      setMessage({ text: '', type: '' });
    }
  };

  const resetFileInput = () => {
    fileInputRef.current.value = '';
    setFileName('');
    setMessage({ text: '', type: '' });
  };

  const previewFile = () => {
    const file = fileInputRef.current.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const html = XLSX.utils.sheet_to_html(firstSheet);
      setPreviewData(html);
      setShowPreview(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (!fileInputRef.current.files.length) {
      setMessage({ text: 'Please select a file first', type: 'error' });
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:4443';
      const response = await fetch(`${apiBaseUrl}/upload`, {
        method: 'POST',
        body: formData
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const result = await response.json();
      
      setIsLoading(false);
      setReportUrl(null); // Reset previous report link
      
      if (response.ok) {
        if (result.errors && result.errors.length > 0) {
          setMessage({ 
            text: `${result.rowsInserted} rows inserted successfully, but ${result.errors.length} rows had errors. Please review the error report.`, 
            type: 'warning' 
          });
          console.error('Upload errors:', result.errors);
        } else {
          setMessage({ 
            text: `File processed successfully! ${result.rowsInserted} rows inserted into the database.`, 
            type: 'success' 
          });
        }
      } else {
        // Check for error report URL
        if (result.reportUrl) {
          setReportUrl(`${apiBaseUrl}${result.reportUrl}`);
          setMessage({ text: result.message || 'File processed with errors. Download the error report below to see details.', type: 'error' });
        } else {
          setMessage({ text: result.error || 'Upload failed. Please try again with a valid Excel file.', type: 'error' });
        }
      }
    } catch (error) {
      clearInterval(progressInterval);
      setIsLoading(false);
      console.error('Upload error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setMessage({ text: 'Unable to connect to server. Please check your internet connection and try again.', type: 'error' });
      } else {
        setMessage({ text: 'Upload failed. Please try again in a few moments.', type: 'error' });
      }
      setReportUrl(null);
    }
  };

  const getMessageStyle = () => {
    const baseStyle = styles.message;
    switch (message.type) {
      case 'success':
        return { ...baseStyle, ...styles.messageSuccess };
      case 'error':
        return { ...baseStyle, ...styles.messageError };
      case 'warning':
        return { ...baseStyle, ...styles.messageWarning };
      default:
        return baseStyle;
    }
  };

  const getMessageIcon = () => {
    switch (message.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .drop-zone-hover {
            border-color: #3b82f6 !important;
            background-color: #f0f9ff !important;
          }
          button:hover {
            transform: translateY(-1px);
          }
          .preview-table table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;
          }
          .preview-table th,
          .preview-table td {
            border: 1px solid #e2e8f0;
            padding: 0.5rem;
            text-align: left;
          }
          .preview-table th {
            background-color: #f8fafc;
            font-weight: 600;
          }
        `}
      </style>
      
      <header style={styles.header}>
        <div style={styles.brand}>
                    <div style={styles.logo}>
            <img src={shreeLogoShort} alt="Shree Logo" style={{ height: '20px', width: 'auto' }} />
          </div>
          <h1 style={styles.title}>BTL Marketing Execution Portal</h1>
        </div>
        <div style={styles.headerActions}>
          <a 
            href="https://localhost:4443/template/download" 
            style={{...styles.headerBtn, ...styles.primaryBtn}}
          >
            <Download size={16} />
            Download Template
          </a>
          <button 
            onClick={async () => {
              try {
                const response = await fetch('https://localhost:4443/auth/logout', {
                  method: 'POST',
                  credentials: 'include'
                });
                if (response.ok) {
                  window.location.href = '/login';
                }
              } catch (err) {
                console.error('Logout failed:', err);
                window.location.href = '/login';
              }
            }}
            style={{...styles.headerBtn, ...styles.secondaryBtn}}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Upload Excel Files</h2>
            <p style={styles.cardSubtitle}>Upload your marketing execution data files for processing</p>
          </div>

          <div 
            style={styles.dropZone}
            onDragEnter={preventDefaults}
            onDragOver={(e) => {
              preventDefaults(e);
              e.currentTarget.classList.add('drop-zone-hover');
            }}
            onDragLeave={(e) => {
              preventDefaults(e);
              e.currentTarget.classList.remove('drop-zone-hover');
            }}
            onDrop={(e) => {
              handleDrop(e);
              e.currentTarget.classList.remove('drop-zone-hover');
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <div style={styles.uploadIcon}>
              <Upload size={48} />
            </div>
            <h3 style={styles.dropZoneTitle}>Drag and drop your files here</h3>
            <p style={styles.dropZoneText}>or click to browse from your computer</p>
            <div style={styles.supportedFormats}>
              <strong>Supported formats:</strong> .xlsx, .xls • <strong>Max size:</strong> 25MB
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              accept=".xlsx,.xls" 
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </div>

          {fileName && (
            <div style={styles.fileInfo}>
              <div style={styles.fileDetails}>
                <FileSpreadsheet size={24} color="#10b981" />
                <div>
                  <div style={styles.fileName}>{fileName}</div>
                  <div style={styles.fileType}>Excel file selected</div>
                </div>
              </div>
              <button 
                style={styles.iconButton} 
                onClick={resetFileInput}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#fee2e2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}

          {isLoading && (
            <div style={styles.loading}>
              <LoadingSpinner size={32} text="Processing your file..." />
              {uploadProgress > 0 && (
                <ProgressBar 
                  progress={uploadProgress} 
                  text="Upload progress"
                  showPercentage={true}
                />
              )}
            </div>
          )}

          {message.text && (
            <div style={getMessageStyle()}>
              {getMessageIcon()}
              {message.text}
              {reportUrl && (
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href={reportUrl}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: '#3b82f6',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 500,
                      marginTop: '0.5rem',
                    }}
                    download
                  >
                    <Download size={16} />
                    Download Error Report
                  </a>
                </div>
              )}
            </div>
          )}

          <div style={styles.buttonGroup}>
            {fileName && (
              <button 
                style={{...styles.button, ...styles.buttonOutline}}
                onClick={previewFile}
              >
                <Eye size={16} />
                Preview
              </button>
            )}
            <button 
              style={{...styles.button, ...styles.buttonSecondary}} 
              onClick={resetFileInput}
            >
              <X size={16} />
              Cancel
            </button>
            <button 
              style={{
                ...styles.button, 
                ...styles.buttonPrimary,
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              onClick={handleSubmit}
              disabled={!fileName || isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size={16} text="" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload File
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {showPreview && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <FileSpreadsheet size={20} />
                Excel File Preview
              </h3>
              <button 
                style={styles.iconButton} 
                onClick={() => setShowPreview(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div 
              style={styles.previewContent}
              className="preview-table"
              dangerouslySetInnerHTML={{ __html: previewData }}
            />
          </div>
        </div>
      )}

      <footer style={styles.footer}>
      <p style={styles.footerText}>&copy; Secure enterprise data management.</p>
        <p style={styles.footerText}>&copy; 2025 Shree Cement Limited. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UploadPortal;