# Simple single-stage Dockerfile for NestJS API
FROM node:22-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]


