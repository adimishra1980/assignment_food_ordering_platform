# backend/Dockerfile

# Use an official, lightweight Node.js 20 image as a base
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# --- Best Practice: Non-Root User ---
# Create a non-root user for security purposes. Running as root is a risk.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 node
USER node

# --- Best Practice: Optimized Layer Caching ---
# Copy package files from the 'backend' subfolder of the build context.
# This is crucial because your docker-compose.yml builds from the project root.
COPY --chown=node:nodejs backend/package.json ./
COPY --chown=node:nodejs backend/package-lock.json ./

RUN npm ci

# Copy the rest of your application source code from the 'backend' subfolder
COPY --chown=node:nodejs backend/ .

# Expose the port your app runs on
EXPOSE 8000

# --- Best Practice: Health Check ---
# This tells Docker how to check if your application is running correctly.
# It tries to access the /health endpoint every 30 seconds.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# The command to start your application
CMD [ "node", "src/app.js" ]