/**
 * 通用结果集
 */
class R {
  constructor(code, data, msg = 'success') {
    this.code = code;
    this.data = data;
    this.msg = msg;
  }

  static success(data = '', msg= null) {
    return new R(200, data, msg);
  }

  static fail(data, msg = '') {
    return new R(500, data, msg);
  }
}

module.exports = R;
