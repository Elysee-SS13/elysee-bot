// Default command template
// Permissions list can be found here https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS

const { MessageEmbed } = require('discord.js');
const Conf = require(appRoot + "/src/modules/ConfigManager").ConfigManager;
const helpers = require(appRoot + '/src/helpers.js');


// Make sure to export properties
// Main command
module.exports = {
    name: 'help', // Command name (what's gonna be used to call the command)
    description: 'Liste toutes les commandes. Donne des infos sur une commande si elle est spécifiée.',
    usage: '[command_name]',   // Only write arguments
    aliases: ['commands'], // Command aliases
    permissions: [], // Permissions required to issue the command

    execute(client, message, args) {

        // There are args, do something else
        if (args.length) return this.executeWithArgs(client, message, args);

        // Create the string to be embed
        const cmdStr = client.commands
                           .filter(cmd => helpers.checkPermissions(message.member, cmd.permissions))
                           .sort()
                           .map(cmd => `\`${cmd.name}\` : ${cmd.description || cmd.usage || "Pas de description"}`)
                           .join("\n")
                           + `\n\n Utilisez \`${Conf.getConfig().prefix}help [commande]\` pour avoir de l'aide sur une commande.`;


        const embed = new MessageEmbed()
        .setTitle('Commands')
        .setColor('BLUE')
        .setDescription(cmdStr);
        message.channel.send({ embed })

        .catch(e => Logger.error(e));
    },

    // It is possible to separate code in multiple functions
    executeWithArgs(client, message, args) {
        // Search command with name specified
        var find = client.commands.find(c => c.name === args[0]);
        var fullCmd = `${Conf.getConfig().prefix + find.name}`;
        if (find) {
          args.shift;

          // Check for subcommands
          while(args.length) {
            Logger.debug(args.length);
            // If the command has subcommands
            if (find.subcommands) {
              let sub = find.subcommands.find(sub => sub.name === args[0]);

              // If subcommand is found
              if (sub) {
                // Do it again
                find = sub;
                fullCmd += " " + sub.name;
                args.shift();

              // If not, ignore the rest
              } else break;
            } else break;
          }

          const embed = new MessageEmbed()
          .setTitle(`Aide : ${fullCmd} `)
          .setColor('BLUE')
          .setDescription(`Commande : \`${fullCmd}\` \n ${find.description || "Pas de description"} \n Utilisation : ${find.usage || "Pas de paramètres"}`)
          message.channel.send({ embed })

          .catch(e => Logger.error(e));
        }
    }
};


// Define subcommands
const helpTest = {
  name: 'test',   // Command will be executed on "help test"
  permissions: [],  // Different permissions can be set

  execute(client, message, args) {
    message.reply("Help test executed with args " + args);
  }
};


// This is for convenience
// add subcommands after their initialization
module.exports.subcommands = [helpTest];
