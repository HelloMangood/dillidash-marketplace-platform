#!/bin/bash
set -e

echo "Starting backend development server..."
npm run dev --prefix backend &

echo "Starting frontend development server..."
npm run dev --prefix frontend