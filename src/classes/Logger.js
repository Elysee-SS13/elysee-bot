const colors = require("colors");

const prefixes = {
  "warning": "[WARN]",
  "error": "[ERR]",
  "info": "[INFO]",
  "debug": "[DEBUG]",
  "success": "[SUCCESS]"
};

// Static class used to log stuff to the console in a pretty way
class Logger {

  constructor() {}

  // Log as a warning
  static warning(string) {
    console.log(prefixes.warning.yellow + " " + string);
  }

  // Log as error
  static error(string) {
    console.log((prefixes.error.brightRed + " " + string));
  }

  static info(string) {
    console.log(prefixes.info + " " + string);
  }

  static debug(string) {
    console.log(prefixes.debug.cyan + " " + string);
  }

  static success(string) {
    console.log(prefixes.success.brightGreen + " " + string)
  }

}

module.exports = {Logger: Logger}
