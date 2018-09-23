import * as winston from 'winston'

export const serverLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  transports: [
    // Write all logs error (and below) to `error.log`.
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
    }),

    // Write to all logs with level `info` and below to `combined.log`
    new winston.transports.File({
      filename: 'combined.log',
    }),

    // Write all logs to the console
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
})
