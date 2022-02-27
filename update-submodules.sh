#!/bin/bash

git submodule update --init --recursive --remote

git commit -am"Automatic updating registries

Done by: ${USER}
On host: ${HOSTNAME}"

readonly LATEST_TAG=$(git tag | sort -V | tail -1)
readonly PATCH=${LATEST_TAG##*.}
readonly NEW_PATCH=$(( PATCH + 1 ))

echo "$(date) tagging as ${LATEST_TAG%.*}.${NEW_PATCH}"

git tag ${LATEST_TAG%.*}.${NEW_PATCH}

git push
git push --tags
