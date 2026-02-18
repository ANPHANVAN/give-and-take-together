import { Application } from 'express';
import { Request, Response } from 'express';
import { errorHandler } from '../middlewares/errorHandler';
import authRouter from '../modules/auth/auth.route';
// const authMiddleware = require('../middleware/authMiddleware');
// const allowRole = require('../middleware/allowRole');
import userRouter from '@/modules/users/user.route';
import postsRouter from '@/modules/posts/posts.route';

function route(app: Application) {
  // [GET] /health
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('OK');
  });

  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/posts', postsRouter);
  app.use('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Wellcome An API' });
  });

  // Global error handler (should be after routes)E
  app.use(errorHandler);
}

export default route;
