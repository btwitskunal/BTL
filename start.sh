
#!/bin/bash

# BTL Marketing Portal Startup Script
echo "🚀 Starting BTL Marketing Portal..."

# Check if .env file exists
if [ ! -f "updatedBackend/.env" ]; then
    echo "❌ .env file not found. Creating from template..."
    cp updatedBackend/env-template.txt updatedBackend/.env
    echo "✅ .env file created. Please review and update the configuration if needed."
fi

# Check if MySQL is running
echo "🔍 Checking MySQL connection..."
mysql -u root -p'kunal@123' -e "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ MySQL connection successful"
else
    echo "❌ MySQL connection failed. Please ensure MySQL is running and credentials are correct."
    exit 1
fi

# Check if database exists
mysql -u root -p'kunal@123' -e "USE SCLWebPortal;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database SCLWebPortal exists"
else
    echo "❌ Database SCLWebPortal not found. Please create it first."
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "updatedBackend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd updatedBackend && npm install && cd ..
fi

if [ ! -d "Frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd Frontend && npm install && cd ..
fi

# Build frontend
echo "🏗️  Building frontend..."
cd Frontend && npm run build && cd ..

echo "🎉 All checks passed! Starting server..."

# Start backend server (serves both API and frontend)
echo "🔧 Starting unified server..."
cd updatedBackend
node server.js &
BACKEND_PID=$!
cd ..

echo ""
echo "🎊 BTL Marketing Portal is now running on a single port!"
echo ""
echo "🌐 Application: https://localhost:4443"
echo "📊 Health:      https://localhost:4443/health"
echo "🔐 Login:       https://localhost:4443/auth/sso"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping server..."
    kill $BACKEND_PID 2>/dev/null
    echo "✅ Server stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
