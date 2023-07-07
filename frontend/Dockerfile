# stage build
FROM node:18

ARG HOSTNAME
ENV HOSTNAME ${HOSTNAME}

WORKDIR /app

# copy everything to the container
COPY . .

RUN npm install -g npm@latest
RUN npm install

# clean install all dependencies
RUN npm ci
RUN npm audit fix

# build SvelteKit app
RUN npm run build

CMD ["node", "build/index.js"]