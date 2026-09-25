# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend
FROM python:3.11-slim
WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Install dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend source & data
COPY backend/ ./backend/
COPY run_server.py ./

# Copy built frontend assets
COPY --from=frontend-builder /frontend/dist ./frontend/dist

EXPOSE 8000

CMD ["python", "run_server.py"]
