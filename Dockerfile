FROM node:20 as build-stage

WORKDIR /build

COPY ./package*.json .
COPY ./client/package*.json ./client/
COPY ./common/package*.json ./common/
COPY ./server/package*.json ./server/
RUN npm ci
COPY . .
ARG VUE_BASE_URL
ARG VITE_API_URL
RUN npm run build

ENV NODE_ENV=production
RUN npm pkg delete scripts.prepare
RUN npm ci
RUN npx -w server prisma generate

FROM node:20-alpine as production-stage

WORKDIR /app

COPY --from=build-stage /build .
ENV VUE_DIST_DIR=/app/client/dist

WORKDIR /app/server
ENV NODE_ENV=production
ARG EXPRESS_PORT=2567
EXPOSE $EXPRESS_PORT
CMD npx prisma migrate deploy; node dist/index.js

LABEL org.opencontainers.image.source = https://github.com/Steditor/poll
