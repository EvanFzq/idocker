module.exports = {
  apps: [
    {
      name: 'idocker',
      script: './packages/server/dist/index.cjs',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      out_file: '/idocker/logs/info.log',
      error_file: '/idocker/logs/error.log',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};
