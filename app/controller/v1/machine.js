/**
 * Created by huangjiali on 2019/3/7.
 */
const Controller = require('egg').Controller;

class machineController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.validate = ctx.validate;
    this.session = ctx.session;
    this.createBySuccessMsg = ctx.response.ServerResponse.createBySuccessMsg;
    this.createByFailureMsg = ctx.response.ServerResponse.createByFailureMsg;
    this.body = ctx.request.body;
    this.productService = ctx.service.product;
    this.machineService = ctx.service.machine;
    this.productListTransfer = {
      page: { type: 'int', required: false, min: 1, default: 1 },
      limit: { type: 'int', required: false, min: 1, max: 10, default: 10 },
    };
    this.productDetailTransfer = {
      product_id: { type: 'int', required: true, min: 1 },
    };
    this.placeOrderTransfer = {
      product_id: { type: 'int', required: true, min: 1 },
      pay_way: [ 1, 2, 3 ],
    };
    this.payNotifyTransfer = {
      out_trade_no: { type: 'string', required: true, min: 1, max: 128 },
      openid: { type: 'string', required: true, min: 1, max: 64 },
      sign: { type: 'string', required: true, min: 1, max: 128 },
    };
  }
  async productList() {
    const { ctx } = this;
    ctx.validate(this.productListTransfer);
    const response = await this.productService.productList(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async productDetail() {
    const { ctx } = this;
    ctx.validate(this.productDetailTransfer);
    const response = await this.productService.productDetail(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async placeOrder() {
    const { ctx } = this;
    ctx.validate(this.placeOrderTransfer);
    const response = await this.machineService.placeOrder(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async payNotify() {
    const { ctx } = this;
    ctx.validate(this.payNotifyTransfer);
    const response = await this.machineService.payNotify(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }

}

module.exports = machineController;

