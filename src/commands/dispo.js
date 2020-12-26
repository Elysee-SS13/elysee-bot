const {
  Role
} = require("discord.js");
const {
  ConfigManager
} = require(appRoot + '/src/classes/ConfigManager');
const helpers = require(appRoot + '/src/helpers.js');


// Main command
module.exports = {
  name: 'dispo',
  description: 'Permet à un membre de se marquer comme "prêt à jouer". Si suffisamment de joueurs sont prêts, une partie est lancée.',
  usage: '',

  aliases: ['opt-in', 'optin', 'disponible', 'pret', 'ready'],
  permissions: [],
  subcommands: [],

  execute(client, message, args) {
    // If an invalid parameter has been issued
    if (args[0])
      return message.reply(`Utilisation : ${this.usage}`);

    // If no subcommand is provided set the player as ready

    // Get the role ID from the config
    const roleId = ConfigManager.getConfig().readyRole;
    Logger.debug("Role ID " + roleId);

    // Then get the role object from the guild
    message.guild.roles.fetch(roleId)
      .then(role => {
        // If the role doesn't exist return
        if (!role || !(role instanceof Role)) return message.reply("Le rôle 'prêt à jouer' n'est pas défini. Contactez un admin.");

        // If player isn't already set as ready, give them the role
        const hasRole = message.member.roles.cache.find(r => r.id === roleId);

        // Toggle the role
        if (!hasRole) {
          message.member.roles.add(role);
        } else {
          message.member.roles.remove(role);
        }

        // Get number of players with ready role
        const readyMembers = role.members;

        // If enough players are ready, make an annoucement
        const size = readyMembers.size += (hasRole) ? -1 : +1;  // We count this player manually bc it would need to refetch the role

        if (size >= ConfigManager.getConfig().readyPlayerCount) {
          client.channels.fetch(ConfigManager.getConfig().readyChannel)

            .then(c => {
              // Notify people
              if (c) c.send(`<@&${roleId}> Suffisamment de joueurs sont dispo, une partie peut commencer !`);
              else message.reply("Suffisamment de joueurs sont prêts mais le channel 'prêt à jouer' n'est pas défini. Contactez un admin.");
            })
            .catch(e => console.error(e));
        }
      });


    // Delete the message anyways
    message.delete();
  }
};


// SUBCOMMANDS //


module.exports.subcommands.push({
  name: 'setrole',
  description: 'Choisir le rôle pour les joueurs prêts à jouer.',
  usage: '<@Role>',
  permissions: ['MANAGE_WEBHOOKS'],

  execute(client, message, args) {
    if (!args.length) return message.reply("Invalide : Spécifiez un rôle comme argument");

    // Find mentions in arg
    const mention = helpers.parseMentions(args[0]);
    let id = mention[0].substring(1, mention[0].length);
    //Logger.debug(id);

    // Find the channel
    if (id) {
      const role = message.guild.roles.fetch(id)

        .then(r => {
          if (r) {
            // Write the role ID to the config
            ConfigManager.editKey('roleDispo', r.id);
            message.reply("Le rôle dispo a été défini");
          } else return message.reply("Erreur : Impossible de trouver le rôle");
        });

    } else return message.reply("Le paramètre doit être une mention de rôle valide `dispo setrole @Role`");
  }
});



module.exports.subcommands.push({
  name: 'setchannel',
  description: 'Choisir le rôle pour les joueurs prêts à jouer.',
  usage: '<#channel>',
  permissions: ['MANAGE_WEBHOOKS'],

  execute(client, message, args) {
    // Find mentions in arg
    const mention = helpers.parseMentions(args[0]);

    // Find the channel
    if (mention) {
      const channel = client.channels.fetch(mention)

        .then(channel => {
          if (channel) {
            // Write the role ID to the config
            ConfigManager.editKey('channelDispo', channel.id);
            message.reply("Le channel dispo a été défini");
          } else return message.reply("Erreur : Impossible de trouver le channel");
        });

    } else return message.reply("Le paramètre doit être une mention à un channel `dispo setchannel #channel`");
  }
});



module.exports.subcommands.push({
  name: 'setplayercount',
  description: 'Choisir le nombre de joueur nécessaires pour lancer une partie.',
  usage: '<nombre>',
  permissions: ['MANAGE_WEBHOOKS'],

  execute(client, message, args) {
    const parsed = parseInt(args[1]);

    if (parsed) {
      ConfigManager.editKey("nbJoueurs", parsed);
    } else message.reply("Mauvais paramètre, doit être un nombre !");
  }
});
