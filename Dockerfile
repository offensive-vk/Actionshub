# Base image: Debian-based with build tools and Node.js for GitHub Actions
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Install necessary tools and dependencies
RUN apt-get update && \
    apt-get install -y \
    git \
    python3 \
    python3-pip \
    curl \
    jq \
    && apt-get clean

# Copy the project files to the working directory
COPY . .

# Install Python dependencies if you have any automation scripts
RUN pip3 install -r requirements.txt || echo "No Python dependencies"

# Health check: Verify the Node.js and Git installation
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD node -v && git --version || exit 1

# Expose port if any services run (optional)
EXPOSE 8000

# Default command (optional): You can change this based on your needs
CMD ["bash"]