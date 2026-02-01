#!/bin/bash

echo "🚀 Setting up Enterprise Agents Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 16 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_API_KEY=demo-api-key-12345
REACT_APP_TITLE=Enterprise Agents Platform
EOL
fi

echo "🎉 Frontend setup complete!"
echo ""
echo "To start the development server:"
echo "  npm start"
echo ""
echo "The frontend will be available at: http://localhost:3000"
echo "Make sure your backend API is running at: http://localhost:8080"
