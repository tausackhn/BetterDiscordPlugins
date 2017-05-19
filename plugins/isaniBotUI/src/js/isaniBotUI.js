const isaniBot = null;

const getName = () => 'isani-bot UI';

const getDescription = () => 'Extends default discord UI with isani-bot functionality';

const getVersion = () => '0.9.0';

const getAuthor = () => {
  debugger;
  const $style = $('[class^="theme-"]').attr('class');
  const $username = $('.account-details .username').text();
  const $id = $('.account .avatar-small').css('background-image').split('/')[4];
  return 'Namingray';
}

const onMessage = () => {};

const onSwitch = () => {}

const getSettingsPanel = () => '';

const load = () => {

};

const unload = () => {};

const start = () => {
  this.addEventRegButtons();
  this.addEventRegPanel();
  this.addUpdateChannels();
};

const stop = () => {};

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