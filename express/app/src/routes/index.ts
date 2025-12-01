import { Application } from 'express';
import { Request, Response } from 'express';
import { errorHandler } from '../middlewares/errorHandler';
import authRouter from './auth';
// const authMiddleware = require('../middleware/authMiddleware');
// const allowRole = require('../middleware/allowRole');
// const meRouter = require('./me');
// const guestRouter = require('./guest.js');

function route(app: Application) {
  // [GET] /health
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('OK');
  });

  app.use('/auth', authRouter);
  // app.use('/guest', guestRouter);
  // app.use('/me', meRouter);
  app.use('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Wellcome An API' });
  });

  // Global error handler (should be after routes)
  app.use(errorHandler);
}

export default route;
