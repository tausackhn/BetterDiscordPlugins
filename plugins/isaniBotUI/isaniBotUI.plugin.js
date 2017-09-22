//META{"name":"isaniBotUI"}*//

const vm = require('vm');
const async = require('async')
const request = require('request');

const srcEndpoint = 'http://iiss.me/discord/plugin/plugins/isaniBotUI/src/data/endpoints.json'
const isaniBotUI = function() {};

isaniBotUI.prototype.getName = () => 'isani-bot UI';

const get_source = function(url, callback) {
  request({ url }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      callback(null, vm.runInThisContext(body));
    }
  });
};

request({ url: srcEndpoint, json: true }, (error, response, body) => {
  if (!error && response.statusCode === 200) {
    async.map(body, get_source, (error, results) => {
      if (error === null && results.length > 0) {
        const methods = results[0];

        isaniBotUI.prototype.getDescription = () => methods.getDescription();

        isaniBotUI.prototype.getVersion = () => methods.getVersion();

        isaniBotUI.prototype.getAuthor = () => methods.getAuthor();

        isaniBotUI.prototype.onMessage = () => methods.onMessage();

        isaniBotUI.prototype.onSwitch = () => methods.onSwitch();

        isaniBotUI.prototype.load = () => methods.load();

        isaniBotUI.prototype.unload = () => methods.unload();

        isaniBotUI.prototype.start = () => methods.start();

        isaniBotUI.prototype.stop = () => methods.stop();
      }
    });
  }
})