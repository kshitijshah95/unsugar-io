#!/bin/bash

echo "🚀 Deploying Unsugar Blog to Netlify..."
echo ""
echo "This will:"
echo "1. Deploy the built app to Netlify"
echo "2. Create a new site or link to existing one"
echo ""
echo "Follow the prompts to complete deployment."
echo ""
echo "-------------------------------------------"
echo ""

cd "$(dirname "$0")"

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ dist folder not found. Building..."
    npm run build
fi

# Deploy to Netlify
netlify deploy --prod --dir=dist

echo ""
echo "-------------------------------------------"
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Copy your site URL (shown above)"
echo "2. Deploy backend to Render.com"
echo "3. Update environment variables"
echo ""
echo "See DEPLOYMENT_STEPS.md for detailed instructions"
