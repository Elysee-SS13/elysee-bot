// Permissions list can be found here https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
const Conf = require(appRoot + '/src/classes/ConfigManager').ConfigManager;
const { MultiPagesCodeMessage } = require(appRoot + '/src/classes/MultiPagesMessage');

/*
config view // Affiche la config
*/

module.exports = {
    name: 'config',
    description: 'Voir et modifier la configuration du bot',
    usage: '',
    aliases: ['conf', 'cfg'],
    permissions: ['MANAGE_WEBHOOKS'],
    subcommands: [],

    execute(client, message, args) {
    }
};


// SUBCOMMANDS //



module.exports.subcommands.push({
  name: 'view',
  description: 'Afficher la configuration du bot ou consulter une clé',
  usage: '[key]',
  permissions: 'MANAGE_WEBHOOKS',

  execute(client, message, args) {
    // Show full config
    if (!args.length) {
      const conf = JSON.stringify(Conf.getConfig(), null, 2);
      new MultiPagesCodeMessage(conf, message, 'json');
      return;
    }

    if (args.length > 1) return ErrorHandler.tooManyArgs(this.usage, message);

    const key = args[0];
    const value = Conf.getConfig()[key];

    if (!value) return ErrorHandler.invalidArgs(this.usage, message);

    message.channel.send(`Clé : \`${key}\` \n Valeur : \`${value}\``);
  }
});



module.exports.subcommands.push({
  name: 'edit',
  description: 'Modifier une clé de la configuration du bot',
  usage: '<key> <new_value>',
  permissions: 'MANAGE_WEBHOOKS',

  execute(client, message, args) {

  }
});
