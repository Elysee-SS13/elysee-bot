// Static class used to log errors and handle them

function sendError(string, message=null) {
  Logger.error(string);

  if (message) message.channel.send("Erreur : " + string);
}

class ErrorHandler {
  static invalidArgs(usage=null, message=null) {
    const str = 'Arguments invalides. ' + (usage ? "Usage : " + usage : "");
    sendError(str, message);
  }

  static tooManyArgs(usage=null, message=null) {
    const str = "Trop d'arguments. " + (usage ? "Usage : " + usage : "");
    sendError(str, message);
  }

  static notEnoughArgs(usage=null, message=null) {
    const str = "Pas assez d'arguments. " + (usage ? "Usage : " + usage : "");
    sendError(str, message);
  }

  static wrongArgsNb(usage=null, message=null) {
    const str = "Mauvais nombre d'arguments. " + (usage ? "Usage : " + usage : "");
    sendError(str, message);
  }

  static custom(string, message=null) {
    sendError(string, message);
  }
}

module.exports = {ErrorHandler: ErrorHandler}
