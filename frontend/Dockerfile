# Single-stage build and serve via vite preview
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
RUN npm install --silent

# Copy source and build
COPY src/ ./src/
COPY index.html ./
RUN npm run build

EXPOSE 80
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]
