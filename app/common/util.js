const crypto = require('crypto');
const obj = {
  // 生成加盐后的md5密码
  cryptPwd(password, salt) {
    const saltPassword = password + ':' + salt;
    // 加盐密码的md5值
    const md5 = crypto.createHash('md5');
    const result = md5.update(saltPassword).digest('hex');
    return result;
  },
  // 生成3位随机盐
  getRandomSalt() {
    return Math.random().toString().slice(2, 5);
  },
  // 模拟生成支付信息
  simulatePayInfo(obj) {
    console.log(obj);
    return {
      return_code: 'SUCCESS',
      return_msg: {
        transaction_id: `test${(new Date()).getTime()}`,
        code_url: 'xxx',
      },
    };
  },
  // 模拟支付签名校验
  simulatePaySignVerify(obj) {
    console.log(obj);
    return true;
  },
};

module.exports = obj;
