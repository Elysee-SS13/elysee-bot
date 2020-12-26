const { GuildMember, Guild } = require("discord.js");

module.exports = {

  // Check if user has all permissions provided in array
  checkPermissions(user, permissions) {
    // Check parameter types
    if (!user instanceof GuildMember)
      return Logger.error("User should be of type GuildMember. Maybe try message.member ?")
    if (!permissions instanceof Array)
      return Logger.error("Permission should be an Array");

    var hasPermissions = true
    if (permissions)
      if(permissions.length > 0)
        for (let perm of permissions)
          hasPermissions = hasPermissions && user.hasPermission(perm);

    return hasPermissions;
  },


  // Find mentions in a message (format : <@1234567890> or <#101010101010>)
  // Returns an array of ID
  parseMentions(string) {
    const matches = string.match(/<(@|#)&?\d+>/g);
    for (let i in matches) {
      matches[i] = matches[i].substr(2, matches[i].length-3);
    }
    return matches;
  },


  // Removes diacritics from string and lowercase it, for use in comparison
  sanitizeString(string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  },



  clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }

}
