class cssWrapper {
  constructor() {

    this._css = {};
    this._isReady = $.Deferred();
    this._cssEndpoints = [
      'https://raw.githubusercontent.com/Namingray/BetterDiscordPlugins/test/plugins/isaniBotUI/src/css/isaniBotUI.css'
    ];

    let counter = this._cssEndpoints.length;
    this._cssEndpoints.forEach(endpoint => {
      setTimeout(() => {
        request({ url: endpoint }, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            this._css[endpoint.match(/([^/]+)(?=\.\w+$)/)[0]] = body.replace(/(\r\n|\n|\r)/gm,"");
          }
          counter -= 1;
          if (counter === 0) {
            this._isReady.resolve();
          }
        });
      }, 1);

    })
  }

  getCSS(name) {
    return this._css[name];
  }

  isReady() {
    return this._isReady;
  }
}