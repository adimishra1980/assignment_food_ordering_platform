# frontend/Dockerfile

# --- Build Stage ---
# Use a Node.js image to build the static files
FROM node:20-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# This command creates the optimized production build in /app/dist
RUN npm run build

# --- Production Stage ---
# Use a lightweight Nginx web server to serve the files
FROM nginx:stable-alpine

# Copy the built static files from the previous "build" stage
COPY --from=build /app/dist /usr/share/nginx/html

# The Nginx server in this image listens on port 80 by default
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]