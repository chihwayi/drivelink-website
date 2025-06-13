#!/bin/bash

echo "🚀 Starting build and deployment process..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Run tests
echo "🧪 Running tests..."
npm test -- --watch=false --browsers=ChromeHeadless

# Step 3: Build the application
echo "🔨 Building application for production..."

# Choose build type
echo "Select build type:"
echo "1. Static build (for GitHub Pages, Netlify, etc.)"
echo "2. SSR build (for Node.js servers)"

# For static deployment (GitHub Pages)
echo "Building for static deployment..."
ng build --configuration=production

# Check if browser subfolder exists (SSR build)
if [ -d "dist/drivelink-website/browser" ]; then
    echo "📁 SSR build detected - web files are in browser/ subfolder"
    DEPLOY_DIR="dist/drivelink-website/browser"
else
    echo "📁 Static build detected - web files are in root"
    DEPLOY_DIR="dist/drivelink-website"
fi

# Step 4: Test the build locally (optional)
echo "🌐 Testing build locally..."
echo "You can test the build by running: npx http-server $DEPLOY_DIR -p 8080"

# Step 5: Deploy to GitHub (choose your method)
echo "📤 Ready for deployment!"
echo "Choose your deployment method:"
echo "1. GitHub Pages: ngh --dir=dist/drivelink-website"
echo "2. Manual: Push to GitHub and set up Pages"
echo "3. GitHub Actions: Commit the workflow file and push"

# Uncomment the method you want to use:

# Method 1: Direct GitHub Pages deployment
# echo "Deploying to GitHub Pages..."
# npx angular-cli-ghpages --dir=$DEPLOY_DIR

# Method 2: Git push (assuming remote is set up)
# echo "Pushing to GitHub..."
# git add .
# git commit -m "Production build"
# git push origin main

echo "✅ Build process complete!"