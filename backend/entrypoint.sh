#!/bin/bash
cd /app
npx prisma migrate dev &&
npm run dev:start
# node dist/main
