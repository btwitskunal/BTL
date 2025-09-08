# BTL Marketing Execution Portal - Unified Application

A comprehensive full-stack application for BTL (Below The Line) marketing execution with Excel file upload, validation, analytics, and customer data management.

## 🎯 **Project Overview**

This is a **unified single application** that combines:
- **Backend API Server** (Node.js/Express)
- **Frontend React Application** (Served as static files)
- **Customer Data Service** (Integrated into backend)

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                Unified BTL Portal                       │
│                                                         │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │   Frontend      │    │        Backend              │ │
│  │   (React)       │◄──►│   (Node.js/Express)        │ │
│  │   Static Files  │    │   - API Endpoints          │ │
│  │                 │    │   - File Upload            │ │
│  │                 │    │   - Customer Data          │ │
│  │                 │    │   - Authentication         │ │
│  └─────────────────┘    └─────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              MySQL Database                         │ │
│  │  - uploaded_data (Excel data)                      │ │
│  │  - customer_data (Customer info)                   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js >= 16.0.0
- MySQL >= 5.7
- npm or yarn

### **Installation**

1. **Clone and Install**
```bash
git clone <repository-url>
cd BTL
npm run install:all
```

2. **Environment Setup**
```bash
# Copy environment template
cp updatedBackend/.env.example updatedBackend/.env

# Edit with your database credentials
nano updatedBackend/.env
```

3. **Database Setup**
```bash
# Create your MySQL database
mysql -u root -p
CREATE DATABASE your_database_name;
```

4. **Run the Application**

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build:start
```

## 🔧 **Configuration**

### **Environment Variables** (`.env`)

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

# Server Configuration
PORT=4000
HTTP_PORT=3000
HTTPS_PORT=4443
HTTPS_ENABLED=true
NODE_ENV=development

# SSL Configuration (for HTTPS)
SSL_KEY_PATH=./key.pem
SSL_CERT_PATH=./cert.pem

# Security Configuration
SESSION_SECRET=your-super-secret-session-key
JWT_SECRET=your-jwt-secret

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOADS_DIR=uploads
REPORTS_DIR=reports

# SAML Configuration (Optional)
SAML_ENABLED=false
SAML_ENTRY_POINT=https://login.microsoftonline.com/common/saml2
SAML_ISSUER=https://localhost:4443
SAML_CALLBACK_URL=https://localhost:4443/auth/sso/callback
SAML_LOGOUT_CALLBACK_URL=https://localhost:4443/auth/sso/logout/callback

# Frontend Configuration
FRONTEND_URL=https://localhost:4443
```

## 📁 **Project Structure**

```
BTL/
├── updatedBackend/              # Main backend server
│   ├── controllers/             # Business logic
│   │   ├── authController.js    # Authentication
│   │   ├── uploadController.js  # File upload
│   │   ├── customerController.js # Customer data (merged)
│   │   └── templateController.js # Template management
│   ├── routes/                  # API endpoints
│   │   ├── auth.js             # Authentication routes
│   │   ├── upload.js           # Upload routes
│   │   ├── customer.js         # Customer routes (merged)
│   │   └── template.js         # Template routes
│   ├── middleware/             # Security & auth
│   ├── utils/                  # Utilities
│   ├── uploads/                # File storage
│   ├── reports/                # Error reports
│   ├── logs/                   # Application logs
│   ├── app-setup.js           # Express app configuration
│   └── server.js              # HTTPS/HTTP server
├── Frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── assets/            # Static assets
│   │   ├── App.jsx            # Main app
│   │   └── main.jsx           # Entry point
│   ├── dist/                  # Built frontend (generated)
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Build configuration
├── package.json               # Unified project configuration
└── README.md                  # This file
```

## 🎯 **Key Features**

### **For Data Operators (DO):**
- ✅ Excel file upload with validation
- ✅ Real-time upload progress
- ✅ Error reporting with downloadable Excel reports
- ✅ Customer data lookup and analytics
- ✅ BTL activity analysis

### **For Administrators (ADMIN):**
- ✅ All DO capabilities
- ✅ Template management (upload/download)
- ✅ Schema management and synchronization
- ✅ Advanced analytics and reporting
- ✅ System configuration

