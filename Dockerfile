FROM node:20-alpine as builder

WORKDIR /app
COPY . .
RUN yarn
RUN NODE_OPTIONS=--openssl-legacy-provider yarn build

FROM nginx:stable-alpine

COPY --from=builder /app/build /data/www
COPY --from=builder /app/etc/nginx /etc/nginx

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
