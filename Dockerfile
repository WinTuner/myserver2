# ---------- builder: install all deps + compile TS -> dist ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy sources needed for build
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
COPY Test ./Test
COPY public ./public

RUN npm run build

# Prune to production-only deps for the final image
RUN npm prune --omit=dev

# ---------- runner: minimal production image ----------
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Run as non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

USER appuser

EXPOSE 3000

# MONGODB_URI and PORT must be provided at runtime:
#   docker run -p 3000:3000 -e MONGODB_URI="..." -e PORT=3000 <image>
CMD ["node", "dist/index.js"]
