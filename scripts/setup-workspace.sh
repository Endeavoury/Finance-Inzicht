#!/usr/bin/env sh
set -eu

application_dir=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
workspace_dir=$(dirname "$application_dir")
design_dir="$workspace_dir/design"

if [ ! -d "$design_dir/.git" ]; then
  git clone git@github.com:Endeavoury/Finance-DesignSystem.git "$design_dir"
else
  git -C "$design_dir" switch main
  git -C "$design_dir" pull --ff-only
fi

npm --prefix "$design_dir" ci
npm --prefix "$design_dir" run build:packages
npm --prefix "$application_dir/src/Web" ci

echo "Workspace ready:"
echo "  application: $application_dir"
echo "  design:      $design_dir"
