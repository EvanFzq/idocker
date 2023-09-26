module.exports = {
  apps: [
    {
      name: 'docker-mobile',
      script: './packages/server/dist/index.cjs',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      out_file: '/docker-mobile/logs/info.log',
      error_file: '/docker-mobile/logs/error.log',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};
