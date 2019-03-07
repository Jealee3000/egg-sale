/**
 * Created by huangjiali on 2019/3/6.
 */
// 校验超级管理员中间件
module.exports = options => {
  return async function checkRoot(ctx, next) {
    if (ctx.session.is_root !== 1) {
      ctx.status = 401;
      ctx.body = '你无权访问';
      return;
    }
    await next();
  };
};