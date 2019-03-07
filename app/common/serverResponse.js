/**
 * Created by huangjiali on 2019/3/6.
 */
module.exports = class ServerResponse {
  constructor(status, msg, data) {
    this.status = status;
    this.msg = msg;
    this.data = data;
  }

  static createBySuccessMsg(data) {
    if (data && data.status && data.status === 200) {
      return new ServerResponse(200, data.msg, null);
    }
    return new ServerResponse(100, null, data);
  }

  static createByFailureMsg(errorMsg) {
    return new ServerResponse(200, errorMsg, null);
  }

};

