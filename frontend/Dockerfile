FROM node:16-alpine

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ../.env .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "build"]