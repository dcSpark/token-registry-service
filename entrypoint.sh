#!/bin/sh

git submodule update --init
pm2-runtime --json pm2.yaml
