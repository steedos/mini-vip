import wepy from 'wepy'

const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}
class Request {
  _header = {
    token: null
  }
  _baseUrl = null

  _appId = null

  interceptors = {
    request: null,
    response: null
  }

  constructor() {
    const token = wx.getStorageSync('token')
    if (token) {
      this._header.token = token
    }
  }

  request(params) {
    console.log(this._header)
    const { url, method, header, data } = this.interceptors.request ? this.interceptors.request(params) : params
    return wepy.request({
      url: (this._baseUrl || '') + url,
      method: method || METHOD.GET,
      data: data,
      header: {
        appId: this._appId,
        ...this._header,
        ...header
      }
    }).then(res => this.interceptors.response ? this.interceptors.response(res) : res)
  }

  get(url, data, header) {
    return this.request({ url, method: METHOD.GET, header, data })
  }
  post(url, data, header) {
    return this.request({ url, method: METHOD.POST, header, data })
  }
  put(url, data, header) {
    return this.request({ url, method: METHOD.PUT, header, data })
  }
  delete(url, data, header) {
    return this.request({ url, method: METHOD.DELETE, header, data })
  }

  token(token) {
    this._header.token = token
    return this
  }
  header(header) {
    this._header = header
    console.log("this._header", this._header)
    return this
  }
  baseUrl(baseUrl) {
    this._baseUrl = baseUrl
    return this
  }
  appId(appId) {
    this._appId = appId
    return this
  }
  interceptor(request, response) {
    if (typeof request === 'function') {
      this.interceptors.request = request
    }
    if (typeof request === 'function') {
      this.interceptors.response = response
    }
    return this
  }
}
export default new Request()
