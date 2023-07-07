#!/bin/bash
cd /app
npx prisma migrate dev &&
node dist/main
