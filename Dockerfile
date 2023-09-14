FROM node:16
LABEL org.opencontainers.image.authors=evan_feng
LABEL org.opencontainers.image.email=1143046586@qq.com

COPY . /app
WORKDIR /app

# RUN yarn

EXPOSE 3580

VOLUME /var/run/docker.sock /docker-mobile

ENTRYPOINT yarn start
