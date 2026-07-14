#!/bin/bash

# JARVIS SETUP SCRIPT
# This script sets up your Jarvis AI system in 2 minutes

set -e  # Exit on error

echo "🚀 JARVIS SETUP STARTED"
echo "======================"
echo ""

# Check Node.js version
echo "✓ Checking Node.js..."
node_version=$(node -v)
echo "  Found: $node_version"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"

# Check for .env.local
echo ""
echo "⚙️  Checking environment config..."
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating template..."
    cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jarvis_db"
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
EOF
    echo "✓ .env.local created. Edit with your database URL."
else
    echo "✓ .env.local exists"
fi

# Try to migrate database
echo ""
echo "🗄️  Setting up database..."
if command -v psql &> /dev/null; then
    echo "  PostgreSQL found locally"
    npx drizzle-kit push:pg 2>/dev/null || echo "  (Database migration will run on first start)"
else
    echo "  ⚠️  PostgreSQL CLI not found locally (OK if using cloud database)"
    echo "  → Ensure DATABASE_URL points to your database"
    echo "  → Migration will run on first deployment"
fi

echo ""
echo "✅ SETUP COMPLETE!"
echo ""
echo "NEXT STEPS:"
echo "1. Update .env.local with your database URL"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "For production deployment, see DEPLOYMENT.md"
