FROM ubuntu:24.04

RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=1000:1000 --chmod=755 *.sh /
ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]
LABEL \
    name="Auto Repo Stats" \
    version="7.0.0" \
    description="Generate repository statistics such as file counts and word counts." \
    homepage="https://github.com/marketplace/actions/auto-stats" \
    repository="https://github.com/offensive-vk/auto-stats" \
    maintainer="TheHamsterBot <TheHamsterBot@users.noreply.github.com>"
