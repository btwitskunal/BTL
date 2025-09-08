import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { Search, Users, MapPin, BarChart3, PieChart, Filter, User, Building2, LogOut, Download, Settings } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import shreeLogoShort from '../assets/shree-logo-short.png';
import { UserContext } from '../App';

// Debounce utility function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const styles = {
  page: {
    minHeight: '100vh',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f8fafc',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#1e293b',
    margin: 0,
    padding: 0,
    overflowY: 'auto', // allow vertical scroll
    display: 'block',  // not flex
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
    boxSizing: 'border-box',
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
    //border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    background: '#f8fafc',
  },
  portalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  contentWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem',
    boxSizing: 'border-box',
    // Removed minHeight, flex, alignItems, overflowY
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e2e8f0',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '1200px',
    boxSizing: 'border-box',
    margin: '0 auto',
    // Removed minHeight
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem',
    textAlign: 'left',
  },
  tabBar: {
    display: 'flex',
    gap: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '2rem',
  },
  tabBtn: (active) => ({
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderBottom: active ? '3px solid #3b82f6' : '3px solid transparent',
    background: 'none',
    color: active ? '#3b82f6' : '#64748b',
    fontWeight: active ? 700 : 500,
    fontSize: '1rem',
    cursor: 'pointer',
    outline: 'none',
    transition: 'color 0.2s',
  }),
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    marginBottom: '1rem',
    marginRight: '1rem',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    marginBottom: '1rem',
    marginRight: '1rem',
    boxSizing: 'border-box',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    transition: 'all 0.2s ease',
    marginBottom: '1rem',
  },
  buttonSecondary: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1',
  },
  error: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    fontSize: '1rem',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc',
    fontWeight: 600,
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #f1f5f9',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '2rem',
    margin: '2rem 0',
  },
  summaryCard: {
    background: '#f8fafc',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  summaryText: {
    marginLeft: '1rem',
  },
  chartCard: {
    background: '#f8fafc',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    marginBottom: '2rem',
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
};

const searchFields = [
  { value: 'CUSTOMER_NAME', label: 'Customer Name' },
  { value: 'STATE', label: 'State' },
  { value: 'CITY', label: 'City' },
  { value: 'REGION', label: 'Region' },
  { value: 'ZONE', label: 'Zone' },
  { value: 'T_ZONE', label: 'T Zone' },
  { value: 'DISTIRCT', label: 'District' },
  { value: 'TALUKA', label: 'Taluka' },
  { value: 'TERRITORY_CODE', label: 'Territory Code' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

const CustomerAnalyticsDashboard = () => {
  // Set page title
  useEffect(() => {
    document.title = "Analytics Dashboard - Shree Portal";
  }, []);
  
  // Add error boundary state
  const [hasError, setHasError] = useState(false);
  
  // Reset error state on component mount
  useEffect(() => {
    setHasError(false);
  }, []);

  const [activeTab, setActiveTab] = useState('search');
  const [sapId, setSapId] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20);
  
  // Element visualization states
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementAttributes, setElementAttributes] = useState([]);
  const [elementUoms, setElementUoms] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [selectedUom, setSelectedUom] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null);
  const [visualizationLoading, setVisualizationLoading] = useState(false);
  const [visualizationError, setVisualizationError] = useState('');
  
  const { user } = useContext(UserContext);

  // Error boundary effect
  useEffect(() => {
    const handleError = (error) => {
      console.error('Analytics component error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Show error boundary if there's an error
  if (hasError) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Something went wrong</h2>
        <p>Please refresh the page or contact support.</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:4443';

  // Memoized fetch options to prevent unnecessary re-fetches
  const fetchOptions = useCallback(async () => {
    if (Object.keys(filterOptions).length > 0) return; // Already loaded
    
    setIsLoadingOptions(true);
    const options = {};
    try {
      for (const field of searchFields) {
        const res = await fetch(`${API_BASE_URL}/api/customers/fields?field=${field.value}`);
        const data = await res.json();
        options[field.value] = (data.values || []).map(v => ({ value: v, label: v }));
      }
      setFilterOptions(options);
    } catch (error) {
      console.error('Failed to fetch options:', error);
    } finally {
      setIsLoadingOptions(false);
    }
  }, [filterOptions, API_BASE_URL]);

  // Fetch filter options only once on mount
  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // Fetch elements for visualization
  const fetchElements = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/template/elements`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setElements(data.elements.map(el => ({ value: el, label: el })));
      } else {
        console.error('Failed to fetch elements:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch elements:', error);
    }
  }, [API_BASE_URL]);

  // Fetch element details (attributes and UOMs)
  const fetchElementDetails = useCallback(async (element) => {
    if (!element) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/template/elements/${encodeURIComponent(element)}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setElementAttributes(data.attributes.map(attr => ({ value: attr, label: attr })));
        setElementUoms(data.uoms.map(uom => ({ value: uom, label: uom })));
      } else {
        console.error('Failed to fetch element details:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch element details:', error);
    }
  }, [API_BASE_URL]);

  // Fetch customer BTL activities
  const fetchCustomerBTLActivities = useCallback(async () => {
    if (!sapId.trim()) {
      setError('Please enter a Customer SAP ID');
      return;
    }
    
    setLoading(true);
    setError('');
    setVisualizationData(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/template/customer-btl-activities/${sapId}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setVisualizationData(data);
        setCustomerData(data.customer_info);
      } else {
        setError(data.error || 'No BTL activities found for this customer');
        setVisualizationData(null);
      }
    } catch (error) {
      console.error('Failed to fetch customer BTL activities:', error);
      setError('Unable to load customer activities. Please check your connection and try again.');
      setVisualizationData(null);
    } finally {
      setLoading(false);
    }
  }, [sapId, API_BASE_URL]);

  // Load elements when visualization tab is selected
  useEffect(() => {
    if (activeTab === 'visualization' && elements.length === 0) {
      fetchElements();
    }
  }, [activeTab, elements.length, fetchElements]);

  // Fetch element details when element is selected
  useEffect(() => {
    if (selectedElement) {
      fetchElementDetails(selectedElement);
      setSelectedAttribute(null);
      setSelectedUom(null);
    }
  }, [selectedElement, fetchElementDetails]);

  // Note: fetchCustomerBTLActivities is called only when user clicks the search button

  // Memoized customer fetch function
  const fetchCustomerBySapId = useCallback(async () => {
    if (!sapId.trim()) {
      setError('Please enter a SAP ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers/${sapId}`);
      const data = await response.json();
      
      if (response.ok) {
        setCustomerData(data);
      } else {
        setError(data.message || 'Customer not found');
        setCustomerData(null);
      }
    } catch (err) {
      console.error('Failed to fetch customer data:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError('Failed to fetch customer data. Please try again in a few moments.');
      }
      setCustomerData(null);
    } finally {
      setLoading(false);
    }
  }, [sapId, API_BASE_URL]);

  // Memoized search function
  const searchCustomers = useCallback(async () => {
    setLoading(true);
    setError('');
    setAnalytics({});
    setSearchResults([]);
    setCurrentPage(1);
    
    try {
      const params = [];
      for (const key in selectedFilters) {
        if (selectedFilters[key]?.length > 0) {
          params.push(`${encodeURIComponent(key)}=${selectedFilters[key].map(v => encodeURIComponent(v.value)).join(',')}`);
        }
      }
      const query = params.length ? `?${params.join('&')}` : '';
      const response = await fetch(`${API_BASE_URL}/api/customers/search${query}`);
      const data = await response.json();
      
      if (response.ok) {
        setSearchResults(data);
        generateAnalytics(data);
      } else {
        setError(data.error || 'No customers found');
      }
    } catch (err) {
      console.error('Failed to search customers:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError('Failed to search customers. Please try again in a few moments.');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedFilters, API_BASE_URL]);

  // Debounced search to prevent excessive API calls
  const debouncedSearch = useMemo(
    () => debounce(searchCustomers, 300),
    [searchCustomers]
  );

  // Memoized analytics generation
  const generateAnalytics = useCallback((data) => {
    if (!data || data.length === 0) return;

    const stateCount = {};
    const regionCount = {};
    const zoneCount = {};
    const cityCount = {};

    data.forEach(customer => {
      stateCount[customer.STATE] = (stateCount[customer.STATE] || 0) + 1;
      regionCount[customer.REGION] = (regionCount[customer.REGION] || 0) + 1;
      zoneCount[customer.ZONE] = (zoneCount[customer.ZONE] || 0) + 1;
      cityCount[customer.CITY] = (cityCount[customer.CITY] || 0) + 1;
    });

    const stateData = Object.entries(stateCount).map(([name, value]) => ({ name, value }));
    const regionData = Object.entries(regionCount).map(([name, value]) => ({ name, value }));
    const zoneData = Object.entries(zoneCount).map(([name, value]) => ({ name, value }));
    const cityData = Object.entries(cityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    setAnalytics({
      total: data.length,
      states: stateData,
      regions: regionData,
      zones: zoneData,
      cities: cityData
    });
  }, []);

  // Memoized CSV download
  const downloadCSV = useCallback(() => {
    if (!searchResults.length) return;
    const header = Object.keys(searchResults[0]);
    const csvRows = [header.join(',')];
    for (const row of searchResults) {
      csvRows.push(header.map(h => '"' + (row[h] ?? '').toString().replace(/"/g, '""') + '"').join(','));
    }
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_analysis.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [searchResults]);

  // Memoized pagination
  const paginatedResults = useMemo(() => 
    searchResults.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage),
    [searchResults, currentPage, rowsPerPage]
  );
  
  const totalPages = useMemo(() => 
    Math.ceil(searchResults.length / rowsPerPage),
    [searchResults.length, rowsPerPage]
  );

  // Memoized filter change handler
  const handleFilterChange = useCallback((field, values) => {
    setSelectedFilters(prev => ({ ...prev, [field]: values }));
  }, []);

  if (user?.role !== 'DO' && user?.role !== 'ADMIN') {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>Access denied: Only DO or ADMIN users can view analytics.</div>;
  }

  return (
    <div style={styles.page}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow-x: hidden; }
      `}</style>
      {/* Header Bar */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoIcon}>
            <img src={shreeLogoShort} alt="Shree Logo short" style={{ height: '20px', width: 'auto' }} />
          </div>
          <h1 style={styles.portalTitle}>BTL Marketing Execution Portal</h1>
        </div>
        <div style={styles.headerActions}>
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => window.location.href = '/template-manager'}
              style={{
                ...styles.headerBtn,
                backgroundColor: '#3b82f6',
                color: 'white',
                border: '1px solid #2563eb'
              }}
            >
              <Settings size={16} />
              Template Manager
            </button>
          )}
          <button 
            onClick={async () => {
              try {
                const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                  method: 'POST',
                  credentials: 'include'
                });
                if (response.ok) {
                  window.location.href = '/login';
                } else {
                  throw new Error(`Logout failed: ${response.status}`);
                }
              } catch (err) {
                console.error('Logout failed:', err);
                // Still redirect to login even if logout fails
                window.location.href = '/login';
              }
            }}
            style={styles.headerBtn}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>
      <div style={styles.contentWrapper}>
        <div style={styles.card}>
          {/* Tab Bar */}
          <div style={styles.tabBar}>
            <button style={styles.tabBtn(activeTab === 'search')} onClick={() => setActiveTab('search')}>
              <User style={{ marginRight: 8 }} /> Customer Lookup
            </button>
            <button style={styles.tabBtn(activeTab === 'analytics')} onClick={() => setActiveTab('analytics')}>
              <BarChart3 style={{ marginRight: 8 }} /> Analytics & Search
            </button>
            <button style={styles.tabBtn(activeTab === 'visualization')} onClick={() => setActiveTab('visualization')}>
              <PieChart style={{ marginRight: 8 }} /> Element Visualization
            </button>
          </div>

          {/* Customer Lookup Tab */}
          {activeTab === 'search' && (
            <div>
              <h2 style={styles.sectionTitle}><Search style={{ marginRight: 8 }} />Search Customer by SAP ID</h2>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  value={sapId}
                  onChange={(e) => setSapId(e.target.value)}
                  placeholder="Enter Customer SAP ID"
                  style={{ ...styles.input, maxWidth: 300 }}
                  onKeyPress={(e) => e.key === 'Enter' && fetchCustomerBySapId()}
                />
                <button
                  onClick={fetchCustomerBySapId}
                  disabled={loading}
                  style={styles.button}
                >
                  {loading ? 'Searching...' : <><Search style={{ marginRight: 4 }} />Search</>}
                </button>
              </div>
              {error && <div style={styles.error}><p>{error}</p></div>}
              {customerData && (
                <div style={styles.chartCard}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#3b82f6', marginBottom: '1rem' }}>Customer Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    <div><label>Customer Number</label><p style={{ fontWeight: 600 }}>{customerData.customer_number}</p></div>
                    <div><label>Customer Name</label><p style={{ fontWeight: 600 }}>{customerData.customer_name}</p></div>
                    <div><label>Territory Code</label><p>{customerData.territory_code}</p></div>
                    <div><label>T Zone</label><p>{customerData.t_zone}</p></div>
                    <div><label>Zone</label><p>{customerData.zone}</p></div>
                    <div><label>State</label><p>{customerData.state}</p></div>
                    <div><label>Region</label><p>{customerData.region}</p></div>
                    <div><label>District</label><p>{customerData.district}</p></div>
                    <div><label>Taluka</label><p>{customerData.taluka}</p></div>
                    <div><label>City</label><p>{customerData.city}</p></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 style={styles.sectionTitle}><Filter style={{ marginRight: 8 }} />Advanced Customer Search</h2>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {searchFields.map(field => (
                  <div key={field.value} style={{ minWidth: 200, flex: 1 }}>
                    <label style={{ fontWeight: 500 }}>{field.label}</label>
                    <Select
                      isMulti
                      options={filterOptions[field.value] || []}
                      value={selectedFilters[field.value] || []}
                      onChange={(vals) => handleFilterChange(field.value, vals)}
                      placeholder={isLoadingOptions ? 'Loading...' : `Select ${field.label}`}
                      isClearable
                      isLoading={isLoadingOptions}
                    />
                  </div>
                ))}
                <button
                  onClick={debouncedSearch}
                  disabled={loading || isLoadingOptions}
                  style={{ ...styles.button, backgroundColor: '#22c55e', alignSelf: 'flex-end', minHeight: 48 }}
                >
                  {loading ? 'Searching...' : <><Search style={{ marginRight: 4 }} />Search</>}
                </button>
                <button
                  onClick={downloadCSV}
                  disabled={!searchResults.length}
                  style={{ ...styles.button, backgroundColor: '#3b82f6', alignSelf: 'flex-end', minHeight: 48 }}
                >
                  <Download style={{ marginRight: 4 }} />Download CSV
                </button>
              </div>
              {error && <div style={styles.error}><p>{error}</p></div>}

              {/* Analytics Section */}
              {analytics.total > 0 && (
                <>
                  {/* Summary Cards */}
                  <div style={styles.analyticsGrid}>
                    <div style={styles.summaryCard}>
                      <Users style={{ color: '#3b82f6', width: 32, height: 32 }} />
                      <div style={styles.summaryText}>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Total Customers</p>
                        <p style={{ fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>{analytics.total}</p>
                      </div>
                    </div>
                    <div style={styles.summaryCard}>
                      <MapPin style={{ color: '#22c55e', width: 32, height: 32 }} />
                      <div style={styles.summaryText}>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>States</p>
                        <p style={{ fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>{analytics.states?.length || 0}</p>
                      </div>
                    </div>
                    <div style={styles.summaryCard}>
                      <Building2 style={{ color: '#a21caf', width: 32, height: 32 }} />
                      <div style={styles.summaryText}>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Regions</p>
                        <p style={{ fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>{analytics.regions?.length || 0}</p>
                      </div>
                    </div>
                    <div style={styles.summaryCard}>
                      <PieChart style={{ color: '#f59e42', width: 32, height: 32 }} />
                      <div style={styles.summaryText}>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Cities</p>
                        <p style={{ fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>{analytics.cities?.length || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div style={styles.analyticsGrid}>
                    {/* State Distribution */}
                    <div style={styles.chartCard}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Distribution by State</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={analytics.states}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Region Distribution */}
                    <div style={styles.chartCard}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Distribution by Region</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                          <Pie
                            data={analytics.regions}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, value}) => `${name}: ${value}`}
                          >
                            {analytics.regions?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Top Cities */}
                    <div style={styles.chartCard}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Top 10 Cities</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={analytics.cities} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Zone Distribution */}
                    <div style={styles.chartCard}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Distribution by Zone</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={analytics.zones}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#f59e42" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}

              {/* Search Results Table with Pagination */}
              {searchResults.length > 0 && (
                <div style={styles.chartCard}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Search Results ({searchResults.length} customers)</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          {Object.keys(searchResults[0]).map(h => <th key={h} style={styles.th}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedResults.map((customer, index) => (
                          <tr key={index} style={{ background: index % 2 === 0 ? '#fff' : '#f8fafc' }}>
                            {Object.keys(customer).map(h => <td key={h} style={styles.td}>{customer[h]}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16, gap: 8 }}>
                        <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} style={styles.buttonSecondary}>Prev</button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} style={styles.buttonSecondary}>Next</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BTL Activity Visualization Tab */}
          {activeTab === 'visualization' && (
            <div>
              <h2 style={styles.sectionTitle}><PieChart style={{ marginRight: 8 }} />Customer BTL Activity Analysis</h2>
              
              {/* Customer Selection */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                {/* Customer SAP ID Input */}
                <div style={{ minWidth: 300, flex: 1 }}>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Customer SAP ID</label>
                  <input
                    type="text"
                    value={sapId}
                    onChange={(e) => setSapId(e.target.value)}
                    placeholder="Enter Customer SAP ID"
                    style={{ ...styles.input, maxWidth: '100%' }}
                    onKeyPress={(e) => e.key === 'Enter' && fetchCustomerBTLActivities()}
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={fetchCustomerBTLActivities}
                  disabled={loading || !sapId.trim()}
                  style={{ ...styles.button, alignSelf: 'flex-end', minHeight: 48 }}
                >
                  {loading ? 'Searching...' : <><Search style={{ marginRight: 4 }} />Find BTL Activities</>}
                </button>
              </div>

              {visualizationError && (
                <div style={styles.error}>
                  <p>{visualizationError}</p>
                </div>
              )}

              {/* Visualization Results */}
              {visualizationLoading && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>Loading visualization data...</p>
                </div>
              )}

              {visualizationData && !loading && (
                <>
                  {/* Customer Info */}
                  {customerData && (
                    <div style={styles.chartCard}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#3b82f6', marginBottom: '1rem' }}>Customer Information</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        <div><label>Customer Number</label><p style={{ fontWeight: 600 }}>{customerData.customer_number}</p></div>
                        <div><label>Customer Name</label><p style={{ fontWeight: 600 }}>{customerData.customer_name}</p></div>
                        <div><label>Territory Code</label><p>{customerData.territory_code}</p></div>
                        <div><label>Zone</label><p>{customerData.zone}</p></div>
                        <div><label>State</label><p>{customerData.state}</p></div>
                        <div><label>Region</label><p>{customerData.region}</p></div>
                      </div>
                    </div>
                  )}

                  {/* Summary Cards */}
                  <div style={styles.analyticsGrid}>
                    <div style={styles.summaryCard}>
                      <BarChart3 style={{ color: '#3b82f6', width: 32, height: 32 }} />
                      <div style={styles.summaryText}>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Total BTL Activities</p>
                        <p style={{ fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>{visualizationData.total_activities || 0}</p>
                      </div>
                    </div>
                    <div style={styles.summaryCard}>
                      <PieChart style={{ color: '#22c55e', width: 32, height: 32 }} />
                      <div style={styles.summaryText}>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Unique Elements</p>
                        <p style={{ fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>
                          {visualizationData.analytics?.element_distribution ? Object.keys(visualizationData.analytics.element_distribution).length : 0}
                        </p>
                      </div>
                    </div>
                    <div style={styles.summaryCard}>
                      <Filter style={{ color: '#a21caf', width: 32, height: 32 }} />
                      <div style={styles.summaryText}>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Unique Attributes</p>
                        <p style={{ fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>
                          {visualizationData.analytics?.attribute_distribution ? Object.keys(visualizationData.analytics.attribute_distribution).length : 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BTL Activity Distribution Charts */}
                  <div style={styles.analyticsGrid}>
                    {/* Element Distribution */}
                    {visualizationData.analytics?.element_distribution && Object.keys(visualizationData.analytics.element_distribution).length > 0 && (
                      <div style={styles.chartCard}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
                          BTL Activities by Element
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={Object.entries(visualizationData.analytics.element_distribution).map(([name, value]) => ({ name, value }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Attribute Distribution */}
                    {visualizationData.analytics?.attribute_distribution && Object.keys(visualizationData.analytics.attribute_distribution).length > 0 && (
                      <div style={styles.chartCard}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
                          BTL Activities by Attribute
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <RechartsPieChart>
                            <Pie
                              data={Object.entries(visualizationData.analytics.attribute_distribution).map(([name, value]) => ({ name, value }))}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, value}) => `${name}: ${value}`}
                            >
                              {Object.entries(visualizationData.analytics.attribute_distribution).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* UOM Distribution */}
                    {visualizationData.analytics?.uom_distribution && Object.keys(visualizationData.analytics.uom_distribution).length > 0 && (
                      <div style={styles.chartCard}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
                          BTL Activities by UOM
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={Object.entries(visualizationData.analytics.uom_distribution).map(([name, value]) => ({ name, value }))} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#22c55e" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* BTL Activities Table */}
                  {visualizationData.btl_activities && visualizationData.btl_activities.length > 0 && (
                    <div style={styles.chartCard}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
                        BTL Activities ({visualizationData.btl_activities.length} activities)
                      </h3>
                                              <div style={{ overflowX: 'auto' }}>
                          <table style={styles.table}>
                            <thead>
                              <tr>
                                {Object.keys(visualizationData.btl_activities[0]).map(h => (
                                  <th key={h} style={styles.th}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {visualizationData.btl_activities.slice(0, 20).map((row, index) => (
                                <tr key={index} style={{ background: index % 2 === 0 ? '#fff' : '#f8fafc' }}>
                                  {Object.keys(row).map(h => (
                                    <td key={h} style={styles.td}>{row[h]}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {visualizationData.btl_activities.length > 20 && (
                            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#64748b' }}>
                              Showing first 20 activities of {visualizationData.btl_activities.length} total activities
                            </p>
                          )}
                        </div>
                    </div>
                  )}
                </>
              )}

              {/* No Data Message */}
              {!loading && !visualizationData && sapId && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  <p>No BTL activities found for this customer. Try a different Customer SAP ID.</p>
                </div>
              )}

              {/* Instructions */}
              {!sapId && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  <p>Enter a Customer SAP ID to view their BTL activities.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>Secure enterprise data management</p>
        <p style={styles.footerText}>© 2025 Shree Cement Data Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomerAnalyticsDashboard;