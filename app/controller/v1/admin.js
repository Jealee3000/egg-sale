/**
 * Created by huangjiali on 2019/3/6.
 */
'use strict';
const Controller = require('egg').Controller;

class adminController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.validate = ctx.validate;
    this.session = ctx.session;
    this.createBySuccessMsg = ctx.response.ServerResponse.createBySuccessMsg;
    this.createByFailureMsg = ctx.response.ServerResponse.createByFailureMsg;
    this.body = ctx.request.body;
    this.AdminService = ctx.service.admin;
    this.ProductService = ctx.service.product;
    this.LoginTransfer = {
      username: { type: 'string', required: true, min: 1, max: 64 },
      password: { type: 'string', required: true, min: 1, max: 128 },
    };
    this.adminListTransfer = {
      page: { type: 'int', required: false, min: 1, default: 1 },
      limit: { type: 'int', required: false, min: 1, max: 100, default: 10 },
    };
    this.adminDetailTransfer = {
      admin_id: { type: 'int', required: true, min: 1 },
    };
    this.addAdminTransfer = {
      username: { type: 'string', required: true, min: 1, max: 64 },
      password: { type: 'string', required: true, min: 1, max: 128 },
      nickname: { type: 'string', required: false, allowEmpty: true, max: 64 },
      telphone: { type: 'string', required: false, allowEmpty: true, max: 64 },
    };
    this.editAdminTransfer = {
      admin_id: { type: 'int', required: true, min: 1 },
      password: { type: 'string', required: false, min: 1, max: 128 },
      nickname: { type: 'string', required: false, allowEmpty: true, max: 64 },
      telphone: { type: 'string', required: false, allowEmpty: true, max: 64 },
    };
    this.banAdminTransfer = {
      admin_id: { type: 'int', required: true, min: 1 },
    };
    this.productListTransfer = {
      page: { type: 'int', required: false, min: 1, default: 1 },
      limit: { type: 'int', required: false, min: 1, max: 100, default: 10 },
    };
    this.productDetailTransfer = {
      product_id: { type: 'int', required: true, min: 1 },
    };
    this.addProductTransfer = {
      product_no: { type: 'string', required: true, min: 1, max: 128 },
      product_name: { type: 'string', required: true, min: 1, max: 128 },
      product_price: { type: 'int', required: true, min: 0 },
      inventory: { type: 'int', required: true, min: 0 },
      describe: { type: 'string', required: false, min: 0, max: 512 },
    };
    this.editProductTransfer = {
      product_id: { type: 'int', required: true, min: 1 },
      product_no: { type: 'string', required: true, min: 1, max: 128 },
      product_name: { type: 'string', required: true, min: 1, max: 128 },
      product_price: { type: 'int', required: true, min: 0 },
      inventory: { type: 'int', required: true, min: 0 },
      describe: { type: 'string', required: false, min: 0, max: 512 },
    };
    this.putProductTransfer = {
      product_id: { type: 'int', required: true, min: 1 },
    };
    this.saleDataTransfer = {
      page: { type: 'int', required: false, min: 1, default: 1 },
      limit: { type: 'int', required: false, min: 1, max: 100, default: 10 },
    };
  }
  async login() {
    const { ctx } = this;
    ctx.validate(this.LoginTransfer);
    const response = await this.AdminService.login(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async adminList() {
    const { ctx } = this;
    ctx.validate(this.adminListTransfer);
    const response = await this.AdminService.adminList(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async adminDetail() {
    const { ctx } = this;
    ctx.validate(this.adminDetailTransfer);
    const response = await this.AdminService.adminDetail(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async addAdmin() {
    const { ctx } = this;
    ctx.validate(this.addAdminTransfer);
    const response = await this.AdminService.addAdmin(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async editAdmin() {
    const { ctx } = this;
    ctx.validate(this.editAdminTransfer);
    const response = await this.AdminService.editAdmin(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async banAdmin() {
    const { ctx } = this;
    ctx.validate(this.banAdminTransfer);
    const response = await this.AdminService.banAdmin(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async productList() {
    const { ctx } = this;
    ctx.validate(this.productListTransfer);
    const response = await this.ProductService.productList(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async productDetail() {
    const { ctx } = this;
    ctx.validate(this.productDetailTransfer);
    const response = await this.ProductService.productDetail(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async addProduct() {
    const { ctx } = this;
    ctx.validate(this.addProductTransfer);
    const response = await this.ProductService.addProduct(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async editProduct() {
    const { ctx } = this;
    ctx.validate(this.editProductTransfer);
    const response = await this.ProductService.editProduct(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async putProduct() {
    const { ctx } = this;
    ctx.validate(this.productListTransfer);
    const response = await this.ProductService.putProduct(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
  async saleData() {
    const { ctx } = this;
    ctx.validate(this.saleDataTransfer);
    const response = await this.AdminService.saleData(this.body);
    this.ctx.body = this.createBySuccessMsg(response);
  }
}

module.exports = adminController;

