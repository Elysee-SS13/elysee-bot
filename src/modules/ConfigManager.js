
const fs = require("fs");
const { Logger } = require("./Logger");

var config = require(appRoot + '/config.json');

// Static class used to
class ConfigManager {

  constructor() {}

  static reloadConfig() {
    config = require(appDir + '/config.json');
  }

  static editKey(key, newValue) {
    if (config[key] == null) return false;

    config[key] = newValue;

    fs.writeFile(appRoot + '/config.json', JSON.stringify(config), function writeJSON(err) {
      if (err) return Logger.error(err);
      Logger.debug(JSON.stringify(config));

      reloadConfig();
    });

    return true;
  }

  static getConfig() {
    return config;
  }

}

module.exports = {ConfigManager: ConfigManager}
