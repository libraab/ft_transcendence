FROM node:16-alpine

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

COPY . .

EXPOSE 5001

CMD ["npm", "run", "build"]