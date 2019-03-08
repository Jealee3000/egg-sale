/**
 * Created by huangjiali on 2019/3/7.
 */
'use strict';
const Service = require('egg').Service;

class ProductService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.redis = ctx.app.redis;
    this.createByFailureMsg = ctx.response.ServerResponse.createByFailureMsg;
    this.Product = ctx.model.Product;
  }

  async productList(body) {
    const { page, limit } = body;
    const offset = (page - 1) * limit;
    const obj = {};
    if (!this.session.id) obj.status = 1;
    const productList = await this.Product.findAndCountAll({
      where: obj,
      attributes: [
        'id',
        'no',
        'name',
        'price',
        'inventory',
        'status',
      ],
      order: [[ 'created_at', 'desc' ]],
      offset,
      limit,
    });
    return productList;
  }

  async productDetail(body) {
    const { product_id } = body;
    const product = await this.Product.findOne({
      where: { id: product_id },
      attributes: [
        'id',
        'no',
        'name',
        'price',
        'inventory',
        'status',
        'describe',
      ],
    });
    if (!product) return this.createByFailureMsg('该商品不存在');
    return product;
  }

  async addProduct(body) {
    const { product_no, product_name, product_price, inventory, describe } = body;
    const product = await this.Product.findOne({
      where: {
        no: product_no,
      },
      attributes: [
        'id',
      ],
    });
    if (product) return this.createByFailureMsg('该编号的商品已存在');
    const obj = {
      no: product_no,
      name: product_name,
      price: product_price,
      inventory,
    };
    if (describe) obj.describe = describe;
    const data = await this.Product.create(obj);
    return {
      product_id: data.id,
    };
  }

  async editProduct(body) {
    const { product_id, product_no, product_name, product_price, inventory, describe } = body;
    const product = await this.Product.findOne({
      where: {
        id: product_id,
      },
      attributes: [
        'id',
        'no',
      ],
    });
    if (!product) return this.createByFailureMsg('该商品不存在');
    const obj = {};
    if (product_no && product_no !== product.no) {
      const is_exist = await this.Product.findOne({
        where: {
          no: product_no,
        },
        attributes: [
          'id',
        ],
      });
      if (is_exist) return this.createByFailureMsg('该编号的商品已存在');
      obj.no = product_no;
    }
    if (product_name) obj.name = product_name;
    if (product_price) obj.price = product_price;
    if (inventory) obj.inventory = inventory;
    if (describe) obj.describe = describe;
    await this.Product.update(
      obj, {
        where: {
          id: product_id,
        },
      });
    return {};
  }

  async putProduct(body) {
    const { product_id } = body;
    const product = await this.Product.findOne({
      where: {
        id: product_id,
      },
      attributes: [
        'id',
        'status',
      ],
    });
    if (!product) return this.createByFailureMsg('该商品不存在');
    await this.Product.update({
      status: +!product.status,
    }, {
      where: {
        id: product_id,
      },
    });
    return {};
  }
}

module.exports = ProductService;
