import { Router } from 'express';
import type { IRouter } from 'express';
import { getTokenInfo } from './v1-get-token-info';
import { getFingerprintInfo } from './v1-get-fingerprint-info';

const router: IRouter = Router();
router.post('/getTokenInfo', getTokenInfo);
router.post('/getFingerprintInfo', getFingerprintInfo);

export { router as tokenRoutes };
