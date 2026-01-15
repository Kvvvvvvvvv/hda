@echo off
title HealVision Frontend Development Server
echo 🚀 Starting HealVision Frontend Development Server...

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo 🔄 Starting development server on http://localhost:3000
npm run dev

pause