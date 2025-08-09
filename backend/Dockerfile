# backend/Dockerfile

# Use an official, lightweight Node.js 20 image as a base
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# --- Best Practice: Use Existing Non-Root User ---
# The node:20-slim image already comes with a 'node' user. We will use it.
USER node

# Copy package files from the 'backend' subfolder.
# --chown=node:node gives the 'node' user ownership of these files.
COPY --chown=node:node backend/package.json ./
COPY --chown=node:node backend/package-lock.json ./

# Use 'npm ci' which is faster and more reliable for production builds.
RUN npm ci --only=production

# Copy the rest of your application source code.
COPY --chown=node:node backend/ .

# Expose the port your app runs on.
EXPOSE 8000

# Health check (remains the same)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# The command to start your application
CMD [ "node", "src/app.js" ]