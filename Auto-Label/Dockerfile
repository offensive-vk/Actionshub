FROM node:20-slim

SHELL ["/bin/bash", "-c"]

RUN npm i -g pnpm@9.0.0

WORKDIR /app

COPY package*.json ./

RUN pnpm i

RUN pnpm i --lockfile-only

COPY . .

RUN pnpm run bundle

ENTRYPOINT ["node", "./dist/index.js"]

LABEL \
    "name"="Auto Label Action" \
    "homepage"="https://github.com/marketplace/actions/auto-label" \
    "repository"="https://github.com/offensive-vk/auto-label" \
    "maintainer"="TheHamsterBot <TheHamsterBot@users.noreply.github.com>"