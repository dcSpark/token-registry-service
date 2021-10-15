# Cardano- Token Registry Service

[![Node.js CI](https://github.com/dcSpark/token-registry-service/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/dcSpark/token-registry-service/actions/workflows/node.js.yml)

## Background

## Purpose of this project

The purpose of this micro service is to cache the token information from sources as [CF token registry](https://github.com/cardano-foundation/cardano-token-registry), [CNFT](https://github.com/Cardano-NFTs/policyIDs) that can be queried by the cardano-backend service.

# Requirements

## Building

Development build (with hot reloading):

```bash
# install the right version of Node
nvm use
nvm install

# install dependencies
npm install

# run the server
npm run dev
```

_Never put production credentials into repository!_

## Containers

This will build to a container with the docker file. The container is using the PM2 runtime. You will need to pass ENV variables to the container to register with PM2 logging.

## Tests

## API
