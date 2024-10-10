FROM node:20

# Install pnpm globally
RUN npm i -g pnpm@9.0.0

WORKDIR /app

# Copy only package files to install dependencies
COPY package*.json ./

# Install dependencies using pnpm
RUN pnpm i

# Copy the source code to the container
COPY src/ ./src/

# Build the project, ensuring it compiles to the dist directory
RUN pnpm run build

# Check if dist/index.js exists and list files in the dist directory
RUN ls -al ./dist

# Start the application
ENTRYPOINT ["node", "./dist/index.js"]

LABEL \
    "name"="Auto Issue Action" \
    "homepage"="https://github.com/marketplace/actions/auto-issue" \
    "repository"="https://github.com/offensive-vk/auto-issue" \
    "maintainer"="TheHamsterBot <TheHamsterBot@users.noreply.github.com>"
