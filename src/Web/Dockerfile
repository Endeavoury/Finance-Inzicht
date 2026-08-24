FROM node:26.5.0-alpine AS build
WORKDIR /workspace/design-system
COPY design-system/ ./
RUN npm ci
RUN npm run build:packages

WORKDIR /workspace/src/Web
COPY src/Web/package*.json ./
RUN npm ci
COPY src/Web ./
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/src/Web/dist/web/browser /usr/share/nginx/html
EXPOSE 8080
