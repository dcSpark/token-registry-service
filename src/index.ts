import http from 'http';
import express from 'express';

import { applyMiddleware, readTokenRegistryMappings } from './utils';
import * as middleware from './middleware';
import { tokenRoutes } from './api';

// populated by ConfigWebpackPlugin
// eslint-disable-next-line
declare const CONFIG: ConfigType;

const router = express();

const middlewares = [
  middleware.handleCors,
  middleware.handleBodyRequestParsing,
  middleware.handleCompression,
];

applyMiddleware(middlewares, router);

router.use(middleware.logErrors);
router.use(middleware.errorHandler);
router.use('/v1', tokenRoutes);

const server = http.createServer(router);
const port: number = CONFIG.APIGenerated.port;
export const tokenRegistryData = readTokenRegistryMappings();
server.listen(port, () => console.log(`Listening on ${port}`));
