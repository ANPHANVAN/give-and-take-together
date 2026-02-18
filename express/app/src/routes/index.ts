import { Application } from 'express';
import { Request, Response } from 'express';
import { errorHandler } from '../middlewares/errorHandler';
import authRouter from '../modules/auth/auth.route';
// const authMiddleware = require('../middleware/authMiddleware');
// const allowRole = require('../middleware/allowRole');
// const meRouter = require('./me');
// const guestRouter = require('./guest.js');
import userRouter from '@/modules/users/user.route';

function route(app: Application) {
  // [GET] /health
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('OK');
  });

  // app.use('/guest', guestRouter);
  // app.use('/me', meRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Wellcome An API' });
  });

  // Global error handler (should be after routes)
  app.use(errorHandler);
}

export default route;
