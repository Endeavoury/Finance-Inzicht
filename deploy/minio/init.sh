#!/bin/sh
set -eu
mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"
mc mb --ignore-existing local/camt-private
mc anonymous set none local/camt-private
printf health | mc pipe local/camt-private/.health
