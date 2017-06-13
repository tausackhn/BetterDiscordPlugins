class BaseWrapper {
  constructor() {

    this._content = {};
    this._isReady = $.Deferred();
    this._endpoints = [];
  }

  _downloadContent() {
    let counter = this._endpoints.length;
    this._endpoints.forEach(endpoint => {
      setTimeout(() => {
        request({ url: endpoint }, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            this._content[endpoint.match(/([^/]+)(?=\.\w+$)/)[0]] = body.replace(/(\r\n|\n|\r)/gm,"");
          }
          counter -= 1;
          if (counter === 0) {
            this._isReady.resolve();
          }
        });
      }, 1);
    })
  }

  getContent(name) {
    return this._content[name];
  }

  isReady() {
    return this._isReady;
  }
}