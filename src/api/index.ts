import { Router } from 'express';
import type { IRouter } from 'express';
import { getTokenInfo } from './v1-get-token-info';

const router: IRouter = Router();
router.post('/getTokenInfo', getTokenInfo);

export { router as tokenRoutes };
