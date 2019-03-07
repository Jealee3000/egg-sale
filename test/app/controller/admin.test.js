'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const uuid = require('uuid');
describe('test/app/controller/admin.test.js', () => {
  describe('超级管理员——管理员相关操作', async () => {
    let token = '';
    let admin_id = '';
    it('超级管理员登录获取token', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/login')
        .type('json')
        .send({
          username: 'admin',
          password: 'e10adc3949ba59abbe56e057f20f883e',
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
          token = res.body.data.token;
        });
    });
    it('增加管理员', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/add_admin')
        .type('json')
        .set('authorization', token)
        .send({
          username: uuid.v4(),
          password: 'e10adc3949ba59abbe56e057f20f883e', // 123456的md5密码
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
          admin_id = res.body.data.admin_id;
        });
    });
    it('编辑管理员', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/edit_admin')
        .type('json')
        .set('authorization', token)
        .send({
          admin_id,
          password: '81dc9bdb52d04dc20036dbd8313ed055', // 1234的md5密码
          nickname: 'test',
          telphone: '110',
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
        });
    });
    it('禁用/启用管理员', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/ban_admin')
        .type('json')
        .set('authorization', token)
        .send({
          admin_id,
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
        });
    });
    it('查看管理员列表', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/admin_list')
        .type('json')
        .set('authorization', token)
        .send({
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
        });
    });
    it('查看管理员详情', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/admin_detail')
        .type('json')
        .set('authorization', token)
        .send({
          admin_id,
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
          assert(res.body.data.id, admin_id);
        });
    });
  });

  // 由于贩卖机相关操作需要商品，因此把相关测试用例放一起
  describe('管理员——商品相关操作以及贩卖机相关操作', async () => {
    let token = '';
    let product_id = '';
    it('管理员登录获取token', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/login')
        .type('json')
        .send({
          username: 'admin',
          password: 'e10adc3949ba59abbe56e057f20f883e',
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
          token = res.body.data.token;
        });
    });
    it('管理员增加商品', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/add_product')
        .type('json')
        .set('authorization', token)
        .send({
          product_no: uuid.v4(),
          product_name: `test${(new Date()).getTime()}`,
          product_price: 100,
          inventory: 10,
          describe: 'test describe 01',
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
          product_id = res.body.data.product_id;
        });
    });
    it('管理员编辑商品', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/edit_product')
        .type('json')
        .set('authorization', token)
        .send({
          product_id,
          product_no: uuid.v4(),
          product_name: `test${(new Date()).getTime()}`,
          product_price: 200,
          inventory: 20,
          describe: 'test describe 02',
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
        });
    });
    it('管理员上下架商品', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/put_product')
        .type('json')
        .set('authorization', token)
        .send({
          product_id,
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
        });
    });
    it('管理员查看商品列表', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/product_list')
        .type('json')
        .set('authorization', token)
        .send({
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
        });
    });
    it('管理员查看商品详情', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/product_detail')
        .type('json')
        .set('authorization', token)
        .send({
          product_id,
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
          assert(res.body.data.id, product_id);
        });
    });
    it('贩卖机查看商品列表', async () => {
      await app.httpRequest()
        .post('/api/v1/machine/product_list')
        .type('json')
        .send({
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
        });
    });
    it('贩卖机查看商品详情', async () => {
      await app.httpRequest()
        .post('/api/v1/machine/product_detail')
        .type('json')
        .send({
          product_id,
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
          assert(res.body.data.id, product_id);
        });
    });
    let out_trade_no = '';
    it('贩卖机下单', async () => {
      await app.httpRequest()
        .post('/api/v1/machine/place_order')
        .type('json')
        .send({
          product_id,
          pay_way: 1,
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
          assert(res.body.data.url_code, 'xxx');
          out_trade_no = res.body.data.no;
        });
    });
    it('模拟支付回调', async () => {
      await app.httpRequest()
        .post('/api/v1/machine/pay_notify')
        .type('json')
        .send({
          out_trade_no,
          openid: `openid${(new Date()).getTime()}`,
          sign: uuid.v4(),
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
          assert(res.body.data, 'success');
        });
    });
    it('管理员查看今日销售数据', async () => {
      await app.httpRequest()
        .post('/api/v1/admin/sale_data')
        .type('json')
        .set('authorization', token)
        .send({
        })
        .expect(200) // 期望返回 status 200
        .then(res => {
          assert(res.body.status, 100);
        });
    });
  });
});
