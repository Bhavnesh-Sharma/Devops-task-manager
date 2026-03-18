# Stage 1: Build dependencies
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .


# Stage 2: Distroless runtime
FROM gcr.io/distroless/nodejs24-debian13:nonroot

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

CMD ["src/server.js"]
