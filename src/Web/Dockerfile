FROM node:26.5.0-alpine AS build
ARG FINANCE_DESIGN_SYSTEM_REF=eb4be0d3e8481b0da21ee7fd66c8f776dfff11ee
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
