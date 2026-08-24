#!/usr/bin/env sh
set -eu

git submodule update --init --recursive
git -C design-system switch main
git -C design-system pull --ff-only

npm --prefix design-system ci
npm --prefix design-system run build:packages
npm --prefix src/Web ci

echo "Workspace ready: Finance-Inzicht and Finance-DesignSystem are available together."
