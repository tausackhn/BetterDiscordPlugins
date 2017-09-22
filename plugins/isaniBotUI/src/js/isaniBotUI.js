//const IsaniBot = require('IsaniBot');
let isaniBot = null;

const getName = () => 'isani-bot UI';

const getDescription = () => 'Extends default discord UI with isani-bot functionality';

const getVersion = () => '0.9.0';

const getAuthor = () => 'Namingray';

const onMessage = () => {};

const onSwitch = () => {}

const getSettingsPanel = () => '';

const load = () => {
  isaniBot = new IsaniBot('215243788162039809');
};

const unload = () => {};

const start = () => {
  $.when(isaniBot.isReady()).then(() => {
    isaniBot.addEventRegButtons();
    isaniBot.addEventRegPanel();
  });
};

const stop = () => {
  isaniBot.destroy();
};

module.exports = {
  getName,
  getDescription,
  getVersion,
  getAuthor,
  onMessage,
  onSwitch,
  getSettingsPanel,
  load,
  unload,
  start,
  stop
}