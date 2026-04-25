# ─── Stage 1: Build ───────────────────────────────────────────────────────────
# Full dev environment: installs all deps (including devDeps) and compiles TypeScript.
FROM node:25-alpine AS builder

RUN npm install -g pnpm@latest
WORKDIR /app

# Copy manifests first — dependency layer is cached independently of source changes
COPY package.json pnpm-lock.yaml ./
RUN  pnpm install --frozen-lockfile

# Copy config files and source
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY prisma/ ./prisma/
COPY src/ ./src/

# Generate Prisma client and build
RUN pnpm exec prisma generate && pnpm build


# ─── Stage 2: Production image ────────────────────────────────────────────────
# Minimal runtime: no source, no devDependencies, no build tools.
FROM node:25-alpine AS production

RUN npm install -g pnpm@latest

# Non-root user — principle of least privilege
RUN addgroup --system --gid 1001 nodejs \
  && adduser  --system --uid 1001 nestjs

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod \
  && pnpm add prisma \
  && pnpm store prune

# Prisma schema is required by `migrate deploy` at runtime
COPY prisma/ ./prisma/

COPY prisma.config.ts ./

# Copy compiled output and generated Prisma client from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated

# Copy the entrypoint script before switching user
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh \
  && chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
