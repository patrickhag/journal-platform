import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [new transports.Console()],
});

export default logger;
