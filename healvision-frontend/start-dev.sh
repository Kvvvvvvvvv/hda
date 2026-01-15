#!/bin/bash
# Development startup script for HealVision Frontend

echo "🚀 Starting HealVision Frontend Development Server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

echo "🔄 Starting development server on http://localhost:3000"
npm run dev