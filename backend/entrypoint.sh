#!/bin/bash

set -e

cd /app
npm upgrade
npm install
npx prisma migrate dev &&
npm run start:dev
# node dist/main
