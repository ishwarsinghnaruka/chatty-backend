import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';

import { userService } from '@services/db/user.service';

const log: Logger = config.createLogger('UserWorker');

class UserWorker {
  async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      //add method to send data to database
      // await authService.createAuthUser(value);
      await userService.addUserData(value);
      job.progress(100);
      done(null, value);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const userWorker: UserWorker = new UserWorker();
