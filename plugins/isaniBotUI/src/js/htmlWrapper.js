class HtmlWrapper extends BaseWrapper {
  constructor() {

    super();
    this._endpoints = [
      'https://raw.githubusercontent.com/Namingray/BetterDiscordPlugins/test/plugins/isaniBotUI/src/html/newEventPanel.html'
    ];

    this._downloadContent()
  }
}

