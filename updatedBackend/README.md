# SCL Web Portal - Comprehensive Software Portal

A secure, high-performance software portal for Excel file upload, validation, and analytics with role-based access control and comprehensive data management capabilities.

## 🎯 Project Overview

The SCL Web Portal is a full-stack application designed to handle Excel file uploads, validate data against predefined templates, and provide analytics dashboards. The portal serves as a centralized platform for data management with secure authentication and role-based access control.

### Main Features
- **Secure File Upload**: Excel file validation with size and type restrictions
- **Data Validation**: Dynamic validation against template-defined rules
- **Error Reporting**: Detailed Excel error reports for failed uploads
- **Analytics Dashboard**: Comprehensive data visualization and reporting
- **Customer BTL Activity Analysis**: Customer-centric BTL (Below The Line) activity tracking and visualization
- **Template Management**: Dynamic template upload, download, and schema management
- **Role-Based Access**: Different interfaces for DO (Data Operator) and ADMIN roles
- **Customer Data Management**: Integration with customer database
- **Real-time Processing**: Live data validation and processing

### Target Audience
- **Data Operators (DO)**: Users who upload and validate Excel files
- **Administrators (ADMIN)**: Users who monitor analytics and manage the system
- **System Administrators**: Technical staff managing the infrastructure

## 🏗️ Architecture Summary

The portal follows a modern three-tier architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │  Data Fetching  │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Express)     │
│   Port: 3000    │    │   Port: 4000    │    │   Port: 2000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Browser  │    │   MySQL DB      │    │   Customer DB   │
│                 │    │   (Main Data)   │    │   (SCLWebPortal)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Relationships
- **Frontend** communicates with **Backend** for authentication, file uploads, and analytics data
- **Backend** manages the main application logic, file processing, and database operations
- **Data Fetching** component provides customer data lookup services
- All components use MySQL databases for data persistence

## 🔧 Backend Description

### Technologies Used
- **Node.js** (>=16.0.0) - Runtime environment
- **Express.js** (^5.1.0) - Web framework
- **MySQL2** (^3.14.2) - Database driver
- **Multer** (^2.0.2) - File upload handling
- **XLSX** (^0.18.5) - Excel file processing
- **Passport** (^0.7.0) - Authentication middleware
- **Helmet** (^7.1.0) - Security headers
- **Express Rate Limit** (^7.1.5) - Rate limiting

### Purpose
The backend serves as the core application server, handling:
- User authentication and session management
- File upload processing and validation
- Database operations and schema management
- API endpoints for frontend communication
- Security and access control

### Folder Structure

#### 📁 `controllers/` - Business Logic Layer
**Purpose**: Contains the main business logic for different application features.

**Key Files**:
- **`authController.js`** (2.8KB, 120 lines)
  - Handles user authentication, login/logout, and profile management
  - Manages session creation and validation
  - **Impact**: Core security component ensuring only authorized users access the system

- **`uploadController.js`** (8.8KB, 244 lines)
  - Processes Excel file uploads and validation
  - Generates error reports for failed uploads
  - Handles batch processing of large files
  - **Impact**: Primary data processing engine for file uploads

- **`customerController.js`** (3.1KB, 84 lines)
  - Manages customer data operations
  - Handles customer lookup and data retrieval
  - **Impact**: Provides customer information services

- **`templateController.js`** (8.2KB, 280+ lines)
  - Manages template file operations and schema updates
  - **NEW**: Customer BTL Activity Analysis APIs
  - **NEW**: Element, Attribute, and UOM visualization endpoints
  - **NEW**: Dynamic template-based data analytics
  - **Impact**: Ensures data consistency and provides advanced analytics capabilities

#### 📁 `routes/` - API Endpoint Definitions
**Purpose**: Defines REST API endpoints and request handling.

**Key Files**:
- **`auth.js`** - Authentication routes (login, logout, profile)
- **`upload.js`** - File upload and processing endpoints
- **`template.js`** - Template management and **NEW** BTL activity analysis routes
- **`template.js`** - Template management endpoints
- **`customer.js`** - Customer data endpoints
- **`samlMetadata.js`** - SAML authentication metadata

#### 📁 `middleware/` - Request Processing
**Purpose**: Contains middleware functions for request processing and security.

**Key Files**:
- **`auth.js`** - Authentication and authorization middleware
  - **Impact**: Protects routes and enforces role-based access control

#### 📁 `utils/` - Utility Functions
**Purpose**: Contains helper functions and configuration.

