const { ReactionCollector } = require('discord.js');
const helpers = (appRoot + "/src/helpers.js");

const nextPageEmoji = "▶️";
const prevPageEmoji = "◀️";
const closeEmoji = "❌";



/**
* Paginated message which the user can navigate using reaction menu
*/
class MultiPagesMessage {
  /**
  * @constructor
  * @param  {String}  fullText  Full text to display
  * @param  {Message} message   A message in the channel where to post from the user controlling the MultiPagesMessage
  */
  constructor(fullText, message) {

    this.fullText = fullText;
    this.author = message.author;
    this.curPage = 0;

    // Split full message into chunks
    this.pages = fullText.match(/(.|[\r\n]){1,1500}/g);

    // Send the message and create ReactionCollector
    message.channel.send("Loading...")
      .then(message => {

        // Create message and add reactions
        this.message = message;
        return this.updateMessage();
      })

      .then(message => {
        // Listen for user reactions
        this.collector = message.createReactionCollector((reaction, user) =>

          user.id === this.author.id &&
          reaction.emoji.name === prevPageEmoji ||
          reaction.emoji.name === nextPageEmoji ||
          reaction.emoji.name === closeEmoji

        ).once("collect", reaction => {
          const chosen = reaction.emoji.name;
          Logger.debug(reaction.emoji.name);
          switch (chosen) {
            case nextPageEmoji:
              this.nextPage();
              break;

            case prevPageEmoji:
              this.prevPage();
              break;

            case closeEmoji:
              this.message.delete();
              break;
          }
          this.collector.stop();
        });
      })

      .catch(e => Logger.error(e));
  }

  /**
  * Remove reactions on the message and adds them back
  * @return {Promise<Message>} A promise that resolves when the reactions are finished being added
  */
  clearReactions() {
    return new Promise((resolve, reject) =>
      this.message.reactions.removeAll()
        .then(message => this.message.react(prevPageEmoji))
        .then(message => this.message.react(nextPageEmoji))
        .then(message => this.message.react(closeEmoji))
        .then(message => resolve(this.message))
        .catch(e => reject(e)));
  }

  /**
  * Display the next page of the message
  */
  nextPage() {
    //if (!(this.curPage < this.pages.length - 1)) return this.clearReactions();

    this.curPage += 1;
    this.curPage = this.curPage%this.pages.length;
    this.updateMessage(this.curPage);
  }

  /**
  * Display the previous page of the message
  */
  prevPage() {
    if (this.curPage === 0) return this.clearReactions();

    this.curPage -= 1;
    this.updateMessage(this.curPage);
  }


  /**
  * Updates the message with content from the given page
  * @param {int} pageIndex
  */
  updateMessage(pageIndex) {
    this.message.edit(this.pages[this.curPage]);
    return this.clearReactions();
  }
}




/**
* Code formatted MultiPagesMessage
*/
class MultiPagesCodeMessage extends MultiPagesMessage {
  /**
  * @constructor
  * @param  {String}  fullText  Full text to display
  * @param  {Message} message   A message in the target channel, from the user controlling the MultiPagesMessage
  * @param  {String}  lang      (Optional) Language syntax highlight
  */
  constructor(fullText, message, lang="") {
    super(fullText, message);
    this.lang = lang;
  }

  /**
  * Updates the message with content from the given page
  * @param {int} pageIndex
  */
  updateMessage(pageIndex) {
    const str = "```" + this.pages[this.curPage] + "```";
    this.message.edit(str);
    return this.clearReactions();
  }
}



module.exports = {
  MultiPagesMessage: MultiPagesMessage,
  MultiPagesCodeMessage: MultiPagesCodeMessage
};
