
# Stage 1: Build React frontend
FROM node:22-alpine AS frontend-builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Run Express backend
FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/ ./
COPY --from=frontend-builder /app/dist ./public

EXPOSE 3000
CMD ["node", "src/index.js"]
