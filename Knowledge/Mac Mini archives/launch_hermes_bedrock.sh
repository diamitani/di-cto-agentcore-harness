#!/bin/bash

# Set environment variables for Hermes with AWS Bedrock integration
export ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-your-api-key-here}"
export CLAUDE_CODE_USE_BEDROCK="1"
export CLAUDE_CODE_USE_MANTLE="1"
export AWS_REGION="us-east-1"

echo "Starting Hermes with Bedrock integration..."

# Start Hermes with the environment variables
open -a Hermes