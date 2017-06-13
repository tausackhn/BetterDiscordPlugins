class htmlWrapper {
  constructor() {

    this._html = {};
    this._isReady = $.Deferred();
    this._htmlEndpoints = [
      'https://raw.githubusercontent.com/Namingray/BetterDiscordPlugins/test/plugins/isaniBotUI/src/html/newEventPanel.html'
    ];

    let counter = this._cssEndpoints.length;
    this._htmlEndpoints.forEach(endpoint => {
      setTimeout(() => {
        request({ url: endpoint }, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            this._html[endpoint.match(/([^/]+)(?=\.\w+$)/)[0]] = body.replace(/(\r\n|\n|\r)/gm,"");
          }
          counter -= 1;
          if (counter === 0) {
            this._isReady.resolve();
          }
        });
      }, 1);
    })
  }

  getHTML(name) {
    return this._html[name];
  }

  isReady() {
    return this._isReady;
  }
}

