# frontend/Dockerfile

# --- Build Stage ---
# Use a Node.js image to build the static files.
FROM node:20-slim AS build

# Set the working directory for the build.
WORKDIR /app

# Copy package files from the 'frontend' subfolder of the build context.
COPY frontend/package*.json ./

# Install all dependencies.
RUN npm install

# Copy the rest of your frontend source code.
COPY frontend/ .

# Run the production build script from your package.json.
RUN npm run build


# --- Production Stage ---
# Use a lightweight Nginx web server to serve the final files.
FROM nginx:stable-alpine

# --- Best Practice: Non-Root User ---
# Create a non-root user for Nginx for better security.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy the built static files from the previous "build" stage into Nginx's web root.
COPY --from=build /app/dist /usr/share/nginx/html

# Copy your custom Nginx configuration.
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80, which is the default port Nginx listens on.
EXPOSE 80

# Start the Nginx server when the container launches.
CMD ["nginx", "-g", "daemon off;"]