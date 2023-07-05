FROM node:18

WORKDIR /app

COPY . .

RUN npm install -g npm@latest
RUN npm install

RUN npm run build
# If you are building your code for production
RUN npm ci --omit=dev

CMD [ "node", "dist/main" ]