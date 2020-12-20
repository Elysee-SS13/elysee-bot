var availablePlayers = [];

module.exports = {
    name: 'dispo', // Command name (what's gonna be used to call the command)
    aliases: ['opt-in'], // Command aliases

    execute(client, message) {
      // If the player isn't set as available
      if (!availablePlayers.contains(message.author.id)) {
        availablePlayers.push(message.author.id)
      } else {

      }
    }
};