### **Technical Features:**
- ✅ **SAML SSO** with Microsoft Azure AD
- ✅ **Role-based access control**
- ✅ **Comprehensive security** (CSRF, rate limiting, input validation)
- ✅ **Real-time analytics** with interactive charts
- ✅ **Customer BTL Activity Analysis**
- ✅ **Dynamic template system**
- ✅ **Unified deployment** (single server)

## 🔗 **API Endpoints**

### **Authentication**
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `GET /auth/sso` - Initiate SAML SSO
- `POST /auth/sso/callback` - SAML callback

### **File Upload**
- `POST /upload` - Upload Excel files

### **Customer Data** (Merged from Fetch_data)
- `GET /api/customers/:sapId` - Get customer by SAP ID
- `GET /api/customers/search` - Search customers with filters
- `GET /api/customers/fields` - Get unique field values
- `GET /api/customers/search-by-field` - Search by specific field
- `GET /api/customers/:customerNumber/uploaded-data` - Get customer uploaded data
- `GET /api/customers/test-db` - Test database connection

### **Template Management**
- `GET /api/template` - Get template schema
- `POST /api/template` - Upload new template
- `GET /api/template/download` - Download current template
- `GET /api/template/elements` - Get unique elements
- `GET /api/template/elements/:element` - Get element details
- `GET /api/template/visualization` - Get visualization data
- `GET /api/template/customer-btl-activities/:customerSapId` - Get customer BTL activities

### **Reports**
- `GET /reports/:filename` - Download error reports

## 🚀 **Deployment**

### **Development**
```bash
npm run dev
```
- Backend: https://localhost:4443
- Frontend: https://localhost:4443 (served by backend)

### **Production**
```bash
npm run build:start
```
- Single server handles everything
- Frontend built and served as static files
- All API endpoints available

## 🔒 **Security Features**

- **SAML SSO** with Microsoft Azure AD
- **CSRF Protection** for all forms
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **File Type Validation** for uploads
- **Role-based Access Control**
- **Secure Session Management**
- **SQL Injection Prevention**

## 📊 **Database Schema**

### **customer_data** (Auto-created)
```sql
CREATE TABLE customer_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  CUSTOMER_NUMBER VARCHAR(50) NOT NULL,
  CUSTOMER_NAME VARCHAR(255) NOT NULL,
  TERRITORY_CODE VARCHAR(50),
  T_ZONE VARCHAR(50),
  ZONE VARCHAR(50),
  STATE VARCHAR(100),
  REGION VARCHAR(100),
  DISTIRCT VARCHAR(100),
  TALUKA VARCHAR(100),
  CITY VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **uploaded_data** (Dynamic based on template)
- Schema automatically synchronized with template.xlsx
- Columns added/removed based on template changes

## 🛠️ **Development**

### **Adding New Features**
1. Backend: Add controllers and routes in `updatedBackend/`
2. Frontend: Add components in `Frontend/src/components/`
3. Database: Update schema as needed

### **Building Frontend**
```bash
cd Frontend
npm run build
```

### **Testing**
```bash
# Test database connection
curl https://localhost:4443/api/customers/test-db

# Test health endpoint
curl https://localhost:4443/health
```

## 📝 **Migration from Separate Projects**

This unified application replaces:
- ✅ **updatedBackend** - Main backend server
- ✅ **Frontend** - React frontend (now served as static files)
- ✅ **Fetch_data** - Customer API (merged into backend)

### **Benefits of Unification:**
- 🚀 **Single deployment** - One server handles everything
- 🔧 **Easier maintenance** - Single codebase to manage
- 🔒 **Better security** - Unified authentication and authorization
- 📊 **Simplified architecture** - No need for multiple servers
- 🚀 **Faster development** - No cross-origin issues

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **Frontend not loading:**
   ```bash
   npm run build
   ```

2. **Database connection failed:**
   - Check `.env` file
   - Verify MySQL is running
   - Check database credentials

3. **SSL certificate issues:**
   - Set `HTTPS_ENABLED=false` in `.env` for development
   - Or generate proper SSL certificates

4. **Port already in use:**
   - Change `PORT` in `.env`
   - Kill existing processes

## 📞 **Support**

For technical support or questions:
- Check the logs in `updatedBackend/logs/`
- Review the health endpoint: `GET /health`
- Contact the development team

---

**© 2025 Shree Cement Limited. All rights reserved.**
