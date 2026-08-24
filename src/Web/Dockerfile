FROM node:26.5.0-alpine AS build
ARG FINANCE_DESIGN_SYSTEM_REF=9610698e98eb71ad803c8b16c17401e716f1c963
RUN apk add --no-cache git
WORKDIR /workspace/design
RUN git clone https://github.com/Endeavoury/Finance-DesignSystem.git . \
  && git checkout --detach "$FINANCE_DESIGN_SYSTEM_REF"
RUN npm ci
RUN npm run build:packages

WORKDIR /workspace/application/src/Web
COPY src/Web/package*.json ./
RUN npm ci
COPY src/Web ./
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/application/src/Web/dist/web/browser /usr/share/nginx/html
EXPOSE 8080