**Key Files**:
- **`config.js`** - Application configuration management
- **`db.js`** - Database connection and utilities
- **`logger.js`** - Structured logging system
- **`templateManager.js`** - Template file management
- **`validation.js`** - Data validation utilities
- **`validationCache.js`** - Caching for validation rules

#### 📁 `uploads/` - File Storage
**Purpose**: Stores uploaded Excel files temporarily.

**Impact**: Provides secure file storage for processing

#### 📁 `reports/` - Error Reports
**Purpose**: Stores generated error reports for failed uploads.

**Impact**: Enables users to review and fix data issues

#### 📁 `logs/` - Application Logs
**Purpose**: Contains application and error logs.

**Key Files**:
- **`app.log`** - General application logs
- **`error.log`** - Error-specific logs

#### 📁 `test/` - Testing Suite
**Purpose**: Contains test files for application validation.

**Key Files**:
- **`security-test.js`** - Security testing
- **`simple-test.js`** - Basic functionality tests
- **`offline-test.js`** - Offline operation tests

## 🎨 Frontend Description

### Technologies Used
- **React** (^19.1.0) - UI framework
- **Vite** (^6.3.5) - Build tool and development server
- **Material-UI** (^7.1.2) - UI component library
- **React Router** (^7.7.0) - Client-side routing
- **Recharts** (^3.1.0) - Data visualization
- **XLSX** (^0.18.5) - Excel file handling
- **React Select** (^5.10.2) - Enhanced select components

### Purpose
The frontend provides the user interface for:
- User authentication and login
- File upload interface for data operators
- Analytics dashboard for administrators
- Role-based navigation and access control
- Real-time data visualization

### Folder Structure

#### 📁 `src/` - Source Code
**Purpose**: Contains all React components and application logic.

**Key Files**:
- **`App.jsx`** (56 lines)
  - Main application component with routing
  - Manages user context and authentication state
  - **Impact**: Core application structure and navigation

- **`main.jsx`** - Application entry point
- **`index.css`** - Global styles
- **`App.css`** - Application-specific styles

#### 📁 `src/components/` - React Components
**Purpose**: Contains reusable UI components.

**Key Files**:
- **`Login.jsx`** (9.3KB, 339 lines)
  - User authentication interface
  - Handles login form and authentication flow
  - **Impact**: Primary entry point for user authentication

- **`Upload.jsx`** (19KB, 697 lines)
  - File upload interface for data operators
  - Provides drag-and-drop file upload
  - Shows upload progress and validation results
  - **Impact**: Main interface for data entry and file processing

- **`Analytics.jsx`** (32KB, 950+ lines)
  - Comprehensive analytics dashboard with **NEW** Customer BTL Activity Analysis
  - **NEW**: Customer-centric BTL activity tracking and visualization
  - **NEW**: Element, Attribute, and UOM distribution charts
  - **NEW**: Customer activity summary and detailed activity tables
  - Data visualization with charts and tables
  - Filtering and export capabilities
  - **Impact**: Primary interface for data analysis, reporting, and BTL activity tracking

- **`TemplateManager.jsx`** (4.7KB, 121 lines)
  - Template management interface for administrators
  - **Features**: Template download, upload, and schema visualization
  - **NEW**: Dynamic template structure display
  - **NEW**: Real-time schema synchronization
  - **Impact**: Enables administrators to manage data templates and schema

#### 📁 `src/assets/` - Static Assets
**Purpose**: Contains images, logos, and other static files.

**Key Files**:
- **`shree-logo.png`** - Company logo
- **`microsoft-logo.png`** - Microsoft integration logo

#### 📁 `public/` - Public Assets
**Purpose**: Contains files served directly by the web server.

**Key Files**:
- **`vite.svg`** - Vite logo
- **`index.html`** - HTML template

## 📊 Data Fetching Mechanism

### Technologies Used
- **Express.js** (^4.19.2) - Web server
- **MySQL2** (^3.14.2) - Database driver
- **CORS** (^2.8.5) - Cross-origin resource sharing

### Purpose
The data fetching component provides:
- Customer data lookup services
- API endpoints for customer information
- Integration with external customer database
- Real-time customer data retrieval

### Folder Structure

#### 📁 `fetch_data/` - Data Fetching Service
**Purpose**: Standalone service for customer data operations.

**Key Files**:
- **`index.js`** (8.9KB, 267 lines)
  - Main server file for data fetching service
  - Provides customer lookup API endpoints
  - Manages database connections and queries
  - **Impact**: Enables real-time customer data access across the portal

