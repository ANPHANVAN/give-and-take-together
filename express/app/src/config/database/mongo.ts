import envConfig from '../envConfig';

// Using Node.js `require()`
const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(envConfig.MONGO_LINK).then(() => console.log('MongoDB Connected!'));
  } catch (error) {
    console.log('MongoDB connect Failure!');
  }
}

export default { connect };
