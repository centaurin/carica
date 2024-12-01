#!/bin/sh

set -e

# Deploy migrations
npx --yes drizzle-kit push

# Run the server
npm run start
