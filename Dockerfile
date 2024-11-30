FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm i --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm i -g pnpm

RUN --mount=type=secret,id=GITHUB_CLIENT_ID,env=GITHUB_CLIENT_ID \
--mount=type=secret,id=GITHUB_CLIENT_SECRET,env=GITHUB_CLIENT_SECRET \
pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
CMD ["npm", "run", "start"]
