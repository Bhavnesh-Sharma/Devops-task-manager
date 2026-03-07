## DevOps Task Manager

Simple full stack Node.js task manager application built for **DevOps practice**.

Stack:

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: Vanilla HTML/CSS/JS
- **Infra**: Docker, `docker-compose`

Use this project to practice:

- **Docker** image builds and containerization
- **CI/CD** pipelines (build, test, lint, docker build/push, deploy)
- **Kubernetes** deployment and health checks
- **Reverse proxy** with Nginx (or any ingress controller)

---

### 1. Project structure

- **`src/server.js`**: Express app, MongoDB connection, healthcheck endpoint
- **`src/models/Task.js`**: Mongoose model
- **`src/controllers/taskController.js`**: CRUD logic
- **`src/routes/taskRoutes.js`**: REST routes mounted at `/api/tasks`
- **`public/`**: Static frontend (served by Express)
- **`Dockerfile`**: Backend container image
- **`docker-compose.yml`**: Runs Node.js API + MongoDB locally

---

### 2. Local development (no Docker)

**Prereqs**:

- Node.js 20+
- Local MongoDB running on `mongodb://localhost:27017`

```bash
cd /home/guest/Desktop/nodejs-task-manager
npm install

export MONGO_URI="mongodb://localhost:27017/devops_task_manager"
export PORT=3000

npm start   # or: npx nodemon src/server.js
```

Open in browser: `http://localhost:3000`

Useful endpoints:

- **Healthcheck**: `GET /healthz`
- **List tasks**: `GET /api/tasks`
- **Create task**: `POST /api/tasks`
- **Get task**: `GET /api/tasks/:id`
- **Update task**: `PUT /api/tasks/:id`
- **Delete task**: `DELETE /api/tasks/:id`

Example `curl`:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Deploy to staging","status":"in-progress"}'
```

---

### 3. Run with Docker and Docker Compose

**Build and start services**:

```bash
cd /home/guest/Desktop/nodejs-task-manager
docker compose up -d --build
```

This starts:

- **MongoDB** on `mongodb://mongo:27017/devops_task_manager`
- **API + frontend** on `http://localhost:3000`

Check containers:

```bash
docker compose ps
```

Tail logs:

```bash
docker compose logs -f api
docker compose logs -f mongo
```

Stop everything:

```bash
docker compose down
```

---

### 4. DevOps practice ideas

- **Docker**:
  - Build the image: `docker build -t your-registry/devops-task-manager:local .`
  - Run locally: `docker run --rm -p 3000:3000 your-registry/devops-task-manager:local`
  - Push to a registry (Docker Hub, GHCR, ECR, GCR, etc.)

- **CI/CD** (GitHub Actions / GitLab CI / Jenkins / etc.):
  - Install dependencies: `npm ci`
  - Run linter: `npm run lint`
  - Add basic API smoke tests (e.g., check `/healthz` and `/api/tasks`)
  - Build Docker image and push to registry on `main` branch
  - Deploy to your Kubernetes cluster or staging VM

- **Kubernetes**:
  - Create:
    - `Deployment` for the Node.js API
    - `Service` (ClusterIP) for the API
    - `Deployment` / `StatefulSet` + `PersistentVolumeClaim` for MongoDB
  - Configure **readiness** and **liveness** probes using:
    - `GET /healthz`
  - Use a `ConfigMap` or `Secret` for:
    - `MONGO_URI`
  - Optional: Separate frontend and backend, or serve static files via Nginx/ingress.

- **Reverse proxy / Nginx**:
  - Put Nginx in front of the API container:
    - Terminate TLS at Nginx
    - Proxy `/` and `/api` to the Node.js container
  - Example Nginx proxy locations:

    ```nginx
    location / {
      proxy_pass http://api:3000;
    }

    location /api/ {
      proxy_pass http://api:3000/api/;
    }
    ```

  - In Kubernetes, map this via an **Ingress** resource.

---

### 5. Health checks and monitoring hooks

The app exposes simple endpoints that are ideal for CI/CD and Kubernetes:

- **Readiness / liveness**: `GET /healthz` (returns `{ "status": "ok" }` when app is running)
- **API smoke test**: `GET /api/tasks` (should return `200` and JSON array)

You can use these in:

- CI pipelines (after deployment) to verify rollout
- Kubernetes `readinessProbe` / `livenessProbe`
- Nginx / load balancer health checks

---

### 6. Notes

- This project intentionally keeps **business logic very simple** so you can focus on DevOps tooling, observability, and deployment strategies.
- Feel free to extend it with:
  - Authentication
  - Request logging to a centralized system
  - Metrics (Prometheus endpoints)
  - Tracing, etc.


