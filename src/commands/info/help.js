// Default command template
// Permissions list can be found here https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS

const { MessageEmbed } = require('discord.js');
const helpers = require(appRoot + '/src/helpers.js');


// Make sure to export properties
// Main command
module.exports = {
    name: 'help', // Command name (what's gonna be used to call the command)
    description: 'Liste toutes les commandes. Donne des infos sur une commande si elle est spécifiée.',
    usage: 'help [command_name]',
    aliases: ['commands'], // Command aliases
    permissions: [], // Permissions required to issue the command

    execute(client, message) {
        // Create a string with all commands sepearated by ','.
        const cmdStr = client.commands.map(c => helpers.checkPermissions(message.member, this.permissions) ? `\`${c.name}\`` : "" ).join();
        const embed = new MessageEmbed()
        .setTitle('Commands')
        .setColor('RANDOM')
        .setDescription(cmdStr);
        message.channel.send({ embed })

        .catch(e => Logger.error(e));
    }
};


// Define subcommands before the main command
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
