export class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  public error(message: string) {
    console.error(`ERROR: ${message}`);
  }

  public info(message: string) {
    console.log(`INFO: ${message}`);
  }

  public warn(message: string) {
    console.warn(`WARN: ${message}`);
  }
}
