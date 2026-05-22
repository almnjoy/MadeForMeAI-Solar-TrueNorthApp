# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy monorepo package files first (layer cache)
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/

# Install all workspace deps
RUN npm ci

# Copy source
COPY apps/web ./apps/web

# .env at apps/web/.env contains VITE_ vars — baked in at build time
# Build: NODE_ENV=production means Horizons dev plugins are excluded automatically
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine
COPY --from=builder /app/dist/apps/web /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
