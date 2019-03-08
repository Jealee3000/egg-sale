/**
 * Created by huangjiali on 2019/3/6.
 */
'use strict';
const Service = require('egg').Service;
const uuid = require('uuid');
const util = require('../common/util');

class AdminService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.redis = ctx.app.redis;
    this.createByFailureMsg = ctx.response.ServerResponse.createByFailureMsg;
    this.model = ctx.model;
    this.Op = ctx.model.Op;
    this.Admin = ctx.model.Admin;
    this.Product = ctx.model.Product;
    this.Order = ctx.model.Order;
  }

  async login(body) {
    const { username, password } = body;
    const user = await this.Admin.findOne({
      where: {
        username,
      },
      attributes: [
        'id',
        'password',
        'salt',
        'username',
        'nickname',
        'telphone',
        'is_root',
        'status',
      ],
    });
    if (!user) return this.createByFailureMsg('账户或密码不正确');
    const saltPassword = util.cryptPwd(password, user.salt);
    if (saltPassword !== user.password) return this.createByFailureMsg('账户或密码不正确');
    if (!user.status) return this.createByFailureMsg('该用户已被禁用');
    const token = uuid.v4();
    const data = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      telphone: user.telphone,
      is_root: user.is_root,
      status: user.status,
      token,
    };
    await this.redis.set(`session:${token}`, JSON.stringify(data), 'EX', 2 * 3600);
    return data;
  }

  async adminList(body) {
    const { page, limit } = body;
    const offset = (page - 1) * limit;
    const userList = await this.Admin.findAndCountAll({
      where: {},
      attributes: [
        'id',
        'username',
        'nickname',
        'telphone',
        'is_root',
        'status',
      ],
      order: [[ 'created_at', 'desc' ]],
      offset,
      limit,
    });
    return userList;
  }

  async adminDetail(body) {
    const { admin_id } = body;
    const user = await this.Admin.findOne({
      where: { id: admin_id },
      attributes: [
        'id',
        'username',
        'nickname',
        'telphone',
        'is_root',
        'status',
        'created_at',
        'updated_at',
      ],
    });
    if (!user) return this.createByFailureMsg('该账户不存在');
    return user;
  }

  async addAdmin(body) {
    const { username, password, nickname, telphone } = body;
    const user = await this.Admin.findOne({
      where: {
        username,
      },
      attributes: [
        'id',
      ],
    });
    if (user) return this.createByFailureMsg('该账户已存在');
    const salt = util.getRandomSalt();
    const saltPassword = util.cryptPwd(password, salt);
    const obj = {
      username,
      password: saltPassword,
      salt,
    };
    obj.nickname = nickname || username;
    if (telphone) obj.telphone = telphone;
    const data = await this.Admin.create(obj);
    return {
      admin_id: data.id,
    };
  }

  async editAdmin(body) {
    const { admin_id, password, nickname, telphone } = body;
    const user = await this.Admin.findOne({
      where: {
        id: admin_id,
      },
      attributes: [
        'id',
        'username',
      ],
    });
    if (!user) return this.createByFailureMsg('该账户不存在');
    const obj = {};
    if (password) {
      const salt = util.getRandomSalt();
      const saltPassword = util.cryptPwd(password, salt);
      obj.password = saltPassword;
    }
    obj.nickname = nickname || user.username;
    if (telphone) obj.telphone = telphone;
    await this.Admin.update(
      obj, {
        where: {
          id: admin_id,
        },
      });
    return {};
  }

  async banAdmin(body) {
    const { admin_id } = body;
    const user = await this.Admin.findOne({
      where: {
        id: admin_id,
      },
      attributes: [
        'id',
        'status',
        'is_root',
      ],
    });
    if (!user) return this.createByFailureMsg('该账户不存在');
    if (user.is_root === 1) return this.createByFailureMsg('该用户无法被禁用');
    await this.Admin.update({
      status: +!user.status,
    }, {
      where: {
        id: admin_id,
      },
    });
    return {};
  }

  async saleData(body) {
    const { page, limit } = body;
    const offset = (page - 1) * limit;
    // 按更新时间倒序查询所有上架的商品
    const productList = await this.Product.findAndCountAll({
      where: {
        status: 1,
      },
      attributes: [
        'id',
        'name',
      ],
      order: [[ 'updated_at', 'desc' ]],
      offset,
      limit,
      raw: true,
    });
    // 获取商品今日的销售量
    let product_sale_obj = {};
    const product_cache = await this.redis.hgetall('product:sale_num');
    if (Object.keys(product_cache).length === 0) {
      // 当没有缓存时，通过order表按product_id分组查询出对应的销售量
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      const data = await this.Order.findAll({
        where: {
          pay_date: {
            [this.Op.gte]: today,
          },
        },
        attributes: [
          'product_id',
          [ this.model.fn('count', this.model.col('id')), 'count' ],
        ],
        group: [ 'product_id' ],
        raw: true,
      });
      const obj = {};
      data.forEach(ele => {
        obj[ele.product_id] = +ele.count;
      });
      // 查询后缓存对应的数据5分钟，时间可根据业务调整
      if (data && data.length > 0) {
        await this.redis.hmset('product:sale_num', obj);
        await this.redis.expire('product:sale_num', 300);
      }
      product_sale_obj = obj;
    } else {
      product_sale_obj = product_cache;
    }
    productList.rows.forEach(ele => {
      ele.today_sale_num = product_sale_obj[ele.id] || 0;
    });
    return productList;
  }
}

module.exports = AdminService;
