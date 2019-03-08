/**
 * Created by huangjiali on 2019/3/6.
 */
'use strict';
module.exports = app => {
  const checkLogin = app.middleware.checkLogin(app);
  const checkRoot = app.middleware.checkRoot(app);
  const subRouter = app.router.namespace('/api/v1');
  // 商品列表(贩卖机端)
  subRouter.post('/machine/product_list', app.controller.v1.machine.productList);
  // 商品详情(贩卖机端)
  subRouter.post('/machine/product_detail', app.controller.v1.machine.productDetail);
  // 下单(贩卖机端)
  subRouter.post('/machine/place_order', app.controller.v1.machine.placeOrder);
  // 支付回调
  subRouter.post('/machine/pay_notify', app.controller.v1.machine.payNotify);

  // 管理员登录
  subRouter.post('/admin/login', app.controller.v1.admin.login);
  // 商品列表
  subRouter.post('/admin/product_list', checkLogin, app.controller.v1.admin.productList);
  // 商品详情
  subRouter.post('/admin/product_detail', checkLogin, app.controller.v1.admin.productDetail);
  // 添加商品
  subRouter.post('/admin/add_product', checkLogin, app.controller.v1.admin.addProduct);
  // 编辑商品
  subRouter.post('/admin/edit_product', checkLogin, app.controller.v1.admin.editProduct);
  // 上下架商品
  subRouter.post('/admin/put_product', checkLogin, app.controller.v1.admin.putProduct);
  // 查看销售数据
  subRouter.post('/admin/sale_data', checkLogin, app.controller.v1.admin.saleData);
  // 管理员列表
  subRouter.post('/admin/admin_list', checkLogin, checkRoot, app.controller.v1.admin.adminList);
  // 管理员详情
  subRouter.post('/admin/admin_detail', checkLogin, checkRoot, app.controller.v1.admin.adminDetail);
  // 添加管理员
  subRouter.post('/admin/add_admin', checkLogin, checkRoot, app.controller.v1.admin.addAdmin);
  // 编辑管理员
  subRouter.post('/admin/edit_admin', checkLogin, checkRoot, app.controller.v1.admin.editAdmin);
  // 删除（禁用）管理员
  subRouter.post('/admin/ban_admin', checkLogin, checkRoot, app.controller.v1.admin.banAdmin);
};
