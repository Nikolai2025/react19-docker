# Dev image for React (Vite) with hot reload
FROM node:20-alpine

WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm ci

# Copy project
COPY . .

# Vite dev server port
EXPOSE 5173

# Important: Vite needs --host so it is reachable from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]