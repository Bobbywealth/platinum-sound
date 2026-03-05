# Build stage
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install OpenSSL so Prisma can detect the version during build
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Copy prisma schema (needed for postinstall prisma generate)
COPY prisma ./prisma

# Install dependencies (using npm install to handle dependency updates)
RUN npm install --legacy-peer-deps

# Generate Prisma client for target runtime before building
RUN npx prisma generate

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install OpenSSL runtime libraries required by Prisma on Debian Bookworm
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy necessary files from builder
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=node:node /app/prisma ./prisma

USER node

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
