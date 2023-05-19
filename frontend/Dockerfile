# Specify the base image to use
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY . ./

# Install dependencies
RUN npm install

EXPOSE 8080

# Start the application
ENTRYPOINT "./entrypoint.sh"