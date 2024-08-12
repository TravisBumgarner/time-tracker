#!/bin/bash

###############################################
# Bootstrap script for setting up a new repo. #
###############################################

###############################################
# Create the pre-commit hook script           #
###############################################

# Create the .git directory if it doesn't exist
mkdir -p .git

# Create the pre-commit hook file and add the specified lines

echo "yarn run lint" > .git/hooks/pre-commit
echo "yarn run verify-types" >> .git/hooks/pre-commit

# Make the script executable
chmod +x .git/hooks/pre-commit

echo "Pre-commit hook script created successfully."

###############################################
# Install dependencies                        #
###############################################

yarn 