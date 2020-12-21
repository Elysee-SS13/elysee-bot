// Default command template
// Permissions list can be found here https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS

const { MessageEmbed } = require('discord.js');
const helpers = require(appRoot + '/src/helpers.js');

// Make sure to export properties
module.exports = {
    name: 'help', // Command name (what's gonna be used to call the command)
    aliases: ['commands'], // Command aliases
    permissions: [], // Permissions required to issue the command

    execute(client, message) {
        // Create a string with all commands sepearated by ','.
        const cmdStr = client.commands.map(c => helpers.checkPermissions(message.member, this.permissions) ? `\`${c.name}\`` : "" ).join();
        const embed = new MessageEmbed()
        .setTitle('Commands')
        .setColor('RANDOM')
        .setDescription(cmdStr);
        message.channel.send({ embed });
    }
};
