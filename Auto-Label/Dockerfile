# Use Node.js version 20 as the base image
FROM node:20

# Use bash shell for subsequent commands
SHELL ["/bin/bash", "-c"]

# Install pnpm globally at the specified version
RUN npm install -g pnpm@9.0.0

# Set the working directory inside the container
WORKDIR /app

# Copy package files to the working directory
COPY package*.json ./

# Install dependencies using pnpm with only lockfile generation
RUN pnpm install

# Copy the remaining project files into the container
COPY . .

# Build the project with the specified command
RUN pnpm run build

# Set the default command to run the application
ENTRYPOINT ["node", "dist/index.js"]

# Metadata labels for the Docker image
LABEL \
    name="Auto Label" \
    homepage="https://github.com/marketplace/actions/auto-label-stuff" \
    repository="https://github.com/offensive-vk/auto-label" \
    maintainer="TheHamsterBot <TheHamsterBot@users.noreply.github.com>"
