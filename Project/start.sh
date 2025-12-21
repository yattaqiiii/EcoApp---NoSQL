#!/bin/bash
# Quick Start Script untuk EcoScan

echo "🌱 EcoScan - Quick Setup Script"
echo "================================"
echo ""

# Check if in Frontend directory
if [ ! -f "package.json" ]; then
    echo "📁 Navigating to Frontend directory..."
    cd Frontend
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "⚠️  IMPORTANT: Model Setup Required!"
echo "================================"
echo ""
echo "Before running, you need to setup the AI model:"
echo ""
echo "Option 1 (RECOMMENDED):"
echo "  1. Open your Teachable Machine project"
echo "  2. Click 'Export Model' → 'Upload (Shareable Link)'"
echo "  3. Copy the URL"
echo "  4. Edit src/utils/modelUtils.js"
echo "  5. Replace MODEL_URL with your URL"
echo ""
echo "Option 2:"
echo "  1. Export model as 'TensorFlow.js' from Teachable Machine"
echo "  2. Download and extract files"
echo "  3. Copy all files to public/model/"
echo ""
echo "📖 See MODEL_SETUP.md for detailed instructions"
echo ""

read -p "Have you setup the model? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🚀 Starting development server..."
    npm run dev
else
    echo ""
    echo "❌ Please setup the model first before running the app."
    echo "📖 Read: MODEL_SETUP.md"
    exit 1
fi
