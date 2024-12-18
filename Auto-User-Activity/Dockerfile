# Use the official Node.js image as the base image
FROM node:20-bookworm

# Set the working directory inside the container
WORKDIR /app

# Install git
RUN apt-get update && apt-get install -y git

# Setup Node and pnpm
RUN npm i -g pnpm@9.0.0

# Copy the necessary files to the container
COPY package*.json ./

# Install the required dependencies
RUN pnpm i

# Copy the rest files
COPY . .

# Build the Project
RUN pnpm run build

# Set the default command to run the action
CMD ["sleep", "infinity"]