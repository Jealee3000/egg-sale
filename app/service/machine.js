/**
 * Created by huangjiali on 2019/3/7.
 */
const Service = require('egg').Service;
const uuid = require('uuid');
const util = require('../common/util');

class MachineService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.redis = ctx.app.redis;
    this.createByFailureMsg = ctx.response.ServerResponse.createByFailureMsg;
    this.model = ctx.model;
    this.Product = ctx.model.Product;
    this.Order = ctx.model.Order;
  }

  async placeOrder(body) {
    const { product_id, pay_way } = body;
    if (pay_way !== 1) return this.createByFailureMsg('该支付方式暂不支持');
    const product = await this.Product.findOne({
      where: {
        id: product_id,
        status: 1,
      },
      attributes: [
        'id',
        'no',
        'name',
        'price',
        'inventory',
      ],
    });
    if (!product) return this.createByFailureMsg('该商品不存在或者已下架');
    if (product.inventory < 1) return this.createByFailureMsg('该商品已售罄');
    const order_no = uuid.v4();
    const order_name = product.name;
    const order_price = product.price;
    const payObj = util.simulatePayInfo({ order_no, order_name, order_price });
    if (payObj.return_code !== 'SUCCESS') return this.createByFailureMsg('生成支付信息失败');
    const order = await this.Order.create({
      no: order_no,
      product_id,
      transaction_id: payObj.return_msg.transaction_id,
      real_payment: order_price,
      pay_way,
      status: 0,
    });
    return {
      no: order.no,
      real_payment: order.price,
      order_name,
      url_code: payObj.return_msg.code_url,
    };
  }

  async payNotify(body) {
    const { out_trade_no, openid, sign } = body;
    const is_legal = util.simulatePaySignVerify({ out_trade_no, openid, sign });
    if (!is_legal) return this.createByFailureMsg('签名校验失败');
    const order = await this.Order.findOne({
      where: {
        no: out_trade_no,
      },
      attributes: [
        'id',
        'status',
        'product_id',
      ],
    });
    if (order.status !== 0) return this.createByFailureMsg('该订单状态异常');
    const trans = await this.model.transaction();
    this.ctx.trans = trans;
    // 更新订单信息
    await this.Order.update({
      openid,
      status: 1,
      pay_date: new Date(),
    }, {
      where: {
        id: order.id,
      },
      transaction: trans,
    });
    // 减少对应商品库存
    await this.Product.decrement('inventory', {
      where: {
        id: order.product_id,
      },
      transaction: trans,
    });
    await trans.commit();
    // 当商品销售量缓存存在时，让对应商品销售量+1
    const product_cache = await this.redis.hgetall('product:sale_num');
    if (Object.keys(product_cache).length !== 0) {
      await this.redis.hincrby('product:sale_num', order.product_id, 1);
    }
    return 'success';
  }
}

module.exports = MachineService;
