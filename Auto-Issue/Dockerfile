FROM node:20
RUN npm i -g pnpm@9.0.0
WORKDIR /app
COPY package*.json ./
RUN pnpm i
COPY . .
RUN pnpm run build || exit 1
RUN ls -al dist || echo "dist/ directory not found"
ENTRYPOINT ["node", "dist/index.js"]
LABEL \
    "name"="Auto Issue" \
    "homepage"="https://github.com/marketplace/actions/auto-issue" \
    "repository"="https://github.com/offensive-vk/auto-issue" \
    "maintainer"="TheHamsterBot <TheHamsterBot@users.noreply.github.com>"