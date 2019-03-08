/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551793238503_7490';
  config.security = {
    csrf: {
      enable: false,
      // ignore: ctx => isInnerIp(ctx.ip),
      ignoreJSON: false, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
  };
  // add your middleware config here
  config.middleware = [ 'errorHandler' ];
  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'sale_test',
    host: '127.0.0.1',
    port: '3306',
    username: 'root',
    password: '',
    timezone: '+08:00', // 东八时区
    operatorsAliases: false,
    // logging: console.log, // 日志打印
    benchmark: true, // sql执行时间打印
  };

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
    agent: true,
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
