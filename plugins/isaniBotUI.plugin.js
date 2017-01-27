//META{"name":"isaniBotUI"}*//

const isaniBotUI = function() {};

isaniBotUI.prototype.getName = () => 'isani-bot UI';

isaniBotUI.prototype.getDescription = () => 'Extends default discord UI with isani-bot functionality';

isaniBotUI.prototype.getVersion = () => '0.9.0';

isaniBotUI.prototype.getAuthor = () => 'Namingray';

isaniBotUI.prototype.onMessage = () => {};

isaniBotUI.prototype.onSwitch = () => {};

isaniBotUI.prototype.getSettingsPanel = () => '';

isaniBotUI.prototype.load = function() {
  this.theme = $('[class^="theme-"]').attr('class');
  this.botName = 'isani-bot';
  this.username = $('.username').text();
  this.id = $('.account .avatar-small').css('background-image').split('/')[4];
  this.endpoint = 'http://iiss.me:8080/discord/events';
  this.request = require('request');
};

isaniBotUI.prototype.unload = () => {};

isaniBotUI.prototype.start = function() {
  debugger;
  this.addEventRegButtons();
  this.addEventRegPanel();
};

isaniBotUI.prototype.stop = function() {
  this.cleanRegButtons();
  this.cleanRegPanel();
};

isaniBotUI.prototype.checkBotPresence = function() {
  const self = this;
  const $bot = $('.member.member-status-online .member-username-inner').filter((index, user) => $(user).text() === self.botName);

  return !!$bot.length;
};

isaniBotUI.prototype.cleanRegButtons = function() {
  $('.bot-event-reg-button').remove();
  BdApi.clearCSS("eventRegButtonsCSS");
  $(document).off("click.bre");
};

isaniBotUI.prototype.cleanRegPanel = function() {
  $('.bot-event-reg-icon, .bot-event-reg-panel').remove();
  $('.bot-event-reg-panel').remove();
  BdApi.clearCSS("eventRegPanelCSS");
};

isaniBotUI.prototype.addEventRegButtons = function() {
  let loadingTime = 300;
  const self = this;

  self.cleanRegButtons();
  BdApi.injectCSS('eventRegButtonsCSS',
      '.button { position: absolute; right: 5px; top: 5px; z-index: 9999; color: #fff; border: 1px solid transparent;' +
                'display: inline-block; padding: 6px 12px;font-size: 14px; font-weight: 400; line-height: 1.42857;' +
                'width: 100px; text-align: center; white-space: nowrap; vertical-align: middle; touch-action: manipulation; ' +
                'cursor: pointer; -webkit-user-select: none; border-radius: 4px; background-image: none; }' +
      '.bot-event-reg-button { background-color: #f0ad4e; border-color: #eea236; }' +
      '.bot-event-reg-button:hover { background-color: #ec971f; border-color: #d58512; text-decoration: none; }' +
      '.bot-event-unreg-button { background-color: #5cb85c; border-color: #4cae4c; }' +
      '.bot-event-unreg-button:hover { background-color: #d9534f; border-color: #d43f3a; }');

  $(document).on('click.bre', event => {
    const $target = $(event.target);
    if ($target.eq(0).css('background-image') === 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNiIgaGVpZ2h0PSIyNiI+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGQ9Ik0xIDFoMjR2MjRIMSIvPgogICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTE1IDE1VjZoLTR2OWgtLjUwODk5NDgyQzEwLjIyNzg4MDQ4IDE1IDEwIDE1LjIyMzg1NzYgMTAgMTUuNWMwIC4yNjgwNjY0LjIxOTgzMDUuNS40OTEwMDUxOC41aDUuMDE3OTg5NjRDMTUuNzcyMTE5NTIgMTYgMTYgMTUuNzc2MTQyNCAxNiAxNS41YzAtLjI2ODA2NjQtLjIxOTgzMDUtLjUtLjQ5MTAwNTE4LS41SDE1em0yLTloMVY0SDh2MmgxdjhsLTIgMnYyaDUuMnY0aDEuNnYtNEgxOXYtMmwtMi0yVjZ6Ii8+CiAgPC9nPgo8L3N2Zz4=")') {
      setTimeout(() => {
        if (self.checkBotPresence()) {
          const $pinnedEvents = $('.popout .scroller .message-group').filter((index, event) => $(event).find('.body .user-name').text() === self.botName);

          $.each($pinnedEvents, (index, value) => {
            const $embedField = $(value).find('.comment .accessory .embed-field');
            const registeredUsers = $embedField.last().find('.embed-field-value').text().split(', ');
            const eventID = $(value).find('.embed-title').text().split(' ').pop();
            const $buttonReg = $('<button type="button" class="button bot-event-reg-button"></button>');
            const $buttonUnreg = $('<button type="button" class="button bot-event-unreg-button"></button>');

            $buttonReg
                .text('Подписаться')
                .click(() => {
                  self.request({
                    uri: self.endpoint,
                    method: 'PUT',
                    json: {
                      "action": "join",
                      "event_id": eventID,
                      "user": {
                        "nickname": self.username,
                        "usr_id": self.id
                      }
                    }
                  }, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                      if (body.status) {
                        $buttonUnreg.show();
                        $buttonReg.hide();
                      }
                    }
                  });
                });

            $buttonUnreg
                .text('Подписан')
                .mouseover(() => {
                  $buttonUnreg.text('Отписаться');
                })
                .mouseleave(() => {
                  $buttonUnreg.text('Подписан');
                })
                .click(() => {
                  self.request({
                    uri: self.endpoint,
                    method: 'PUT',
                    json: {
                      "action": "part",
                      "event_id": eventID,
                      "user": {
                        "nickname": self.username,
                        "usr_id": self.id
                      }
                    }
                  }, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                      if (body.status) {
                        $buttonReg.show();
                        $buttonUnreg.hide();
                      }
                    }
                  });
                });

            $(value).find('.comment .accessory .embed-author').append($buttonReg).append($buttonUnreg);

            if ($.inArray(self.username, registeredUsers) === -1) {
              $buttonReg.show();
              $buttonUnreg.hide();
            }
            else {
              $buttonUnreg.show();
              $buttonReg.hide();
            }

            loadingTime = 50;
          });
        }
      }, loadingTime);
    }
  });
};

