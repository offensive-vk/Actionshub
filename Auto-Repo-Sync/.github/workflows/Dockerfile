FROM ubuntu:24.04

RUN apt-get update && apt-get install -y git

COPY --chmod=755 ../../entrypoint.sh /

ENTRYPOINT ["sh" , "/entrypoint.sh"]

LABEL \
    "name"="Auto Repo Sync" \
    "homepage"="https://github.com/marketplace/actions/auto-repo-sync" \
    "repository"="https://github.com/offensive-vk/auto-repo-sync" \
    "maintainer"="TheHamsterBot <TheHamsterBot@users.noreply.github.com>"