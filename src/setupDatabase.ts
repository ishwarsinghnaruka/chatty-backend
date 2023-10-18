import mongoose from 'mongoose';
import { config } from '@root/config';
import Logger from 'bunyan';
import { redisConnection } from '@services/redis/redis.connection';

const log: Logger = config.createLogger('SetupDatabase');

export default () => {
  async function connect() {
    try {
      await mongoose.connect(config.DATABASE_URL!);
      log.info('successfully connected to chatty database');
      redisConnection.connect();
    } catch (error) {
      log.error(error);
      return process.exit(1);
    }
  }
  connect();

  mongoose.connection.on('disconnect', connect);
};
