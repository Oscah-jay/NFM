/**
 * Logger Utility
 * Simple logging with different levels
 */

const levels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function timestamp() {
  return new Date().toISOString();
}

function log(level, message, data = null) {
  const time = timestamp();
  const prefix = `[${time}] [${level}]`;

  let color = colors.reset;
  if (level === levels.ERROR) color = colors.red;
  if (level === levels.WARN) color = colors.yellow;
  if (level === levels.INFO) color = colors.blue;
  if (level === levels.DEBUG) color = colors.gray;

  let output = `${color}${prefix}${colors.reset} ${message}`;
  if (data) {
    output += `\n${JSON.stringify(data, null, 2)}`;
  }

  console.log(output);
}

const logger = {
  error: (message, data) => log(levels.ERROR, message, data),
  warn: (message, data) => log(levels.WARN, message, data),
  info: (message, data) => log(levels.INFO, message, data),
  debug: (message, data) => process.env.NODE_ENV !== 'production' && log(levels.DEBUG, message, data),
};

module.exports = logger;