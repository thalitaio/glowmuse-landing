#!/bin/bash

# GlowMuse Landing Page - Installation Script
# This script sets up the development environment

echo "🚀 GlowMuse Landing Page - Installation Script"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 12+ first."
    echo "   Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "   macOS: brew install postgresql"
    echo "   Windows: https://www.postgresql.org/download/windows/"
    exit 1
fi

echo "✅ PostgreSQL detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Database setup
echo "🗄️  Setting up database..."

# Check if database exists
DB_EXISTS=$(psql -lqt | cut -d \| -f 1 | grep -w glowmuse_leads | wc -l)

if [ $DB_EXISTS -eq 0 ]; then
    echo "Creating database 'glowmuse_leads'..."
    createdb glowmuse_leads
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create database. Please check your PostgreSQL setup."
        exit 1
    fi
    echo "✅ Database created successfully"
else
    echo "✅ Database already exists"
fi

# Run database schema
echo "📊 Setting up database schema..."
psql -d glowmuse_leads -f database.sql

if [ $? -ne 0 ]; then
    echo "❌ Failed to setup database schema"
    exit 1
fi

echo "✅ Database schema setup complete"

# Create assets directory if it doesn't exist
mkdir -p assets

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit the .env file with your configuration:"
echo "   - Database connection string"
echo "   - Email settings (Gmail recommended)"
echo "   - Admin email"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open your browser and go to:"
echo "   http://localhost:3000"
echo ""
echo "4. For production deployment, see README.md"
echo ""
echo "📧 Support: dev@glowmuse.com.br"
echo "📖 Documentation: README.md"
echo ""
echo "GlowMuse - Sua profissão merece respeito. Sua história merece espaço."
