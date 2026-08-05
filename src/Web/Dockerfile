FROM node:26.5.0-alpine AS build
WORKDIR /web
COPY src/Web/package*.json ./
RUN npm install
COPY src/Web .
RUN npm run build
FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /web/dist/web/browser /usr/share/nginx/html
EXPOSE 8080
