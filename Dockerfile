FROM node:16-alpine
LABEL org.opencontainers.image.authors=evan_feng
LABEL org.opencontainers.image.email=1143046586@qq.com

COPY . /app
WORKDIR /app
RUN yarn

EXPOSE 3580
LABEL docker.idocker.icon="/img/pwa-512x512.png"

VOLUME /var/run/docker.sock /idocker

ENTRYPOINT yarn start
