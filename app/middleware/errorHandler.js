/**
 * Created by huangjiali on 2019/3/5.
 */
'use strict';
// 错误处理中间件
module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next();
      if (ctx.trans && ctx.trans.finished !== 'commit' && ctx.trans.finished !== 'rollback') {
        await ctx.trans.commit();
      }
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      app.emit('error', err, this);
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && app.config.env === 'prod' ?
        'Internal Server Error' :
        err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      if (ctx.trans) {
        await ctx.trans.rollback();
      }
      const code = 200;
      ctx.body = {
        status: code,
        msg: error,
      };
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
    }
  };
};
