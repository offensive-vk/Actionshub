FROM alpine

RUN echo https://dl-cdn.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories && \
  apk add --no-cache git hub bash

COPY --chown=1000:1000 --chmod=+x *.sh /

ENTRYPOINT ["sh", "./entrypoint.sh"]

LABEL \
  "name"="Auto Pull Request" \
  "homepage"="https://github.com/marketplace/actions/auto-pull-request" \
  "repository"="https://github.com/offensive-vk/auto-pull-request" \
  "maintainer"="TheHamsterBot <TheHamsterBot@users.noreply.github.com>"
