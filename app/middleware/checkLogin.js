/**
 * Created by huangjiali on 2019/3/6.
 */
'use strict';
// 校验登录中间件
module.exports = () => {
  return async function checkLogin(ctx, next) {
    if (!ctx.headers.authentication) {
      ctx.logger.info();
      ctx.status = 401;
      ctx.body = '用户未登录或已超时';
      return;
    }
    try {
      const token = ctx.headers.authentication;
      const session = await ctx.app.redis.get(`session:${token}`);
      ctx.session = session ? JSON.parse(session) : {};
    } catch (e) {
      ctx.logger.info();
      ctx.status = 401;
      ctx.body = '用户未登录或已超时';
      return;
    }
    ctx.logger.info();
    await next();
  };
};
