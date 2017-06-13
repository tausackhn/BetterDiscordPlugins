class CssWrapper extends BaseWrapper {
  constructor() {

    super();
    this._endpoints = [
      'https://raw.githubusercontent.com/Namingray/BetterDiscordPlugins/test/plugins/isaniBotUI/src/css/isaniBotUI.css'
    ];

    this._downloadContent();
  }
}