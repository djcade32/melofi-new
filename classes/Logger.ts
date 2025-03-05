export class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  public error(message: string, object?: any) {
    object ? console.error(`ERROR: ${message}: `, object) : console.error(`ERROR: ${message}`);
  }

  public info(message: string, object?: any) {
    object ? console.log(`INFO: ${message}: `, object) : console.log(`INFO: ${message}`);
  }

  public warn(message: string, object?: any) {
    object ? console.warn(`WARN: ${message}: `, object) : console.warn(`WARN: ${message}`);
  }
}
