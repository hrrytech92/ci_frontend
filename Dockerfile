FROM node:11.14.0

RUN apt-get update && \
  apt-get install --no-install-recommends -y \
    libgtk2.0-0 \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xvfb && \
    rm -rf /var/lib/apt/lists/*

RUN npm install -g yarn@1.15.2
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
# TODO - would be nice to reference external cache. For now no reason to save cache in image
RUN yarn && yarn cache clean

# Global packages
COPY . /usr/src/app

# TODO: Uncomment when prod build is read
RUN yarn build:prod

EXPOSE 8080

CMD yarn serve
