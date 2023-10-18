import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { authService } from '@services/db/auth.service';

const log: Logger = config.createLogger('AuthWorker');

class AuthWorker {
  async addAuthUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;

      //add method to send data to database
      await authService.createAuthUser(value);
      job.progress(100);
      done(null, value);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const authWorker: AuthWorker = new AuthWorker();