- **`package.json`** - Dependencies and scripts
- **`package-lock.json`** - Dependency lock file

### API Endpoints
- **`GET /api/customer/:sapId`** - Retrieve customer details by SAP ID
- **`GET /api/customers`** - List all customers with pagination
- **`POST /api/customers/search`** - Search customers by criteria

## 📋 Template Management System

### Overview
The Template Management System provides administrators with comprehensive control over data templates, enabling dynamic schema management and ensuring data consistency across the portal. This system allows for template updates, schema synchronization, and real-time validation rule management.

### Key Features
- **Template Upload**: Upload new Excel templates to update data structure
- **Template Download**: Download current template for reference or modification
- **Schema Visualization**: View current template structure with column names, types, and positions
- **Dynamic Schema Sync**: Automatic database schema synchronization with template changes
- **Real-time Validation**: Immediate validation rule updates based on template changes
- **Admin-Only Access**: Restricted to ADMIN role users for security

### API Endpoints

#### Template Management
- **`GET /api/template`** - Get current template schema and structure
- **`POST /api/template`** - Upload new template file (multipart/form-data)
- **`GET /api/template/download`** - Download current template file

### User Interface Features

#### Template Manager Dashboard
- **Current Template Display**: Shows existing template structure in table format
- **Schema Information**: Column names, data types, and positions
- **Download Functionality**: One-click template download
- **Upload Interface**: File selection and upload with progress indication
- **Real-time Feedback**: Success/error messages for all operations

#### Template Structure Table
- **Column Name**: Display of all template column headers
- **Data Type**: Type information for each column (TEXT, INT, DATE, FLOAT, etc.)
- **Position**: Column order in the template
- **Dynamic Updates**: Real-time schema refresh after template changes

### Technical Implementation

#### Backend Components
- **`templateController.js`**: Core template management functions
  - `getTemplate()`: Retrieves current template schema
  - `uploadTemplate()`: Handles template file upload and validation
  - `downloadTemplate()`: Provides template file download
  - Automatic schema synchronization with database
- **`utils/templateManager.js`**: Template processing utilities
  - `getTemplateDefinition()`: Parses template structure
  - `syncDataTableSchema()`: Synchronizes database schema with template

#### Frontend Components
- **`TemplateManager.jsx`**: Complete template management interface
  - Template download functionality
  - File upload with validation
  - Schema visualization table
  - Real-time status updates

### Template File Requirements
- **File Format**: Excel (.xlsx) files only
- **Structure**: First row contains column headers, second row contains data types
- **Validation**: Automatic file type and structure validation
- **Security**: Admin-only access with proper authentication

### Usage Workflow
1. **Access Template Manager**: Navigate to Template Management page (Admin only)
2. **View Current Template**: Review existing template structure
3. **Download Template**: Download current template for modification
4. **Modify Template**: Update template file as needed
5. **Upload New Template**: Upload modified template file
6. **Schema Sync**: System automatically synchronizes database schema
7. **Validation Update**: New validation rules are immediately active

### Benefits
- **Data Consistency**: Ensures all uploaded files follow the same structure
- **Flexibility**: Easy template updates without system downtime
- **Validation Control**: Dynamic validation rule management
- **Schema Management**: Automatic database schema synchronization
- **Admin Control**: Centralized template management for administrators

## 🎯 Customer BTL Activity Analysis

### Overview
The Customer BTL Activity Analysis feature provides comprehensive tracking and visualization of Below The Line (BTL) marketing activities performed by customers. This feature enables users to analyze customer engagement and activity patterns through an intuitive dashboard.

### Key Features
- **Customer-Centric Analysis**: Search and analyze BTL activities by Customer SAP ID
- **Dynamic Template Support**: Automatically adapts to any template structure with element, attribute, and UOM columns
- **Real-time Visualization**: Interactive charts and analytics for activity distribution
- **Comprehensive Reporting**: Detailed activity tables with full data visibility

### API Endpoints

#### Template Management & BTL Analysis
- **`GET /api/template/elements`** - Get all unique elements from uploaded data
- **`GET /api/template/elements/:element`** - Get attributes and UOM for a specific element
- **`GET /api/template/visualization`** - Get visualization data for element/attribute/UOM combinations
- **`GET /api/template/customer-btl-activities/:customerSapId`** - **NEW**: Get all BTL activities for a specific customer

### User Interface Features

#### Analytics Dashboard Tabs
1. **Customer Lookup** - Search customers by SAP ID
2. **Analytics & Search** - Advanced customer search and analytics
3. **Element Visualization** - **NEW**: Customer BTL Activity Analysis

