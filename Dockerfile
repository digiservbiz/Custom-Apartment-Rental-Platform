FROM node:20-alpine AS base
WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY src/ ./src/

# Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Final image
FROM node:20-alpine
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/src ./src
COPY --from=base /app/package.json ./
COPY --from=frontend /app/client/build ./client/build

EXPOSE 5000
ENV NODE_ENV=production

CMD ["node", "src/server.js"]
