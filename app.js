/**
 * Go to the repository if you need a more details instruction on installing the requiured
 * dependencies and some additional things.
 *
 * Repository link: https://github.com/pusheen-dev/DiscordBotExample
 * Author: pusheen-dev
 *
 * Dependencies are
 * glob and discord.js
 *
 * Create a package.json for your project by running 'npm init' in your project folder.
 * And then install the dependencies with 'npm install --save glob discord.js'
 */

// Declare globals (use wisely)
appRoot = __dirname;
Logger = require('./src/modules/Logger').Logger;  // This basically makes Logger a singleton


// Require the dependencies
require('dotenv').config();
const { Client, Collection, Constants } = require('discord.js');
const path = require('path');
const glob = require('glob');


// Require local modules
const { ConfigManager } = require("./src/modules/ConfigManager");
const helpers = require("./src/helpers.js");


// Require the config.json file, and define our Client. Get the client key
const config = ConfigManager.getConfig();
const token = process.env.TOKEN;
const client = new Client();


// Create two Collections where we can store our commands and aliases in.
// Store these collections on the client object so we can access them inside commands etc.
client.commands = new Collection();
client.aliases = new Collection();
client.permissions = new Collection();


// Function that will load all commands from the given directory.
// Optional message parameter to answer to a message when loading is finished
module.exports.loadCommands = function(cmdDir, message=null) {
    // Create an empty array that will store all the file paths for the commands,
    // and push all files to the array.
    const items = [];
    items.push(...glob.sync(`${path.join(__dirname, cmdDir)}/**/*.js`));

    // Iterate through each element of the items array and add the commands / aliases
    // to their respective Collection.
    for (const item of items) {
        // Remove any cached commands
        if (require.cache[require.resolve(item)]) delete require.cache[require.resolve(item)];

        // Store the command and aliases (if it has any) in their Collection.
        const command = require(item);

        // ignore flag to avoid indexing the command
        if (command.ignore) continue;

        client.commands.set(command.name, command);
        if (command.aliases) {
            for (const alias of command.aliases) {
                client.aliases.set(alias, command.name);
            }
        }

        if (command.permissions && command.permissions.size > 0) {
          for (const perm of command.permissions) {
            client.permissions.set(perm, command.name);
          }
        }
    }
    Logger.success("Commands loaded successfully");

    // Answer if message is given
    if (message) message.reply("Reload terminé !");
}

// Run function and pass the relative path to the 'commands' folder.
module.exports.loadCommands('./src/commands');


// Client ready event
client.on('ready', () => {
    Logger.success("Bot ready !");
})


// Client message event, contains the logic for the command handler.
.on('message', message => {
    // Make sure the message contains the command prefix from the config.json.
    if (!message.content.startsWith(config.prefix)) return;
    // Make sure the message author isn't a bot.
    if (message.author.bot) return;
    // Make sure the channel the command is called in is a text channel.
    if (message.channel.type !== 'text') return;

    /* Split the message content and store the command called, and the args.
    * The message will be split using space as arg separator.
    */
    const cmd = message.content.split(/\s+/g)[0].slice(config.prefix.length);
    const args = message.content.split(/\s+/g).slice(1);

    try {
        // Check if the command called exists in either the commands Collection
        // or the aliases Collection.
        let command;
        if (client.commands.has(cmd)) {
            command = client.commands.get(cmd);
        } else if (client.aliases.has(cmd)) {
            command = client.commands.get(client.aliases.get(cmd));
        }

        // Make sure command is defined.
        if (!command) return;


        let iterationCount = 0;  // Exit condition to avoid infinite loop

        // Check if a subcommand has been issued
        while (true) {
          if (command.subcommands && args) {

            // Look for the subcommand
            const match = command.subcommands.find(sub => sub.name === args[0]);

            if (match) {
              command = match;
              args.shift();   // Remove the first arg

            // If the subcommand can't be found, break
            } else break;

          // If the command doesn't have subs, break
          } else break;

          // Avoid infinite loops
          iterationCount++;
          if (iterationCount > 1000) {
            Logger.error("While loop break at 1000 iterations.");
          }
        }

        // Check if the user has permission to issue the command and run it
        if (helpers.checkPermissions(message.member, command.permissions)) {
          command.execute(client, message, args);
          Logger.info(`User ${message.author.username} ran command ${command.name} with ${args.length > 0 ? "args: "+args : "no args"}`);

        // Else print an error
        } else {
          message.reply(ConfigManager.getConfig().messages.invalidPermission);
          Logger.info(`User ${message.author.username} tried to run command ${command.name} but didn't have permission.`);
        }


    } catch (err) {
        console.error(err);
    }
});

// Login
client.login(token)
.catch(e => e.code === 'TOKEN_INVALID' ?
            Logger.error("An invalid token has been provided. Make sure you added a .env file and wrote the right token in it. The format should be TOKEN=<token>") :
            console.error(e.code));
