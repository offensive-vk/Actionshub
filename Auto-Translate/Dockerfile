FROM node:20
WORKDIR /app
RUN apt-get update && apt-get install -y git
RUN npm i -g pnpm@9.0.0
COPY package*.json ./
RUN pnpm i
COPY . .
RUN pnpm run build
CMD ["node", "dist/index.js"]