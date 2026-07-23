/**
 * Server Configuration
 */

const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
  logLevel: process.env.LOG_LEVEL || 'info',
};

const getCorsOrigins = () => {
  const frontendUrls = config.frontendUrl.split(',').map(url => url.trim());

  if (config.isDevelopment) {
    return [
      ...new Set([
        ...frontendUrls,
        'http://localhost:3000',
        'http://localhost:5500',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5500',
        'http://127.0.0.1:8000',
        'http://localhost:8000'
      ])
    ];
  }

  return frontendUrls;
};

const corsOptions = {
  origin: getCorsOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

module.exports = {
  config,
  corsOptions,
};