#### BTL Activity Analysis Interface
- **Customer Search**: Enter Customer SAP ID to find their activities
- **Customer Information Display**: Shows customer details (name, territory, zone, etc.)
- **Activity Summary Cards**:
  - Total BTL Activities count
  - Unique Elements performed
  - Unique Attributes used
- **Distribution Charts**:
  - **Element Distribution**: Bar chart showing BTL activities by element type
  - **Attribute Distribution**: Pie chart showing activities by attribute
  - **UOM Distribution**: Horizontal bar chart showing activities by UOM
- **Activity Details Table**: Complete list of all BTL activities with full data

### Technical Implementation

#### Backend Components
- **`templateController.js`**: Enhanced with BTL activity analysis functions
  - `getCustomerBTLActivities()`: Retrieves customer-specific BTL activities
  - `generateBTLActivityAnalytics()`: Generates analytics for activity data
  - Dynamic column detection for customer identification
- **`routes/template.js`**: New routes for BTL activity endpoints

#### Frontend Components
- **`Analytics.jsx`**: Enhanced with Customer BTL Activity Analysis tab
  - Customer SAP ID input and search functionality
  - Real-time data fetching and visualization
  - Interactive charts using Recharts library
  - Responsive design for all screen sizes

#### Dynamic Template Adaptation
The system automatically detects:
- **Customer Identification Columns**: SAP ID, customer number, etc.
- **Element Columns**: Any column containing "element"
- **Attribute Columns**: Any column containing "attribute"
- **UOM Columns**: Any column containing "uom"

### Usage Workflow
1. **Access Analytics**: Navigate to Analytics page
2. **Select BTL Analysis**: Click "Element Visualization" tab
3. **Enter Customer ID**: Input Customer SAP ID
4. **View Results**: Analyze customer BTL activities through:
   - Customer information summary
   - Activity distribution charts
   - Detailed activity table
5. **Export Data**: Download activity data for further analysis

### Benefits
- **Customer Insights**: Understand customer engagement patterns
- **Activity Tracking**: Monitor BTL marketing effectiveness
- **Data-Driven Decisions**: Make informed decisions based on activity analytics
- **Template Flexibility**: Works with any template structure
- **Real-time Analysis**: Immediate access to customer activity data

## 🔗 File Impact Analysis

### Critical Files and Their Impact

#### Backend Critical Files:
1. **`app.js`** (179 lines) - Application entry point and server configuration
   - **Impact**: Defines server setup, middleware, and route registration
   - **Dependencies**: All route files, middleware, and utility modules

2. **`controllers/uploadController.js`** (244 lines) - File processing logic
   - **Impact**: Core business logic for file upload and validation
   - **Dependencies**: Template manager, validation utilities, database utilities

3. **`controllers/templateController.js`** (280+ lines) - **NEW**: Template management and BTL activity analysis
   - **Impact**: Provides customer BTL activity tracking and analytics
   - **Dependencies**: Template manager, database utilities, customer data service

4. **`utils/templateManager.js`** - Template management
   - **Impact**: Ensures data consistency and schema synchronization
   - **Dependencies**: XLSX library, database utilities

#### Frontend Critical Files:
1. **`src/App.jsx`** (56 lines) - Application routing and context
   - **Impact**: Manages user authentication state and navigation
   - **Dependencies**: All component files, React Router

2. **`src/components/Analytics.jsx`** (950+ lines) - **ENHANCED**: Analytics dashboard with BTL Activity Analysis
   - **Impact**: Primary interface for data visualization, reporting, and customer BTL activity tracking
   - **Dependencies**: Recharts, Material-UI components, API calls, customer data integration

3. **`src/components/Upload.jsx`** (697 lines) - File upload interface
   - **Impact**: Main interface for data entry and file processing
   - **Dependencies**: File upload APIs, validation feedback

4. **`src/components/TemplateManager.jsx`** (121 lines) - Template management interface
   - **Impact**: Admin interface for template management and schema control
   - **Dependencies**: Template API endpoints, file upload/download functionality

#### Data Fetching Critical Files:
1. **`fetch_data/index.js`** (267 lines) - Customer data service
   - **Impact**: Provides customer lookup capabilities across the portal
   - **Dependencies**: MySQL database, Express server

## 🚀 Usage Instructions

### Prerequisites
- **Node.js** >= 16.0.0
- **MySQL** >= 5.7
- **npm** or **yarn** package manager
- **Git** for version control

