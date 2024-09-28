FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN pnpm i --production

RUN pnpm i --lockfile-only

COPY . .

RUN pnpm run bundle

ENTRYPOINT ["node", "./dist/index.js"]
