#!/bin/bash

git pull

readonly LATEST_TAG=$(git tag | sort -V | tail -1)
readonly PATCH=${LATEST_TAG##*.}
readonly NEW_PATCH=$(( PATCH + 1 ))

git submodule update --init --recursive --remote
sed -ri "s/(\"version\": )\"0.0.6\"/\1\"${LATEST_TAG%.*}.${NEW_PATCH}\"/" package.json

git commit -am"Automatic updating registries

Done by: ${USER}
On host: ${HOSTNAME}"

echo "$(date) tagging as ${LATEST_TAG%.*}.${NEW_PATCH}"

git tag ${LATEST_TAG%.*}.${NEW_PATCH}

git push
git push --tags

MESSAGE="<!here> token-registries updated to ${LATEST_TAG%.*}.${NEW_PATCH}"
MESSAGE+="\\nDone by: ${USER}\\nOn host: ${HOSTNAME}"

curl -X POST -H 'Content-type: application/json' \
    --data "{'text':'${MESSAGE}'}" \
    https://hooks.slack.com/services/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