isaniBotUI.prototype.addEventRegPanel = function() {
  const self = this;

  self.cleanRegPanel();
  BdApi.injectCSS('eventRegpanelCSS',
      '.bot-event-reg-icon { margin-right: 8px;}' +
      '.bot-event-reg-icon span { background-image: url(data:image/png;base64,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); }' +
      '.bot-event-reg-panel {transform: translateX(-100%) translateY(0%) translateZ(0px); display : none }' +
      '.bot-event-reg-panel-content { width: 365px; height: 510px; }' +
      '.margin10 { margin-top: 10px; margin-bottom: 10px; }' +
      '.theme-dark { color: #fff }' +
      '.theme-light { color: #4f545c! }' +
      '.bot-create-event-button { float:right; z-index: 9999; color: #fff; border: 1px solid transparent;' +
                                 'display: inline-block; padding: 6px 12px;font-size: 14px; font-weight: 400; line-height: 1.42857;' +
                                 'text-align: center; white-space: nowrap; vertical-align: middle; touch-action: manipulation; ' +
                                 'cursor: pointer; -webkit-user-select: none; border-radius: 4px; background-image: none;' +
                                 'background-color: #337ab7; border-color: #2e6da4; }' +
      '.bot-create-event-button:hover { background-color: #286090; border-color: #204d74; text-decoration: none; }');

  const _addEventRegPanel = function() {
    setTimeout(() => {
      const $guild = $('.guild.selected');

      if ($guild.length && self.checkBotPresence()) {
        if (!$('.bot-event-reg-icon').length) {
          const $button = $('<button type="button" class="bot-event-reg-icon"><span></span></button>');

          $button.click(() => {
            const $panel = $('.bot-event-reg-panel');

            // TODO Fix bug with closing (huy poimi pochemu)
            if ($('.bot-event-reg-panel').css('display') === 'none') {
              $panel.show();
            }
            else {
              $panel.hide();
            }
          });
          $('.header-toolbar').prepend($button);

          const $panel = $('<div class="bot-event-reg-panel popout popout-bottom-right no-arrow no-shadow">' +
                            '<div class="messages-popout-wrap themed-popout bot-event-reg-panel-content">' +
                              '<div class="header">' +
                                '<div class="title">Создать событие</div>' +
                              '</div>' +
                              '<div class="scroller-wrap dark">' +
                                '<div class="scroller messages-popout">' +
                                  '<div class="' + self.theme + '">Имя события (максимум 20 символов):</div>' +
                                  '<form>' +
                                    '<div class="channel-textarea margin10">' +
                                      '<div class="channel-textarea-inner">' +
                                        '<textarea class="textarea-title" rows="1" placeholder="Имя события..." style="height: auto; overflow: hidden;"></textarea>' +
                                      '</div>' +
                                    '</div>' +
                                  '</form>' +
                                  '<div class="' + self.theme + '">Время события (максимум 20 символов):</div>' +
                                  '<form>' +
                                    '<div class="channel-textarea margin10">' +
                                      '<div class="channel-textarea-inner">' +
                                        '<textarea class="textarea-time" rows="1" placeholder="Время события..." style="height: auto; overflow: hidden;"></textarea>' +
                                      '</div>' +
                                    '</div>' +
                                  '</form>' +
                                  '<div class="' + self.theme + '">Кол-во участников (максимум 20):</div>' +
                                  '<form>' +
                                    '<div class="channel-textarea margin10">' +
                                      '<div class="channel-textarea-inner">' +
                                        '<textarea class="textarea-amount" rows="1" placeholder="Колв-во участников..." style="height: auto; overflow: hidden;"></textarea>' +
                                      '</div>' +
                                    '</div>' +
                                  '</form>' +
                                  '<div class="' + self.theme + '">Описание события (максимум 200 символов):</div>' +
                                  '<form>' +
                                    '<div class="channel-textarea margin10">' +
                                      '<div class="channel-textarea-inner">' +
                                        '<textarea class="textarea-desc" rows="1" placeholder="Описание события..." style="height: auto; overflow: hidden;"></textarea>' +
                                      '</div>' +
                                    '</div>' +
                                  '</form>' +
                                  '<div class="' + self.theme + '">URL картинки (jpeg/png):</div>' +
                                  '<form>' +
                                    '<div class="channel-textarea margin10">' +
                                      '<div class="channel-textarea-inner">' +
                                        '<textarea class="textarea-image" rows="1" placeholder="URL картинки..." style="height: auto; overflow: hidden;"></textarea>' +
                                      '</div>' +
                                    '</div>' +
                                  '</form>' +
                                  '<span class="server-response" style="color: red"></span>' +
                                  '<button type="button" class="bot-create-event-button">Создать событие</button>' +
                                '</div>' +
                              '</div>' +
                            '</div>' +
                          '</div>');

          $panel.css({
            'top': '43px',
            'left': ($('body').width() - 238) + 'px'
          });
          $('#app-mount').children().children().eq(4).append($panel);

          $(document).mouseup((event) => {
            const $panel = $('.bot-event-reg-panel');

            if (!$panel.is(event.target) && !$panel.has(event.target).length) {
              $panel.hide();
            }
          });

          $('.bot-create-event-button').click(() => {
            // TODO add checks
            self.request({
              uri: self.endpoint,
              method: 'POST',
              json: {
                "guild_id": $guild.find('a').css('background-image').split('/')[4],
                "event_name": $(".textarea-title").val(),
                "at": $(".textarea-time").val(),
                "part": parseInt($(".textarea-amount").val()),
                "desc": $(".textarea-desc").val(),
                "img_url": $(".textarea-image").val(),
                "user": {
                  "nickname": self.username,
                  "usr_id": self.id
                }
              }
            }, (error, response, body) => {
              if(!error && response.statusCode === 200) {
                if (body.status) {
                  $(".server-response").text(body.message);
                }
              }
              else {
                $(".server-response").text(body);
              }
            });
          });
        }
      }
      else {
        self.cleanRegPanel();
      }
    }, 100);
  };

  $('.scroller.guilds').find('.guild').click(() => {
    _addEventRegPanel();
  });

  _addEventRegPanel();
};