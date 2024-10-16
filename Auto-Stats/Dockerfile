FROM ubuntu:24.04

# Install required packages non-interactively
RUN apt-get update && \
    apt-get upgrade -y \
    git bash && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy shell scripts to the container, set permissions, and ownership
COPY --chown=1000:1000 --chmod=755 *.sh /

# Set the entrypoint to your script
ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]

# Metadata labels
LABEL \
    "name"="Auto Repo Stats" \
    "version"="6.0.0" \
    "description"="Generate repository statistics such as file counts and word counts." \
    "homepage"="https://github.com/marketplace/actions/auto-stats" \
    "repository"="https://github.com/offensive-vk/auto-stats" \
    "maintainer"="TheHamsterBot <TheHamsterBot@users.noreply.github.com>"
