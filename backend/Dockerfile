# backend/Dockerfile

FROM node:20-slim
WORKDIR /usr/src/app

# Explicitly copy both files
COPY package.json ./
COPY package-lock.json ./

# Install production dependencies using the lockfile
RUN npm ci --only=production

# Copy the rest of your application code
COPY . .

EXPOSE 8000
CMD [ "node", "src/app.js" ]