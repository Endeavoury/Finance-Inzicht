FROM node:26.5.0-alpine AS build
WORKDIR /design-system

COPY design-system/ ./
RUN npm ci
RUN npm run build-storybook

FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY --from=build /design-system/storybook/storybook-static /usr/share/nginx/html
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --retries=20 \
  CMD wget -qO- http://127.0.0.1:8080/index.html >/dev/null || exit 1
