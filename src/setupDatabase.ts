import mongoose from 'mongoose';
import { config } from './config';
import Logger from 'bunyan';

const log: Logger = config.createLogger('SetupDatabase');

export default () => {
  async function connect() {
    try {
      await mongoose.connect(config.DATABASE_URL!);
      log.info('successfully connected to chatty database');
    } catch (error) {
      log.error(error);
      return process.exit(1);
    }
  }
  connect();

  mongoose.connection.on('disconnect', connect);
};
