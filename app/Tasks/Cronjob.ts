import { BaseTask } from 'adonis5-scheduler/build'
import MonitoredService from "App/Services/MonitoredService";

export default class Cronjob extends BaseTask {
	public static get schedule() {
		return '*/30 * * * * *'
	}
	/**
	 * Set enable use .lock file for block run retry task
	 * Lock file save to `build/tmpTaskLock`
	 */
	public static get useLock() {
		return false
	}

	public async handle() {
    	this.logger.info('Handled')
      const test = await MonitoredService.storeTweets()
      this.logger.info(test)
  	}
}
