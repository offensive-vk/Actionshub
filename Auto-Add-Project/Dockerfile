FROM ubuntu:24.04

RUN apt-get update && apt-get install -y git nodejs

COPY . .

RUN npm i; npm run build; npm run test

LABEL \
    "name"="Auto Add Project Action" \
    "homepage"="https://github.com/marketplace/actions/auto-add-project" \
    "repository"="https://github.com/offensive-vk/auto-add-project" \
    "maintainer"="TheHamsterBot <TheHamsterBot@users.noreply.github.com>"