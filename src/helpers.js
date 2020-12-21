const { GuildMember } = require("discord.js");
const { Logger } = require("./modules/Logger");

module.exports = {
  checkPermissions(user, permissions) {
    if (!user instanceof GuildMember)
      return console.error("User should be of type GuildMember. Maybe try message.member ?")
    if (!permissions instanceof Array)
      return console.error("Permission should be an Array");

    var hasPermissions = true
    if(permissions.length > 0)
      for (let perm of permissions)
        hasPermissions = hasPermissions && user.hasPermission(perm);

    return hasPermissions;
  }
}
