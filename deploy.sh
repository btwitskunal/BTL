#!/bin/bash

# BTL Marketing Portal - Unified Deployment Script
# This script sets up and runs the unified BTL application

set -e  # Exit on any error

echo "🚀 BTL Marketing Portal - Unified Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js >= 16.0.0"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16 or higher is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm --version) is installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing backend dependencies..."
    npm install
    
    print_status "Installing frontend dependencies..."
    cd Frontend
    npm install
    cd ..
    
    print_success "All dependencies installed"
}

# Check environment file
check_env() {
    if [ ! -f "updatedBackend/.env" ]; then
        print_warning ".env file not found. Creating from template..."
        
        if [ -f "updatedBackend/.env.example" ]; then
            cp updatedBackend/.env.example updatedBackend/.env
            print_warning "Please edit updatedBackend/.env with your database credentials"
        else
            print_error ".env file not found and no template available"
            print_status "Creating basic .env file..."
            cat > updatedBackend/.env << EOF
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=btl_portal
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

# Server Configuration
PORT=4000
HTTP_PORT=3000
HTTPS_PORT=4443
HTTPS_ENABLED=false
NODE_ENV=development

# Security Configuration
SESSION_SECRET=your-super-secret-session-key-change-in-production
JWT_SECRET=your-jwt-secret-change-in-production

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOADS_DIR=uploads
REPORTS_DIR=reports

# SAML Configuration (Optional)
SAML_ENABLED=false

# Frontend Configuration
FRONTEND_URL=http://localhost:4000
EOF
            print_warning "Basic .env file created. Please edit with your settings."
        fi
    else
        print_success ".env file found"
    fi
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd Frontend
    npm run build
    cd ..
    print_success "Frontend built successfully"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p updatedBackend/uploads
    mkdir -p updatedBackend/reports
    mkdir -p updatedBackend/logs
    print_success "Directories created"
}

# Main deployment function
deploy() {
    print_status "Starting deployment process..."
    
    check_node
    check_npm
    create_directories
    check_env
    
    if [ "$1" = "dev" ]; then
        print_status "Starting in development mode..."
        print_warning "Make sure to edit updatedBackend/.env with your database credentials"
        print_status "Starting development servers..."
        npm run dev
    elif [ "$1" = "prod" ]; then
        print_status "Starting in production mode..."
        install_dependencies
        build_frontend
        print_status "Starting production server..."
        npm start
    else
        print_status "Usage: $0 [dev|prod]"
        print_status "  dev  - Development mode (with hot reload)"
        print_status "  prod - Production mode (built and optimized)"
        exit 1
    fi
}

# Show help
show_help() {
    echo "BTL Marketing Portal - Unified Deployment Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  dev     - Start in development mode"
    echo "  prod    - Start in production mode"
    echo "  build   - Build frontend only"
    echo "  install - Install dependencies only"
    echo "  help    - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev     # Start development server"
    echo "  $0 prod    # Start production server"
    echo "  $0 build   # Build frontend"
    echo "  $0 install # Install all dependencies"
}

# Handle different commands
case "$1" in
    "dev")
        deploy "dev"
        ;;
    "prod")
        deploy "prod"
        ;;
    "build")
        check_node
        check_npm
        build_frontend
        ;;
    "install")
        check_node
        check_npm
        install_dependencies
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    "")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
