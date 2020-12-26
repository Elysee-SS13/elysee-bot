// Permissions list can be found here https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
const { ConfigManager } = require(appRoot + '/src/modules/ConfigManager');

module.exports = {
    name: 'config',
    aliases: ['conf', 'cfg'],
    permissions: ['MANAGE_WEBHOOKS'],

    execute(client, message, args) {
      return message.reply("WIP");
      
      // Manage subcommands
      if (args.length < 0) {
        message.reply("Invalid arguments. Valid actions are `view [key]`, `edit <key> <new_value>`");
      } else {
        switch (args[0]) {
          case "edit":
            edit(args[1], args[2]);
            break;
          case "view":
            break;
        }
      }
    }
};

function edit(key, newValue) {
  if (key)
    ConfigManager.editKey(key, newValue);
  else
    message.rep
}

function view(key) {

}
