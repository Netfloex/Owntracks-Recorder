ARG NODE_IMAGE=node:16-alpine

FROM $NODE_IMAGE AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM $NODE_IMAGE AS builder
WORKDIR /app

RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build
RUN yarn install --production --ignore-scripts --prefer-offline

FROM alpine:3 AS runner
WORKDIR /app

RUN apk add --no-cache --repository=http://dl-cdn.alpinelinux.org/alpine/v3.16/main/ nodejs=16.15.0-r1

COPY --from=builder /app/dist/index.js .
COPY --from=builder /app/node_modules ./node_modules

ENV FORCE_COLOR 1

CMD [ "node", "index.js" ]