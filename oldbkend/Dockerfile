FROM node:latest

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY . .

# Install app dependencies
RUN npm install -g npm@latest
RUN npm install
RUN npm run start:dev

EXPOSE 3000 5432 3001

ENTRYPOINT "./entrypoint.sh"
