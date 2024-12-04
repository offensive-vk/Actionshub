FROM node:20-bullseye
WORKDIR /app
RUN apt-get update && \
    apt-get install -y \
    git \
    python3 \
    python3-pip \
    curl \
    jq \
    && apt-get clean

COPY . .
RUN pip3 install -r requirements.txt || echo "No Python dependencies"
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD node -v && git --version || exit 1
EXPOSE 8000
CMD ["bash"]