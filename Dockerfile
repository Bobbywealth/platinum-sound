# Build stage
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema (needed for postinstall prisma generate)
COPY prisma ./prisma

# Install dependencies (using npm install to handle dependency updates)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
