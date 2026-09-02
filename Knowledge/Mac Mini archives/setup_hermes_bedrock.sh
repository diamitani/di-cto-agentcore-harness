#!/bin/bash

# Set environment variables for Hermes with AWS Bedrock integration
export ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-your-api-key-here}"
export CLAUDE_CODE_USE_BEDROCK="1"
export CLAUDE_CODE_USE_MANTLE="1"
export AWS_REGION="us-east-1"

echo "Environment variables for Hermes with Bedrock integration have been set."
echo "To use these variables in your current terminal session, run:"
echo "source /Users/patmini/setup_hermes_bedrock.sh"

# Optional: Start Hermes with these environment variables
# Uncomment the following line if you want to start Hermes automatically
# open -a Hermes