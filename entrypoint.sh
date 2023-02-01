#!/bin/sh

echo "Updating submodules:"
git submodule update --remote --init

echo "Submodule status: "
git submodule status

pm2-runtime --json pm2.yaml
