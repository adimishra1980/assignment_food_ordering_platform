# backend/Dockerfile

# Use an official Node.js 20 image as a base
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files first to leverage Docker's layer caching
COPY package*.json ./


# Install only the dependencies needed for production
RUN npm install --only=production

# Copy the rest of the backend code
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# The command to start your application
CMD [ "node", "src/index.js" ]