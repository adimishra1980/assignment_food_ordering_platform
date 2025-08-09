FROM node:20-slim

WORKDIR /app

# Ensure devDependencies get installed
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
