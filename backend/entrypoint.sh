#!/bin/bash

set -e

cd /app
npm upgrade
npm install
npx prisma migrate dev &&
node dist/main
