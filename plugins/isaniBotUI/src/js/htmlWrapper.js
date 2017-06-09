class htmlWrapper {
  constructor() {

    this._html = {};
    this._htmlEndpoints = [
      'https://raw.githubusercontent.com/Namingray/BetterDiscordPlugins/test/plugins/isaniBotUI/src/html/newEventPanel.html'
    ];

    this._cssEndpoints.forEach(endpoint => {
      request({ url: endpoint }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          this._html[endpoint.match(/([^/]+)(?=\.\w+$)/)[0]] = body;
        }
      });
    })
  }

  getHTML(name) {
    return this._html[name];
  }
}