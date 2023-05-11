FROM node:14.16.0-alpine3.13

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

COPY . .

CMD ["npm", "run", "start:dev"]