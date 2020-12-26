// Permissions list can be found here https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS

const loadCommands = require(appRoot + "/app.js").loadCommands;

const gifs = [
  "https://media.tenor.com/images/45c38f5f82dc36306a3b13b5d0606d3a/tenor.gif",
  "https://media.tenor.com/images/0c7e7b4d4807383a879111bc21e4cada/tenor.gif",
  "https://giphy.com/gifs/swamppeople-swamp-people-gator-jaypaul-8DTVLWOGZuT8k",
  "https://media1.tenor.com/images/fc1706e0f191cae4ab3a950df8f0e259/tenor.gif?itemid=17416824",
  "https://i.pinimg.com/originals/3f/7b/94/3f7b94b5e029995ebd2d6249def5bb7c.gif",
  "https://i.imgur.com/d7TdMDD.gif"
]

module.exports = {
    name: 'reload',
    description: 'Recharger les commandes du bot.',
    usage: '',
    aliases: [],
    permissions: ['MANAGE_WEBHOOKS'],

    execute(client, message, args) {
      return message.reply("WIP");
      
      if (!args.length) {
        // Get random gif to achieve big funny
        const gif = gifs[Math.floor(Math.random() * gifs.length)];
        message.reply(`Reloading... \n ${gif}`);
      } else message.reply('Reloading...');

      loadCommands(appRoot + '/src/commands', message);
    }
};
