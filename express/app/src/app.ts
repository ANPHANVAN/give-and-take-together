import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import envConfig from './config/envConfig';
import route from './routes';

const app = express();

app.use(morgan('combined'));
app.use(express.json()); // Đọc body dạng JSON
app.use(express.urlencoded({ extended: true })); // Đọc form (x-www-form-urlencoded)

// all another frontend can use this backend
app.use(
  cors({
    origin: [
      envConfig.app.FRONTEND_HOST,
      envConfig.app.API_HOST,
      envConfig.app.NODE_ENV === 'development' && 'http://localhost:3000',
    ],
    credentials: true,
  }),
);

app.use(cookieParser());

route(app);

export default app;