### Installation Steps

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd "untitled folder"
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp env-sample.txt .env
# Edit .env with your database credentials and configuration

# Start the backend server
npm run dev
```

#### 3. Frontend Setup
```bash
cd Frontend
npm install

# Start the frontend development server
npm run dev
```

#### 4. Data Fetching Service Setup
```bash
cd fetch_data
npm install

# Create .env file with database configuration
# Start the data fetching service
npm run dev
```

### Environment Configuration

#### Backend (.env)
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
NODE_ENV=development

# Security Configuration
SESSION_SECRET=your-super-secret-session-key

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOADS_DIR=uploads
REPORTS_DIR=reports
```

#### Data Fetching Service (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
PORT=2000
```

### Running the Application

#### Development Mode
1. **Start Backend**: `cd backend && npm run dev` (Port: 4000)
2. **Start Frontend**: `cd Frontend && npm run dev` (Port: 3000)
3. **Start Data Service**: `cd fetch_data && npm run dev` (Port: 2000)

#### Production Mode
1. **Build Frontend**: `cd Frontend && npm run build`
2. **Start Backend**: `cd backend && npm start`
3. **Start Data Service**: `cd fetch_data && npm start`

### Accessing the Application
- **Frontend**: http://localhost:3000
- **Backend API**: https://localhost:4443
- **Data Service**: http://localhost:2000

### Default User Roles
- **DO (Data Operator)**: Can upload files and view analytics
- **ADMIN**: Can view analytics and manage the template 

### Using the BTL Activity Analysis Feature

#### Quick Start Guide
1. **Login**: Access the portal with DO or ADMIN credentials
2. **Navigate to Analytics**: Click on the Analytics section
3. **Select BTL Analysis**: Click the "Element Visualization" tab
4. **Enter Customer ID**: Input a Customer SAP ID
5. **View Results**: Analyze customer BTL activities through charts and tables

#### Key Features Available
- **Customer Activity Summary**: View total activities, unique elements, and attributes
- **Distribution Charts**: Visualize activities by element type, attributes, and UOM
- **Detailed Activity Table**: See all BTL activities with complete data
- **Customer Information**: Display customer details and territory information

#### Template Requirements
The system automatically works with any template containing:
- Customer identification columns (SAP ID, customer number, etc.)
- Element columns (any column with "element" in the name)
- Attribute columns (any column with "attribute" in the name)
- UOM columns (any column with "uom" in the name)

### Using the Template Management Feature

#### Quick Start Guide (Admin Only)
1. **Login**: Access the portal with ADMIN credentials
2. **Navigate to Template Manager**: Access the Template Management section
3. **View Current Template**: Review existing template structure
4. **Download Template**: Download current template for modification
5. **Upload New Template**: Upload modified template file
6. **Verify Changes**: Check that schema has been updated

#### Key Features Available
- **Template Download**: Download current template for reference or modification
- **Template Upload**: Upload new template files to update data structure
- **Schema Visualization**: View current template structure with column details
- **Real-time Sync**: Automatic database schema synchronization
- **Validation Updates**: Immediate validation rule updates

#### Template File Requirements
- **File Format**: Excel (.xlsx) files only
- **Structure**: First row = column headers, Second row = data types
- **Supported Types**: TEXT, INT, DATE, FLOAT, DOUBLE
- **Security**: Admin-only access with proper authentication

## 🔒 Security Features

- **Authentication**: Session-based authentication with CSRF protection
- **Authorization**: Role-based access control (DO/ADMIN)
- **Input Validation**: Comprehensive input sanitization and validation
- **File Security**: Type validation, size limits, and safe filename generation
- **Rate Limiting**: Protection against abuse with configurable limits
- **Security Headers**: Comprehensive security headers (Helmet)
- **SQL Injection Prevention**: Parameterized queries and column name sanitization

## 📈 Performance Features

- **Batch Processing**: Efficient handling of large Excel files
- **Caching**: Validation rule caching for improved performance
- **Connection Pooling**: Database connection optimization
- **File Streaming**: Efficient file upload and processing
- **Error Reporting**: Detailed Excel-based error reports

## 🛠️ Development Tools

- **ESLint**: Code quality and consistency
- **Nodemon**: Automatic server restart during development
- **Vite**: Fast development server and build tool
- **Material-UI**: Comprehensive UI component library
- **Recharts**: Professional data visualization

## 📝 License

This project is proprietary software. All rights reserved.

---

**For technical support or questions, please contact the development team.** 
