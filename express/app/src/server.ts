import http from 'http';

import app from './app';
import envConfig from './config/envConfig';
import mongodb from './config/database/mongo';

const server = http.createServer(app);
mongodb.connect();
server.listen(envConfig.PORT, () => {
  console.log(`Server running on ${envConfig.FRONTEND_HOST} port ${envConfig.PORT}`);
});
