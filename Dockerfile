FROM node:22-alpine AS deps
WORKDIR /app
# Install dependencies based on the preferred package manager
COPY pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm i --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm i -g pnpm
RUN pnpm build
RUN pnpm prune --production

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
CMD ["npm", "run", "start"]