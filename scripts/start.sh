#!/bin/sh

set -e

# Deploy migrations
npm run db:migrate

# Run the server
npm run start