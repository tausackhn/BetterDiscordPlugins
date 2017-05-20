class cssWrapper {
  constructor() {

    this._css = {};
    this._cssEndpoints = [
      'https://raw.githubusercontent.com/Namingray/BetterDiscordPlugins/test/plugins/isaniBotUI/src/css/isaniBotUI.css'
    ];

    this._cssEndpoints.forEach(endpoint => {
      request({ url: endpoint }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          this._css[endpoint.match(/([^/]+)(?=\.\w+$)/)[0]] = body;
        }
      });
    })
  }

  getCSS(name) {
    return this._css[name];
  }
}