FROM node:20 as build-stage

WORKDIR /build

COPY ./package*.json .
COPY ./client/package*.json ./client/
COPY ./common/package*.json ./common/
COPY ./server/package*.json ./server/
RUN npm ci
COPY . .
RUN npm run build

ENV NODE_ENV=production
RUN npm pkg delete scripts.prepare
RUN npm ci

FROM node:20-alpine as production-stage

WORKDIR /app

COPY --from=build-stage /build .
ENV VUE_DIST_DIR=/app/client/dist

WORKDIR /app/server
ENV NODE_ENV=production
ARG EXPRESS_PORT=2567
EXPOSE $EXPRESS_PORT
CMD [ "node", "dist/index.js" ]

LABEL org.opencontainers.image.source https://github.com/Steditor/poll
