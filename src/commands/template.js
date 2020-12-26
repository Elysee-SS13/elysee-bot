// Default command template
// Permissions list can be found here https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS


// Make sure to export properties
// Main command
module.exports = {
    name: 'template', // Command name (what's gonna be used to call the command)
    description: 'Default template. Copy paste this to start creating a command',
    usage: '',   // Only write arguments
    aliases: [], // Command aliases
    permissions: [], // Permissions required to issue the command
    ignore: true, // Use this flag if you don't want the command to be parsed

    execute(client, message, args) {
    }
};


// Define subcommands
const sub = {
  name: 'sub',   // Command will be executed on "help test"
  permissions: [],  // Different permissions can be set

  execute(client, message, args) {
  }
};


// This is for convenience
// add subcommands after their initialization
module.exports.subcommands = [sub];
