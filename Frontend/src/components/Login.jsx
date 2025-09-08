import React, { useEffect, useState } from 'react';
import shreeLogo from '../assets/shree-logo.png'; 
import shreeLogoShort from '../assets/shree-logo-short.png'
import microsoftLogo from '../assets/microsoft-logo.png'; 


const Login = () => {
  const [error, setError] = useState(null);
  
  // Set page title
  useEffect(() => {
    document.title = "Login - Shree Portal";
  }, []);
  
  // Check for login/logout status from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginStatus = urlParams.get('login');
    const logoutStatus = urlParams.get('logout');
    const errorParam = urlParams.get('error');
    
    if (loginStatus === 'success') {
      // Clear URL parameters and reload to trigger user context update
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    } else if (logoutStatus === 'success') {
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (errorParam) {
      setError('Authentication failed. Please try again or contact support.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSSOLogin = () => {
    // Redirect to backend SSO endpoint
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:4443';
    window.location.href = `${apiBaseUrl}/auth/sso`;
  };

  const styles = {
    loginContainer: {
      minHeight: '100vh',
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
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      boxSizing: 'border-box'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      // backgroundColor: '#3b82f6',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    portalTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0
    },
    downloadBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      textDecoration: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '500',
      border: '1px solid #cbd5e1',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    },
    contentWrapper: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      width: '100%',
      minHeight: 'calc(100vh - 200px)',
      boxSizing: 'border-box'
    },
    background: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      opacity: 0.05,
      zIndex: -1
    },
    mainContent: {
      width: '100%',
      maxWidth: '1200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '4rem'
    },
    loginSection: {
      width: '100%',
      maxWidth: '450px'
    },
    heroSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    heroImage: {
      width: '300px',
      height: '300px',
      marginBottom: '2rem',
      // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '4rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    heroTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '1rem',
      lineHeight: 1.2
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      color: '#64748b',
      maxWidth: '400px',
      lineHeight: 1.6
    },
    loginBox: {
      backgroundColor: '#ffffff',
      padding: '3rem 2.5rem',
      borderRadius: '20px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '1px solid #e2e8f0',
      textAlign: 'center'
    },
    welcomeTitle: {
      fontSize: '2.25rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#64748b',
      marginBottom: '2.5rem',
      lineHeight: 1.5
    },
    azureBtn: {
      width: '100%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '1rem 1.5rem',
      backgroundColor: '#0078d4',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      position: 'relative',
      overflow: 'hidden'
    },
    azureIcon: {
      width: '24px',
      height: '24px',
      background: `url(${microsoftLogo})  no-repeat center`,
      backgroundSize: 'contain'
    },
    footer: {
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '1.5rem 2rem',
      textAlign: 'center',
      width: '100%',
      boxSizing: 'border-box'
    },
    footerText: {
      margin: '0.25rem 0',
      fontSize: '0.875rem',
      color: '#64748b'
    },
    '@media (max-width: 768px)': {
      mainContent: {
        flexDirection: 'column',
        gap: '2rem'
      },
      heroImage: {
        width: '200px',
        height: '200px',
        fontSize: '3rem'
      },
      heroTitle: {
        fontSize: '2rem'
      },
      loginBox: {
        padding: '2rem 1.5rem'
      }
    }
  };

  return (
    <div style={styles.loginContainer}>
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
            overflow-x: hidden;
          }
        `}
      </style>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoIcon}>
          <img src={shreeLogoShort} alt="Shree Logo short" style={{ height: '20px', width: 'auto' }} />
          
          </div>
          <h1 style={styles.portalTitle}>BTL Marketing Execution Portal</h1>
        </div>
        {/* <a 
          href="/template/download" 
          style={styles.downloadBtn}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e2e8f0';
            e.target.style.borderColor = '#94a3b8';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f1f5f9';
            e.target.style.borderColor = '#cbd5e1';
          }}
        >
          ⬇ Download Template
        </a> */}
      </header>

      {/* Scrollable Content Wrapper */}
      <div style={styles.contentWrapper}>
        <div style={styles.background}></div>
        
        {/* Main Content */}
        <main style={styles.mainContent}>
          {/* Hero Section */}
          <section style={styles.heroSection}>
            <div style={styles.heroImage}>
            <img src={shreeLogo} alt="Shree Logo" style={{ height: '80px', width: 'auto' }} />
            </div>
            <h2 style={styles.heroTitle}>
              Enterprise Data Portal
            </h2>
            <p style={styles.heroSubtitle}>
              Streamline your marketing execution with secure, enterprise-grade data management solutions
            </p>
          </section>

          {/* Login Section */}
          <section id="login-section" style={styles.loginSection}>
            <div style={styles.loginBox}>
              <h2 style={styles.welcomeTitle}>Welcome back</h2>
              <p style={styles.subtitle}>Sign in with your Microsoft account to continue</p>
              <button 
                id="login-btn" 
                style={styles.azureBtn}
                onClick={handleSSOLogin}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#106ebe';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(16, 110, 190, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#0078d4';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={styles.azureIcon}></div>
                Sign in with Microsoft
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>Secure enterprise data management</p>
        <p style={styles.footerText}>© 2025 Shree Cement Data Portal. All rights reserved.</p>
      </footer>
      {/* Error message for SSO failures */}
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
    </div>
  );
};

export default Login;