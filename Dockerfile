FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN yarn
RUN NODE_OPTIONS=--openssl-legacy-provider yarn build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /data/www
COPY --from=builder /app/etc/nginx /etc/nginx

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
