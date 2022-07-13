class R {
  constructor(code, data, msg = 'success') {
    this.code = code
    this.data = data
    this.msg = msg
  }

  static success (data = '') {
    return new R(200, data)
  }

  static fail (msg = '') {
    return new R(500, msg)
  }
}

module.exports = R