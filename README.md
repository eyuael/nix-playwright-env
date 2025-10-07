# Reproducible Playwright TypeScript Environment

A **reproducible development environment** for Playwright browser testing with TypeScript, built using **Nix flakes** and **Docker**. This project demonstrates how to create consistent, isolated environments that work identically across different machines and operating systems.

## 🎯 Core Features

- **🔒 Reproducible Environment**: Exact same dependencies and versions across all machines
- **🐳 Multi-Platform Support**: Works on Linux, macOS, and Windows (via Docker/WSL)
- **📦 Nix Flakes Integration**: Declarative dependency management with lockfile
- **🔧 Zero Configuration**: One command to get a fully working environment
- **🌐 Cross-Browser Testing**: Chromium, Firefox, and WebKit support
- **📱 Mobile Testing**: Device emulation capabilities
- **🎬 Rich Debugging**: Screenshots, videos, and traces for test failures

## 📁 Project Structure

```
browserServer/
├── src/
│   └── index.ts              # Main TypeScript application
├── tests/
│   └── example.spec.ts       # Playwright test suite
├── screenshots/              # Generated screenshots
├── flake.nix                 # Nix flake configuration
├── Dockerfile                # Multi-stage Docker configuration
├── package.json              # Node.js dependencies
├── tsconfig.json             # TypeScript configuration
├── playwright.config.js      # Playwright test configuration
└── README.md                 # This file
```

## 🛠️ Setup Methods

### Method 1: Using Nix Flakes (Recommended)

1. **Enter the development environment:**
   ```bash
   nix develop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

### Method 2: Using Docker

1. **Build the Docker image:**
   ```bash
   # For development
   docker build --target development -t playwright-dev .
   
   # For production
   docker build --target production -t playwright-prod .
   ```

2. **Run the container:**
   ```bash
   # Development mode
   docker run -it --rm -v $(pwd):/app playwright-dev
   
   # Production mode (runs tests automatically)
   docker run --rm playwright-prod
   ```

### Method 3: Using Nix-built Docker Image

1. **Build the Docker image with Nix:**
   ```bash
   nix build .#default
   docker load < result
   ```

2. **Run the Nix-built container:**
   ```bash
   docker run --rm playwright-typescript-app:latest
   ```

## 🧪 Available Commands

```bash
# Development
npm run dev          # Run TypeScript with ts-node
npm run build        # Compile TypeScript to JavaScript
npm start            # Run compiled JavaScript

# Testing
npm test             # Run all Playwright tests
npm run test:headed  # Run tests with browser UI visible
npm run test:debug   # Run tests in debug mode

# Setup
npm run install-browsers  # Install Playwright browsers
```

## 🔧 Configuration

### Playwright Configuration

The `playwright.config.js` file includes:
- Multiple browser configurations (Chromium, Firefox, WebKit)
- Mobile device simulation
- Screenshot and video recording on failures
- Parallel test execution
- Docker-optimized browser launch options

### TypeScript Configuration

The `tsconfig.json` includes:
- Strict type checking
- ES2020 target with Node.js compatibility
- Source maps for debugging
- Proper module resolution

### Nix Flake Configuration

The `flake.nix` provides:
- Development shell with all required dependencies
- Production Docker image build
- Development Docker image with additional tools
- Proper Playwright browser path configuration

## 🐳 Docker Stages

The Dockerfile includes multiple stages:

1. **base**: Common dependencies and Playwright browsers
2. **development**: Full development environment with dev dependencies
3. **production**: Optimized production environment
4. **build**: Compilation stage for TypeScript
5. **final**: Final production image with compiled code

## 🧪 Test Examples

The test suite includes examples for:

- **Basic Navigation**: Loading pages and verifying content
- **Form Interactions**: Filling forms, selecting options, checking inputs
- **JavaScript Execution**: Running custom JavaScript in browser context
- **Network Interception**: Monitoring and intercepting network requests
- **Multiple Contexts**: Testing with isolated browser contexts
- **Mobile Simulation**: Testing with mobile viewports and user agents
- **Screenshot Capture**: Taking full-page and element screenshots

## 🔍 Troubleshooting

### Common Issues

1. **Playwright browsers not found:**
   ```bash
   npx playwright install
   ```

2. **Permission issues in Docker:**
   ```bash
   docker run --user $(id -u):$(id -g) ...
   ```

3. **Missing system dependencies:**
   ```bash
   npx playwright install-deps
   ```

### Environment Variables

- `PLAYWRIGHT_BROWSERS_PATH`: Set automatically by Nix flake
- `NODE_ENV`: Set to 'development' or 'production'
- `CI`: Set to enable CI-specific configurations

## 📊 Output

Tests generate:
- HTML reports in `playwright-report/`
- Screenshots in `screenshots/`
- Videos on test failures
- Trace files for debugging

## 🚀 Deployment

### Server Deployment

1. **Using Nix on NixOS:**
   ```bash
   nix build .#default
   docker load < result
   docker run -d --name playwright-server playwright-typescript-app:latest
   ```

2. **Using Docker Compose:**
   ```yaml
   version: '3.8'
   services:
     playwright:
       build: .
       target: production
       volumes:
         - ./screenshots:/app/screenshots
   ```

### CI/CD Integration

The setup works well with:
- GitHub Actions
- GitLab CI
- Jenkins
- Any CI system with Docker or Nix support

## 📝 License

MIT License - feel free to use this setup for your projects!