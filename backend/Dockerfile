FROM node:20-slim

WORKDIR /usr/src/app

# Ensure devDependencies get installed
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000
CMD ["npm", "run", "dev"]
