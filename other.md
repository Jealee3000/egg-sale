## 数据库表

1. 管理员表（admin）

字段|类型|备注
---|---|---|
id|int|主键
username|varchar|用户名
password|varchar|密码
nickname|varchar|昵称
telphone|varchar|手机号
salt|varchar|盐
is_root|int|是否超级管理员 1为是 0为否 默认为0
status|int|状态 0禁用 1为正常 默认为1

2. 商品表 (product)

字段|类型|备注
---|---|---|
id|int|主键
name|varchar|商品名
price|int|价格，单位分
inventory|int|库存
status|int|状态 1上架 0下架
describe|varchar|描述


3. 订单表 （order）

字段|类型|备注
---|---|---|
id|int|主键
order_no|varchar|订单号
product_id|int|商品id
transaction_id|varchar|支付号
openid|varchar|用户的唯一标识
real_payment|int|实付款
pay_way|int|支付方式 1微信2支付宝3现金 默认为1
status|int|支付状态 0未支付1已支付
pay_date|datetime|支付时间

## 接口

### 销售机端（用户端）
1. 查看商品列表 /api/v1/machine/product_list
2. 查看商品详情 /api/v1/machine/product_detail
3. 选择商品下单 /api/v1/machine/place_order
4. 支付（回调）/api/v1/machine/pay_notify

### 管理端
1. 登录 /api/v1/admin/login
2. 查看商品列表 /api/v1/admin/product_list
3. 查看商品详情 /api/v1/admin/product_detail
4. 添加商品 /api/v1/admin/add_product
5. 编辑商品 /api/v1/admin/edit_product
6. 上下架商品 /api/v1/admin/put_product
7. 查看销售数据 /api/v1/admin/sale_data

#### 超级管理员特有
8. 查看管理员列表 /api/v1/admin/admin_list
9. 查看管理员详情 /api/v1/admin/admin_detail
10. 增加管理员 /api/v1/admin/add_admin
11. 删除管理员（禁用）/api/v1/admin/ban_admin
12. 编辑管理员 /api/v1/admin/edit_admin

# 接口文档
以下 api 路径均以 /api/v1 为前缀

## 销售机端
1. post /machine/product_list 查看商品列表

- page `Number` 页数，默认为 1
- limit `Number` 每一页的商品数量，默认为 10

返回值示例
```
{
    "status": 100,
    "msg": null,
    "data": {
        "count": 9,
        "rows": [
            {
                "id": 9,
                "no": "9944fdc0-2396-413e-8eea-b58fc82f58f4",
                "name": "test1552008776595",
                "price": 200,
                "inventory": 19,
                "status": 1
            }
        ]
    }
}
```

2. post /machine/product_detail 查看商品详情

- product_id `Number` 商品id

返回值示例
```
{
    "status": 100,
    "msg": null,
    "data": {
        "id": 9,
        "no": "9944fdc0-2396-413e-8eea-b58fc82f58f4",
        "name": "test1552008776595",
        "price": 200,
        "inventory": 19,
        "status": 1,
        "describe": "test describe 02"
    }
}
```

3. post /machine/place_order 选择商品下单

- product_id `Number` 商品id
- pay_way `Number` 支付方式 1微信2支付宝3现金 默认为1

返回值示例
```
{
    "status": 100,
    "msg": null,
    "data": {
        "no": "7c74285e-a65b-4c8a-9ad1-630022f6de6c",
        "order_name": "test1552008776595",
        "url_code": "xxx"
    }
}
```

4. post /machine/pay_notify 模拟支付成功回调

- out_trade_no 商户系统内部订单号
- openid 用户的唯一标识
- sign 签名

返回值示例
```
{
    "status": 100,
    "msg": null,
    "data": "success"
}
```

## 管理端 
以下 api 除登录接口均有登录校验，需要在 `Headers` 添加  `authentication：xxx` (登录获取的 token)
1. post /admin/login 管理员登录

- username `String` 登录名
- password `String` 密码(md5加密)

返回值示例
```
{
    "status": 100,
    "msg": null,
    "data": {
        "id": 1,
        "username": "admin",
        "nickname": "admin",
        "telphone": "110",
        "is_root": 1,
        "status": 1,
        "token": "4a5abd9d-35ff-4c50-a5a3-c6dbc08a590e"
    }
}
```

2. post /admin/product_list 查看商品列表

- page `Number` 页数，默认为 1
- limit `Number` 每一页的商品数量，默认为 10

返回值示例
```
{
    "status": 100,
    "msg": null,
    "data": {
        "count": 9,
        "rows": [
            {
                "id": 9,
                "no": "9944fdc0-2396-413e-8eea-b58fc82f58f4",
                "name": "test1552008776595",
                "price": 200,
                "inventory": 18,
                "status": 1
            }
        ]
    }
}
```

3. post /admin/product_detail 查看商品详情

- product_id `Number` 商品id

返回值示例
```
{
    "status": 100,
    "msg": null,
    "data": {
        "id": 9,
        "no": "9944fdc0-2396-413e-8eea-b58fc82f58f4",
        "name": "test1552008776595",
        "price": 200,
        "inventory": 18,
        "status": 1,
        "describe": "test describe 02"
    }
}
```

4. post /admin/add_product 添加商品

- product_name `String` 商品名
- product_no `String` 商品号
- product_price `Number` 商品价格
- inventory `Number` 库存
- describe `String` 商品描述

5. post /admin/edit_product 编辑商品

- product_id `Number` 商品id
- product_name `String` 商品名
- product_price `Number` 商品价格
- inventory `Number` 库存
- describe `String` 商品描述

6. post /admin/put_product 上下架商品 

- product_id `Number` 商品id

7. post /admin/sale_data 查看销售数据

返回值示例
```
{
    "status": 100,
    "msg": null,
    "data": {
        "count": 9,
        "rows": [
            {
                "id": 9,
                "name": "test1552008776595",
                "today_sale_num": 2
            },
            {
                "id": 8,
                "name": "test1552008606879",
                "today_sale_num": 1
            }
        ]
    }
}
```

以下接口需要超级管理员权限

8. post /admin/admin_list 查看管理员列表

- page `Number` 页数，默认为 1
- limit `Number` 每一页的商品数量，默认为 10

返回值示例
```
{
    "status": 100,
    "msg": null,
    "data": {
        "count": 1,
        "rows": [
            {
                "id": 1,
                "username": "admin",
                "nickname": "admin",
                "telphone": "110",
                "is_root": 1,
                "status": 1
            }
        ]
    }
}
```

9. post /admin/admin_detail 查看管理员详情

- admin_id `Number` 管理员id

返回值示例
```
{
    "status": 100,
    "msg": null,
    "data": {
        "id": 1,
        "username": "admin",
        "nickname": "admin",
        "telphone": "110",
        "is_root": 1,
        "status": 1
    }
}
```

10. post /admin/add_admin 增加管理员

- username `String` 用户名（登录名）
- password `String` 密码(md5加密)
- nickname `String` 昵称，可传，默认为用户名
- telphone `String` 手机号，可传

11. post /admin/ban_admin 禁用管理员

- admin_id `Number` 管理员id

12. post /api/v1/admin/edit_admin 编辑管理员

- admin_id `Number` 管理员id
- password `String` 密码(md5加密)
- nickname `String` 昵称，可传，默认为用户名
- telphone `String` 手机号，可传
