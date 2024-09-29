FROM ubuntu:24.04

RUN apt-get update && apt-get install -y git gnupg

COPY --chown=1000:1000 --chmod=+x entrypoint.sh /

ENTRYPOINT ["sh", "/entrypoint.sh"]

LABEL \
    "name"="Auto Commit and Push Action" \
    "homepage"="https://github.com/marketplace/actions/auto-commit-push" \
    "repository"="https://github.com/offensive-vk/auto-commit-push" \
    "maintainer"="TheHamsterBot <TheHamsterBot@users.noreply.github.com>"
