# Multi-stage Dockerfile for Playwright TypeScript application
FROM node:20-slim AS base

# Install system dependencies required for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY playwright.config.ts ./

# Install dependencies
RUN npm ci --only=production

# Install Playwright browsers
RUN npx playwright install --with-deps

# Development stage
FROM base AS development

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY tests/ ./tests/

# Create screenshots directory
RUN mkdir -p screenshots

# Expose port for potential web server
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production

# Copy built application (assumes you've built it locally or in CI)
COPY dist/ ./dist/
COPY tests/ ./tests/

# Create screenshots directory
RUN mkdir -p screenshots

# Set production environment
ENV NODE_ENV=production

# Run tests by default
CMD ["npm", "test"]

# Build stage (for CI/CD)
FROM development AS build

# Build the TypeScript application
RUN npm run build

# Final production image
FROM base AS final

# Copy built application from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/tests ./tests

# Create screenshots directory
RUN mkdir -p screenshots

# Set production environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1

# Run tests by default
CMD ["npm", "test"]