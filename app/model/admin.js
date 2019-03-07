/**
 * Created by huangjiali on 2019/3/6.
 */
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const m = app.model.define('admin', {
    id: { type: INTEGER(11), autoIncrement: true, primaryKey: true },
    username: { type: STRING(128), unique: true, allowNull: false, comment: '用户名（登录名）', field: 'username' },
    password: { type: STRING(128), allowNull: false, comment: '密码', field: 'password' },
    salt: { type: STRING(128), allowNull: false, comment: '盐', field: 'salt' },
    nickname: { type: STRING(128), allowNull: true, comment: '昵称', field: 'nickname' },
    telphone: { type: STRING(128), allowNull: true, comment: '手机号', field: 'telphone' },
    is_root: { type: INTEGER(2), allowNull: false, defaultValue: 0, comment: '是否超级管理员 1为是 0为否', field: 'is_root' },
    status: { type: INTEGER(2), allowNull: false, defaultValue: 1, comment: '状态 0禁用 1为正常', field: 'status' },
  }, {
    tableName: 'admin',
    underscored: true,
    timestamps: true,
  });
  return m;
};
