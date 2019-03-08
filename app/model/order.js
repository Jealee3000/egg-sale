/**
 * Created by huangjiali on 2019/3/6.
 */
'use strict';
module.exports = app => {
  const { INTEGER, STRING, DATE } = app.Sequelize;
  const m = app.model.define('order', {
    id: { type: INTEGER(11), autoIncrement: true, primaryKey: true },
    no: { type: STRING(128), unique: true, allowNull: false, comment: '订单号', field: 'no' },
    product_id: { type: INTEGER(11), allowNull: false, comment: '商品id', field: 'product_id' },
    transaction_id: { type: STRING(128), allowNull: false, comment: '支付号', field: 'transaction_id' },
    openid: { type: STRING(128), allowNull: true, comment: '用户支付的唯一标识', field: 'openid' },
    real_payment: { type: INTEGER(11), allowNull: false, comment: '商品价格', field: 'real_payment' },
    pay_way: { type: INTEGER(2), allowNull: false, defaultValue: 1, comment: '支付方式 1微信2支付宝3现金', field: 'pay_way' },
    status: { type: INTEGER(2), allowNull: false, defaultValue: 0, comment: '支付状态 0未支付1已支付', field: 'status' },
    pay_date: { type: DATE, allowNull: true, comment: '支付时间', field: 'pay_date' },
  }, {
    tableName: 'order',
    underscored: true,
    timestamps: true,
  });
  return m;
};
