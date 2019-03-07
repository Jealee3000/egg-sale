/**
 * Created by huangjiali on 2019/3/6.
 */
module.exports = app => {
  app.beforeStart(async () => {
    await app.model.sync({ force: false });
    const user = await app.model.Admin.findOne({
      where: {
        username: 'admin',
      },
      attributes: [
        'id',
      ],
    });
    if (!user) {
      await app.model.Admin.create({
        username: 'admin',
        password: '965ce8e90269365ad857138bef55d9c3',
        salt: '660',
        nickname: 'admin',
        telphone: '110',
        is_root: 1,
        status: 1,
      });
    } else {
      await app.model.Admin.update({
        password: '965ce8e90269365ad857138bef55d9c3',
        salt: '660',
        is_root: 1,
        status: 1,
      }, {
        where: { id: user.id },
      });
    }
  });
};
