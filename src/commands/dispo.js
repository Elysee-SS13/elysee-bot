const { ConfigManager } = require(appRoot + '/src/modules/ConfigManager');
const helpers = require(appRoot + '/src/helpers.js');

module.exports = {
    name: 'dispo', // Command name (what's gonna be used to call the command)
    aliases: ['opt-in', 'optin', 'disponible'], // Command aliases

    execute(client, message, args) {

      // If subcommand is setrole
      if (args[0] === 'setrole') {

        if (!args[1]) {
          return message.reply("Invalide, syntaxe de la commande : `dispo setrole @Role`");
        } else {
          if (helpers.checkPermissions(message.member, ['MANAGE_WEBHOOKS']))
            setRole(client, message, args);
          else message.reply(getConfig().messages.invalidPermission)
        }

      // If subcommand is setchannel
    } else if (args[0] === 'setchannel' || args[0] === 'setchan') {

        if (!args[1]) {
          return message.reply("Invalide, syntaxe de la commande : `dispo setchannel #channel`");
        } else {
          if (helpers.checkPermissions(message.member, ['MANAGE_WEBHOOKS']))
            setChannel(client, message, args);
          else message.reply(getConfig().messages.invalidPermission);
        }

      // If subcommand is anything else
    } else if (args[0] === 'setnbjoueurs') {

      if (!args[1]) {
        return message.reply("Invalide, syntaxe de la commande : `dispo setnbjoueurs <nb>`");
      } else {
        if (helpers.checkPermissions(message.member, ['MANAGE_WEBHOOKS']))
          setNbJoueurs(client, message, args);
        else return message.reply(getConfig().messages.invalidPermission);
      }

    } else if (args[0]) {
        return message.reply("Utilisation : `dispo setrole @Role` ou `dispo setchannel #channel` ou `dispo setnbjoueurs <nombre>`");
      }

      // If no subcommand is provided
      dispo(client, message, args);
      message.delete();
    }
};



function dispo(client, message, args) {
  const roleId = ConfigManager.getConfig().roleDispo;

  // If player isn't already set as available, give them the role
  if (!(message.member.roles.cache.find(r => r.id === roleId))) {
    const role = message.guild.roles.fetch(ConfigManager.getConfig().roleDispo)
    .then(r => {
      message.member.roles.add(r);
    });

  // Else remove the role
  } else {
    // If the user has Role 1, remove it from them.
    message.member.guild.roles.fetch(roleId)
    .then(r => {
      if (r)
        message.member.roles.remove(r);
    });
  }

  // Check if enough players are available
  const availableMembers = message.guild.members.cache.filter(m => m.roles.cache.find(r => r.id === ConfigManager.getConfig().roleDispo));
  if (availableMembers.length >= ConfigManager.getConfig().nbJoueurs) {
    message.guild.channels.fetch(ConfigManager.getConfig().channelDispo)
    .then(c => {
      c.send(`<@#${ConfigManager.getConfig().roleDispo}> Suffisamment de joueurs sont dispo, une partie peut commencer !`);
    })
    .catch(e => console.error(e));
  }

}



function setRole(client, message, args) {
  // Find mentions in arg
  const mention = helpers.parseMentions(args[1]);
  let id = mention[0].substring(1, mention[0].length);
  Logger.debug(id);

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



function setChannel(client, message, args) {
  // Find mentions in arg
  const mention = helpers.parseMentions(args[1]);

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



function setNbJoueurs(client, message, args) {
  const parsed = parseInt(args[1]);

  if (parsed) {
    ConfigManager.editKey("nbJoueurs", parsed);
  }
}
