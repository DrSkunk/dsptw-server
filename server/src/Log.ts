class Log {
  public warn(...message: unknown[]) {
    // Yellow
    console.warn(
      "\x1b[33m%s",
      this.getTimestamp(),
      "- WARN -",
      ...message,
      "\x1b[0m",
    );
  }

  public error(...message: unknown[]) {
    // Red
    console.error(
      "\x1b[31m%s",
      this.getTimestamp(),
      "- ERROR -",
      ...message,
      "\x1b[0m",
    );
  }

  public info(...message: unknown[]) {
    // Blue
    console.info(
      "\x1b[36m%s",
      this.getTimestamp(),
      "- INFO -",
      ...message,
      "\x1b[0m",
    );
  }

  public log(...message: unknown[]) {
    console.log(this.getTimestamp(), "- LOG -", ...message);
  }

  public debug(...message: unknown[]) {
    // Magenta
    console.debug(
      "\x1b[35m%s",
      this.getTimestamp(),
      "- DEBUG -",
      ...message,
      "\x1b[0m",
    );
  }
  private getTimestamp() {
    return new Date().toISOString();
  }
}

export const log = new Log();
