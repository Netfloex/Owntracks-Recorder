ARG NODE_IMAGE=node:12-alpine

FROM $NODE_IMAGE AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM $NODE_IMAGE AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN yarn build

FROM alpine:3 AS runner
WORKDIR /app

RUN apk add --no-cache --repository=http://dl-cdn.alpinelinux.org/alpine/v3.11/main/ nodejs=12.22.6-r0


COPY --from=builder /app/dist/index.js .


CMD [ "node", "index.js" ]