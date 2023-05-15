#!/bin/bash
cd /app
npx prisma generate &&
npx prisma migrate dev &&
npm run start:dev