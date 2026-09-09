#!/usr/bin/env bash

# ==============================================================================
# Global Student Connect - Repository Initialization Script
# MERN Stack Monorepo Bootstrap (Streamlined Team Starter)
# ==============================================================================

set -e

# ANSI Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}  Initializing 'Global Student Connect' Repository  ${NC}"
echo -e "${BLUE}====================================================${NC}"

# 1. Initialize Git repository if not present
echo -e "\n${YELLOW}[1/6] Checking Git Initialization...${NC}"
if [ ! -d ".git" ]; then
  git init
  echo -e "${GREEN}✓ Git repository initialized.${NC}"
else
  echo -e "${GREEN}✓ Git repository already present.${NC}"
fi

# 2. Setup Root package.json with concurrently
echo -e "\n${YELLOW}[2/6] Configuring Root package.json & concurrently...${NC}"
if [ ! -f "package.json" ]; then
  npm init -y > /dev/null
fi

npm install concurrently --save-dev

node -e '
const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
pkg.name = "global-student-connect";
pkg.private = true;
pkg.scripts = {
  "dev": "concurrently -n \"BACKEND,FRONTEND\" -c \"blue,green\" \"npm run server\" \"npm run client\"",
  "client": "npm run dev --prefix frontend",
  "server": "npm run dev --prefix backend",
  "install:all": "npm install && npm install --prefix frontend && npm install --prefix backend",
  "build": "npm run build --prefix frontend"
};
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
'
echo -e "${GREEN}✓ Root package.json configured with monorepo scripts.${NC}"

# 3. Scaffold Frontend with Vite + React
echo -e "\n${YELLOW}[3/6] Scaffolding Frontend (Vite + React)...${NC}"
if [ ! -d "frontend" ] || [ -z "$(ls -A frontend 2>/dev/null)" ]; then
  npm create vite@latest frontend -- --template react
  cd frontend
  npm install
  cd ..
  echo -e "${GREEN}✓ Frontend scaffolded and dependencies installed.${NC}"
else
  echo -e "${GREEN}✓ Frontend directory found. Ensuring dependencies are installed...${NC}"
  cd frontend
  npm install
  cd ..
fi

# 4. Scaffold Backend with Express & Mongoose
echo -e "\n${YELLOW}[4/6] Scaffolding Backend (Express + Mongoose)...${NC}"
mkdir -p backend
cd backend

if [ ! -f "package.json" ]; then
  npm init -y > /dev/null
fi

npm install express mongoose dotenv cors

node -e '
const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
pkg.name = "backend";
pkg.type = "module";
pkg.main = "server.js";
pkg.scripts = {
  "start": "node server.js",
  "dev": "node --watch server.js"
};
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
'
cd ..
echo -e "${GREEN}✓ Backend dependencies installed and configured.${NC}"

# 5. Create Clean, Streamlined Directories & .gitkeep files
echo -e "\n${YELLOW}[5/6] Creating Clean Feature Directories...${NC}"

# Clean, unnested frontend directories
FRONTEND_DIRS=(
  "frontend/src/components"
  "frontend/src/pages"
)

for dir in "${FRONTEND_DIRS[@]}"; do
  mkdir -p "$dir"
  touch "$dir/.gitkeep"
done

# Standard MVC backend directories
BACKEND_DIRS=(
  "backend/config"
  "backend/controllers"
  "backend/models"
  "backend/routes"
  "backend/middleware"
)

for dir in "${BACKEND_DIRS[@]}"; do
  mkdir -p "$dir"
  touch "$dir/.gitkeep"
done

echo -e "${GREEN}✓ Clean folder structure verified.${NC}"

# 6. Add Environment Template (.env.example)
echo -e "\n${YELLOW}[6/6] Generating backend/.env.example template...${NC}"
cat << 'EOF' > backend/.env.example
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection (MongoDB)
MONGO_URI=mongodb://127.0.0.1:27017/global_student_connect

# Authentication / Security
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# Client URL (for CORS configuration)
CLIENT_URL=http://localhost:5173
EOF

if [ ! -f "backend/.env" ]; then
  cp backend/.env.example backend/.env
  echo -e "${GREEN}✓ backend/.env created from template.${NC}"
fi

echo -e "\n${BLUE}====================================================${NC}"
echo -e "${GREEN}  Repository initialization complete!  ${NC}"
echo -e "${BLUE}  Run 'npm run dev' to start both frontend & backend.  ${NC}"
echo -e "${BLUE}====================================================${NC}"
