#!/bin/bash

# Godmode Extension Publisher Script
# This script will bump version, build, package, publish, and provide installation instructions

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if vsce is installed globally, if not install it
if ! command -v vsce &> /dev/null; then
    print_warning "vsce is not installed globally. Installing it now..."
    npm install -g @vscode/vsce
fi

# Get version type from argument or default to patch
VERSION_TYPE=${1:-patch}

if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    print_error "Invalid version type. Use: patch, minor, or major"
    echo "Usage: ./publish.sh [patch|minor|major]"
    exit 1
fi

print_step "Starting publish process for Godmode extension..."

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_step "Current version: $CURRENT_VERSION"

# Bump version
print_step "Bumping $VERSION_TYPE version..."
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
print_success "Version bumped to: $NEW_VERSION"

# Install dependencies
print_step "Installing dependencies..."
npm install

# Run type checking and linting
print_step "Running type checking and linting..."
npm run check-types
npm run lint

# Build the extension
print_step "Building extension..."
npm run package

# Package the extension
print_step "Packaging extension..."
vsce package

# Get the package name
PACKAGE_NAME="godmode-$NEW_VERSION.vsix"

# Check if we should publish to marketplace
read -p "Do you want to publish to VS Code Marketplace? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Publishing to VS Code Marketplace..."
    
    # Check if publisher is logged in
    if ! vsce ls-publishers &> /dev/null; then
        print_warning "You need to login to vsce first."
        print_step "Please run: vsce login filodamos"
        print_warning "You'll need your Personal Access Token from Azure DevOps."
        exit 1
    fi
    
    vsce publish
    print_success "Published to VS Code Marketplace!"
    
    # Wait a moment for marketplace to process
    print_step "Waiting for marketplace to process the update..."
    sleep 5
    
    echo
    print_success "🎉 Extension published successfully!"
    echo -e "${GREEN}Marketplace URL:${NC} https://marketplace.visualstudio.com/items?itemName=filodamos.godmode"
else
    print_warning "Skipping marketplace publish."
fi

# Git operations
print_step "Creating git commit and tag..."
git add package.json
git commit -m "Bump version to $NEW_VERSION"
git tag "v$NEW_VERSION"

echo
print_success "🚀 Build and package complete!"
echo
print_step "Local Installation Instructions for Cursor:"
echo -e "${YELLOW}To install the latest version locally in Cursor:${NC}"
echo
echo -e "${GREEN}1. Option 1 - Install from VSIX file:${NC}"
echo -e "   code --install-extension ./$PACKAGE_NAME"
echo -e "   ${BLUE}(Replace 'code' with 'cursor' if you have cursor CLI installed)${NC}"
echo
echo -e "${GREEN}2. Option 2 - Install via Cursor Extensions:${NC}"
echo -e "   - Open Cursor"
echo -e "   - Go to Extensions (Ctrl/Cmd + Shift + X)"
echo -e "   - Click the three dots (...) menu"
echo -e "   - Select 'Install from VSIX...'"
echo -e "   - Choose the file: ${YELLOW}$PACKAGE_NAME${NC}"
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
echo -e "${GREEN}3. Option 3 - Install from Marketplace:${NC}"
echo -e "   - Search for 'Godmode' by filodamos in Cursor Extensions"
echo -e "   - Or install directly: ${YELLOW}filodamos.godmode${NC}"
fi
echo
print_step "Git operations:"
echo -e "Don't forget to push your changes:"
echo -e "${YELLOW}git push && git push --tags${NC}"
echo
print_success "All done! 🎉" 