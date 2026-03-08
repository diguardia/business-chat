#!/usr/bin/env bash
set -euo pipefail

npm install
if [ ! -f .env ]; then
  cp .env.example .env
fi
npm run prisma:generate
npm run prisma:migrate

echo "Proyecto listo. Ejecutá: npm run dev"
