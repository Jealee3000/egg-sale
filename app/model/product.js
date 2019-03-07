/**
 * Created by huangjiali on 2019/3/6.
 */
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const m = app.model.define('product', {
    id: { type: INTEGER(11), autoIncrement: true, primaryKey: true },
    no: { type: STRING(128), unique: true, allowNull: false, comment: '商品编号', field: 'no' },
    name: { type: STRING(128), allowNull: false, comment: '商品名', field: 'name' },
    price: { type: INTEGER(11), allowNull: false, comment: '商品价格', field: 'price' },
    inventory: { type: INTEGER(11), allowNull: false, defaultValue: 0, comment: '库存', field: 'inventory' },
    status: { type: INTEGER(2), allowNull: false, defaultValue: 0, comment: '状态 1上架 0下架', field: 'status' },
    describe: { type: STRING(512), allowNull: true, comment: '商品描述', field: 'describe' },
  }, {
    tableName: 'product',
    underscored: true,
    timestamps: true,
  });
  return m;
};
