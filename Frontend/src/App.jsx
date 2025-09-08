import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Upload from './components/Upload';
import Analytics from './components/Analytics';
import TemplateManager from './components/TemplateManager';

export const UserContext = createContext(null);

function AdminRoute({ children }) {
  const { user } = React.useContext(UserContext);
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/analytics" />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set default title
    document.title = "Shree Portal";
    
    // Fetch user profile on mount
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:4443';
    
    fetch(`${apiBaseUrl}/auth/profile`, {
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 401) {
          // User not authenticated, redirect to login
          setUser(null);
          setLoading(false);
          return;
        }
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Authentication check failed:', error);
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center' }}>
        <img 
          src="/src/assets/shree-logo.png" 
          alt="Shree Logo" 
          style={{ 
            width: '120px', 
            height: 'auto', 
            marginBottom: '16px' 
          }} 
        />
        <p style={{ color: '#6b7280', margin: 0 }}>Loading Shree Portal...</p>
      </div>
    </div>
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Only DO can access upload */}
          <Route path="/upload" element={user?.role === 'DO' ? <Upload /> : <Navigate to="/analytics" />} />
          {/* Both DO and ADMIN can access analytics */}
          <Route path="/analytics" element={user?.role === 'DO' || user?.role === 'ADMIN' ? <Analytics /> : <Navigate to="/login" />} />
          {/* Only ADMIN can access template manager */}
          <Route path="/template-manager" element={<AdminRoute><TemplateManager /></AdminRoute>} />
          {/* Default route: redirect based on role */}
          <Route path="*" element={
            user?.role === 'DO' ? <Navigate to="/upload" /> :
            user?.role === 'ADMIN' ? <Navigate to="/analytics" /> :
            <Navigate to="/login" />
          } />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;