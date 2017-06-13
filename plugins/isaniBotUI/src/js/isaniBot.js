class IsaniBot {

  constructor(id) {
    try {
      this._theme = $('[class^="theme-"]').attr('class');
      this._botID = id;
      this._username = $('[class^="accountDetails-"]').find('.username').text();
      this._usernameID = $('[class^="accountDetails-"]').parent().find('.avatar-small').css('background-image').split('/')[4];
      this._loadingTime = 500;
      this._guilds = null;
      this._selectedGuild = null;
      this._updateInterval = 120 * 1000;
      this._interval = null;
      this._html = new HtmlWrapper();
      this._css = new CssWrapper();
      this._isReady = $.Deferred();

      $.when(this._css.isReady(), this._html.isReady()).then(() => {
        this._injectCSS();
        this._addUpdateChannels();
      });

    }
    catch(error) {
      console.log('IsaniBot UI exception - ' + error);
    }
  }

  static getEndpoints() {
    return {
      'events': 'http://iiss.me:8080/discord/events',
      'guilds': 'http://iiss.me:8080/discord/channels'
    };
  }

  isReady() {
    return this._isReady;
  }

  destroy() {
    const $elements = $('.bot-event-reg-button, .bot-event-reg-icon, .bot-event-reg-panel, .bot-event-reg-panel');
    $elements.remove();

    $(document).off("click.erb");
    $(document).off("click.erp");
  }

  _injectCSS() {
    BdApi.injectCSS('isaniBotUI', this._css.getContent('isaniBotUI'));
  }

  _getSelectedChannel() {
    return $.grep(this._guilds[this._selectedGuild], channel => channel.channel === $('.channels-wrap').find('[class^="wrapperSelectedText"]').text() && channel.available === true);
  }

  checkBotPresence() {
    let exist = false;
    debugger;
    const $selectedGuild = $('.guilds-wrapper .guilds .guild.selected');
    if ($selectedGuild.length && this._guilds) {
      const uri = $selectedGuild.find('a').attr('href');
      const match = uri.match(/\/channels\/(\d+)\/(\d+)/);
      this._selectedGuild = match[1];
      if (this._selectedGuild in this._guilds) {
        //TODO find the way to handle channels with the same name
        console.log(this._getSelectedChannel())
        if (this._getSelectedChannel().length === 1) {
          exist = true;
        }
      }
    }
    return exist;
  }

  _addUpdateChannels() {
    const self = this;

    self._updateChannels = function() {
      request(IsaniBot.getEndpoints().guilds, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          self._guilds = JSON.parse(body);
        } else {
          self._guilds = null;
        }
        if (this._isReady && this._isReady.state() === 'pending') {
          this._isReady.resolve();
        }
      });
    };

    self._updateChannels();
    self._interval = setInterval(self._updateChannels, self._updateInterval);
  }

  addEventRegButtons() {
    try {
      $(document).on('click.erb', event => {
        const $target = $(event.target);
        if ($target.eq(0).css('background-image') === 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNiIgaGVpZ2h0PSIyNiI+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGQ9Ik0xIDFoMjR2MjRIMSIvPgogICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTE1IDE1VjZoLTR2OWgtLjUwODk5NDgyQzEwLjIyNzg4MDQ4IDE1IDEwIDE1LjIyMzg1NzYgMTAgMTUuNWMwIC4yNjgwNjY0LjIxOTgzMDUuNS40OTEwMDUxOC41aDUuMDE3OTg5NjRDMTUuNzcyMTE5NTIgMTYgMTYgMTUuNzc2MTQyNCAxNiAxNS41YzAtLjI2ODA2NjQtLjIxOTgzMDUtLjUtLjQ5MTAwNTE4LS41SDE1em0yLTloMVY0SDh2MmgxdjhsLTIgMnYyaDUuMnY0aDEuNnYtNEgxOXYtMmwtMi0yVjZ6Ii8+CiAgPC9nPgo8L3N2Zz4=")') {
          setTimeout(() => {
            if (this.checkBotPresence()) {
              const $pinnedEvents = $('.popout .scroller .message-group').filter((index, event) => $(event).find('.avatar-large').css('background-image').split('/')[4] === this._botID);

              $.each($pinnedEvents, (index, value) => {
                const $embedField = $(value).find('.comment .accessory .embed-field');
                const registeredUsers = $embedField.last().find('.embed-field-value').text().split(', ');
                const eventID = $(value).find('.embed-title').text().split(' ').pop();
                const $buttonReg = $('<button type="button" class="button bot-event-reg-button"></button>');
                const $buttonUnreg = $('<button type="button" class="button bot-event-unreg-button"></button>');

                const _handler = (requestAction, button1, button2) => () => {
                  button1.attr('disabled', 'disabled');
                  request({
                    uri: IsaniBot.getEndpoints().events,
                    method: 'PUT',
                    json: {
                      "action": requestAction,
                      "channel_id": this._getSelectedChannel()[0].channel_id.toString(),
                      "event_id": eventID,
                      "user": {
                        "nickname": this._username,
                        "usr_id": this._usernameID
                      }
                    }
                  }, (error, response, body) => {
                    button1.removeAttr('disabled');
                    if (!error && response.statusCode === 200) {
                      if (body.status) {
                        button2.show();
                        button1.hide();
                      }
                    }
                  });
                };

                $buttonReg
                    .text('Подписаться')
                    .click(_handler('join', $buttonReg, $buttonUnreg));

                $buttonUnreg
                    .text('Подписан')
                    .mouseover(() => {
                      $buttonUnreg.text('Отписаться');
                    })
                    .mouseleave(() => {
                      $buttonUnreg.text('Подписан');
                    })
                    .click(_handler('part', $buttonUnreg, $buttonReg));

                $(value).find('.comment .accessory .embed-author').append($buttonReg).append($buttonUnreg);

                if ($.inArray(this._username, registeredUsers) === -1) {
                  $buttonReg.show();
                  $buttonUnreg.hide();
                }
                else {
                  $buttonUnreg.show();
                  $buttonReg.hide();
                }

                this._loadingTime = 50;
              });
            }
          }, this._loadingTime);
        }
      });
    }
    catch(error) {
      console.log('IsaniBot UI exception - addEventRegButtons - ' + error);
    }
  }

  addEventRegPanel() {
    debugger;
    try {
      const $button = $('<button type="button" class="bot-event-reg-icon"><span></span></button>');

      const $panel = $(this._html.getContent('newEventPanel'));
      $panel.find('.discord-theme').addClass(this._theme);

      $('#app-mount').children().children().eq(5).append($panel);

      const _setIconState = () => {
        this._loadingTime = 500;
        if (this.checkBotPresence()) {
          $button.removeClass('disabled-image').removeAttr('disabled');
        }
        else {
          $button.addClass('disabled-image').attr('disabled', 'disabled');
        }
      };

      const _createButton = () => {
        $button.click(event => {

          const $panel = $('.bot-event-reg-panel');

          if ($('.bot-event-reg-panel').css('display') === 'none') {
            $panel.show();
            $panel.css({
              'top': '43px',
              'left': ($('body').width() - 238) + 'px'
            });
          }
          else {
            $panel.hide();
            $(".server-response").text('');
          }
          event.stopImmediatePropagation();
        });

        _setIconState();

        $('.header-toolbar').prepend($button);
      }

      _createButton();

      $('.scroller.guilds').find('.guild').click(() => {
        setTimeout(() => {
          if (!$('.bot-event-reg-icon').length) {
            _createButton();
          }
          $('.scroller.guild-channels').find('.channel-text').click(() => {
            setTimeout(() => {
              _setIconState();
            }, 100);
          });
          _setIconState();

          //TODO check other possible channel states
          $('[class^="containerDefault-"]').find('[class^="wrapperSelectedText-"], [class^="wrapperDefaultText-"], [class^="wrapperMutedText-"]').click(() => {
            setTimeout(() => {
              _setIconState();
            }, 100)
          });
        }, 100);
      });

      $(document).on('click.erp', event => {
        const $panel = $('.bot-event-reg-panel');
        const $icon = $('.bot-event-reg-icon span');

        if (!$panel.is(event.target) && !$panel.has(event.target).length && !$icon.is(event.target)) {
          $panel.hide();
          $(".server-response").text('');
        }
      });

      $('.bot-create-event-button').click(() => {
        const eventName = $(".textarea-title").val();
        const at = $(".textarea-time").val();
        const part = parseInt($(".textarea-amount").val());
        const desc = $(".textarea-desc").val();
        const imgURL = $(".textarea-image").val();

        try {
          if (eventName.length > 30) {
            throw "Имя события больше 30 символов!";
          }
          if (eventName.length < 2) {
            throw "Имя события меньше 2 символов!";
          }
          if (at && at.length > 30) {
            throw "Время события больше 30 символов!"
          }
          if (at && at.length < 2) {
            throw "Время события меньше 2 символов!"
          }
          if (isNaN(part)) {
            throw "Количество участников должно быть числом!"
          }
          if (part > 20) {
            throw "Количество участников больше 20!"
          }
          if (part < 1) {
            throw "Количество участников меньше 1!"
          }
          if (desc && desc.length > 300) {
            throw "Описание больше 300 символов!"
          }
          if (desc && desc.length < 2) {
            throw "Описание меньше 2 символов!"
          }
          if (imgURL && !/^http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+\.(?:jpg|jpeg|png|gif)$/.test(imgURL)) {
            throw "URL картинки не валидно!"
          }

          request({
            uri: IsaniBot.getEndpoints().events,
            method: 'POST',
            json: {
              "channel_id": this._getSelectedChannel()[0].channel_id.toString(),
              "event_name": eventName,
              "at": at,
              "part": part,
              "desc": desc,
              "img_url": imgURL,
              "user": {
                "nickname": this._username,
                "usr_id": this._usernameID
              }
            }
          }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
              if (body.status) {
                $('.bot-event-reg-panel').find('textarea').val('');
                $(".server-response").text('Событие успешно создано!');
              }
            }
            else {
              $(".server-response").text(body);
            }
          });
        }
        catch (error) {
          $(".server-response").text(error);
        }
      });
    }
    catch(error) {
      console.log('IsaniBot UI exception - addEventRegPanel - ' + error);
    }
  }
}