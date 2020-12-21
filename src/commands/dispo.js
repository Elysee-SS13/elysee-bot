const { ConfigManager } = require(appRoot + '/src/modules/ConfigManager');

var availablePlayers = [];

module.exports = {
    name: 'dispo', // Command name (what's gonna be used to call the command)
    aliases: ['opt-in', 'optin', 'disponible'], // Command aliases

    execute(client, message, args) {
      if (args[1] === 'setrole') {
        if (!args[2]) return message.reply("Invalid, use : `dispo setrole @Role`");
        else setRole(args);
      } else if (args[1] === 'setchannel' || args[1] === 'setchan') {
        if (!args[2]) return message.reply("Invalid, use : `dispo setchannel #channel`");
        else setChannel(args);
      } else if (args[1]) {
        return message.reply("Usage : dispo setrole @Role / dispo setchannel #channel");
      }


      // If the player isn't set as available
      if (!availablePlayers.contains(message.author.id)) {
        availablePlayers.push(message.author.id)
      } else {

      }
    }
};

function setRole(args) {
  ConfigManager.edit
}

function setChannel(args) {

}
