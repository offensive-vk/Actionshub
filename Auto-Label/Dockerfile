FROM node:22
SHELL ["/bin/bash", "-c"]
RUN npm install -g pnpm@10.0.0
WORKDIR /app
COPY package*.json ./
RUN pnpm i
COPY . .
RUN pnpm run build
ENTRYPOINT ["node", "dist/index.js"]
LABEL \
    name="Auto Label" \
    homepage="https://github.com/marketplace/actions/auto-label-stuff" \
    repository="https://github.com/offensive-vk/auto-label" \
    maintainer="TheHamsterBot <TheHamsterBot@users.noreply.github.com>"
