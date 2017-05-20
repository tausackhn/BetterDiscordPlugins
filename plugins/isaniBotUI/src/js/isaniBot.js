'use strict';
class IsaniBot {

  constructor(id) {
    this._theme = $('[class^="theme-"]').attr('class');
    this._botID = id;
    this._username = $('.account-details .username').text();
    this._usernameID = $('.account .avatar-small').css('background-image').split('/')[4];
    this._endpoints = {
      'events': 'http://iiss.me:8080/discord/events',
      'channels': 'http://iiss.me:8080/discord/channels'
    };
    this._loadingTime = 500;
    this._channels = null;
    this._updateInterval = 120 * 1000;
    this._interval = null;
  }

  checkBotPresence() {
    let exist = false;
    const $selected = $('.guild-channels .channel.selected');
    if ($selected.length && this._channels) {
      const uri = $selected.children('a').attr('href');
      const match = uri.match(/\/channels\/(\d+)\/(\d+)/);
      if (match[1] in this._channels) {
        this._channels[match[1]].forEach(element => {
          if (element['_id'] == match[2]) {
            exist = true;
          }
        });
      }
    }
    return exist;
  }

  static cleanRegButtons() {
    $('.bot-event-reg-button').remove();
    BdApi.clearCSS("eventRegButtonsCSS");
    $(document).off("click.erb");
  }

  static cleanRegPanel() {
    $('.bot-event-reg-icon, .bot-event-reg-panel').remove();
    $('.bot-event-reg-panel').remove();
    BdApi.clearCSS("eventRegPanelCSS");
    $(document).off("click.erp");
  }

  addUpdateChannels() {
    const updateChannels = function () {
      request(this._endpoints.channels, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          this._channels = JSON.parse(body);
        } else {
          this._channels = null;
        }
      });
    };
    updateChannels();
    this._interval = setInterval(updateChannels, this._updateInterval);
  }
}