# Local Self-Hosted Version Plan

## Goal

Keep a single codebase while supporting two deployment modes:

### Hosted Mode (Current)

```text
Frontend (Render)
        │
        ▼
Backend Container (Render)
        │
        ▼
MongoDB Atlas
```

Environment:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://...
```

---

### Local Portable Mode

Everything runs on the user's machine:

```text
Browser
   │
   ▼
Frontend Container
   │
   ▼
Backend Container
   │
   ▼
MongoDB Container
```

Environment:

```env
NODE_ENV=local
MONGO_URI=mongodb://mongodb:27017/combattracker
```

No Atlas.
No Render.
No internet dependency.

---

# Recommended Approach

## Use a Single Repository

Avoid maintaining a separate branch for the local version.

Benefits:

- One source of truth
- No duplicated bug fixes
- No merge conflicts between versions
- Features automatically work in both deployments

Use environment variables to switch between deployments.

---

## Add Docker Compose at the Project Root

Example:

```yaml
version: '3.9'

services:

  mongodb:
    image: mongo:8
    container_name: combattracker-db

    volumes:
      - mongo-data:/data/db

    ports:
      - "27017:27017"

  backend:
    build: ./backend

    ports:
      - "3000:3000"

    environment:
      MONGO_URI: mongodb://mongodb:27017/combattracker

    depends_on:
      - mongodb

  frontend:
    build: ./frontend

    ports:
      - "4200:80"

    depends_on:
      - backend

volumes:
  mongo-data:
```

Users can then start everything with:

```bash
docker compose up
```

and access:

```text
http://localhost:4200
```

---

# Backend Configuration

Use environment variables for MongoDB connections.

Instead of:

```js
mongoose.connect("hardcoded-atlas-uri");
```

Use:

```js
mongoose.connect(process.env.MONGO_URI);
```

Production:

```env
MONGO_URI=mongodb+srv://atlas...
```

Local:

```env
MONGO_URI=mongodb://mongodb:27017/combattracker
```

---

# Backend Dockerfile

If already dockerized, only minor adjustments may be needed.

Example:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

---

# Frontend Dockerfile

Build Angular and serve through Nginx.

```dockerfile
# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Runtime stage
FROM nginx:alpine

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
```

---

# API URL Configuration

Avoid hardcoding backend URLs.

Bad:

```ts
apiUrl = "https://myapp.onrender.com/api";
```

Use Angular environments.

### environment.ts

```ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000/api"
};
```

### environment.prod.ts

```ts
export const environment = {
  production: true,
  apiUrl: "https://myapp.onrender.com/api"
};
```

Usage:

```ts
this.http.get(`${environment.apiUrl}/combatants`);
```

---

# Better Option: Reverse Proxy

Instead of exposing multiple ports, use Nginx to proxy API requests.

Frontend:

```text
http://localhost
```

API:

```text
http://localhost/api/*
```

Nginx configuration:

```nginx
location /api {
    proxy_pass http://backend:3000;
}
```

Then Angular can always use:

```ts
apiUrl = "/api";
```

This removes environment-specific API URLs.

---

# Database Persistence

Persist MongoDB data using Docker volumes.

```yaml
volumes:
  mongo-data:
```

Benefits:

- Data survives container restarts
- Users keep campaigns between sessions
- No external database required

---

# Import / Export Feature

Strongly recommended for tabletop campaign data.

Example export:

```json
{
  "combatants": [...],
  "encounters": [...],
  "campaigns": [...]
}
```

Benefits:

- Backups
- Migration between computers
- Easy transfer between hosted and local versions

---

# Deployment Configuration

Avoid creating a dedicated local branch.

If behavioral differences are needed:

```env
DEPLOYMENT_MODE=hosted
```

or

```env
DEPLOYMENT_MODE=local
```

Most likely only these values need to change:

```env
MONGO_URI=
API_URL=
JWT_SECRET=
PORT=
```

The application code should remain identical.

---

# Distribution Options

### Developer-Friendly

```bash
git clone <repo>
docker compose up
```

### More User-Friendly (Future Enhancements)

- Start script (`start.bat`)
- Start script (`start.sh`)
- Docker Desktop bundle
- Electron desktop application
- Tauri desktop application

---

# Final Recommendation

1. Keep a single repository and branch.
2. Add a root-level Docker Compose configuration.
3. Run MongoDB locally in a container for self-hosted deployments.
4. Move all URLs and connection strings into environment variables.
5. Use a reverse proxy so the frontend always calls `/api`.
6. Add campaign import/export functionality.
7. Continue using Render + Atlas for hosted deployments without changing application logic.

Result:

- Hosted cloud deployment remains unchanged.
- Self-hosted users can run everything locally with Docker.
- No duplicate codebases.
- No internet dependency in local mode.
- Portable and easy to distribute.
