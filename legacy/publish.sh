#!/bin/bash

# Ensure script is run from dev branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "dev" ]; then
  echo "Error: You are not on the dev branch. Please switch to the dev branch and try again."
  exit 1
fi

# Pull latest changes from dev
echo "Pulling latest changes from dev branch..."
git pull origin dev

# Switch to the main branch
echo "Switching to the main branch..."
git checkout main

# Pull latest changes from main
echo "Pulling latest changes from main branch..."
git pull origin main

# Merge dev into main
echo "Merging dev branch into main..."
git merge dev

# Push changes to main branch
echo "Pushing changes to main branch..."
git push origin main

# Switch back to dev branch
echo "Switching back to dev branch..."
git checkout dev

echo "Publish complete!"
