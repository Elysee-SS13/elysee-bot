
const fs = require("fs");

var config = require(appRoot + '/config.json');

// Static class used to
class ConfigManager {

  constructor() {}

  static reloadConfig() {
    config = require(appRoot + '/config.json');
  }

  static editKey(key, newValue) {
    if (config[key] == null) return false;

    config[key] = newValue;

    fs.writeFile(appRoot + '/config.json', JSON.stringify(config, null, 2), function writeJSON(err) {
      if (err) return Logger.error(err);
      Logger.debug(JSON.stringify(config), null, 2);

      ConfigManager.reloadConfig();
    });

    return true;
  }

  static getConfig() {
    return config;
  }

}

module.exports = {ConfigManager: ConfigManager}
