const noblox = require("noblox.js");
const { EmbedBuilder } = require("discord.js");

module.exports.GetPlayer = async function GetPlayer(Input) {
  var Id;
  var Username;
  if (isNaN(Input)) {
    Username = Input;
  } else {
    Id = Input;
  }

  if (Id) {
    try {
      const Name = await noblox.getUsernameFromId(Id);
      if (Name !== null) {
        return { UserId: Id, User: Username };
      } else {
        const Embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription("❌  Player does not exist!");

        interaction.reply({ embeds: [Embed], ephemeral: true });
      }
    } catch {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  Player does not exist!");

      interaction.reply({ embeds: [Embed], ephemeral: true });
    }
  } else if (Username) {
    try {
      const PlrId = await noblox.getIdFromUsername(Username);
      if (PlrId !== null) {
        return { UserId: PlrId, User: Username };
      } else {
        const Embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription("❌  Player does not exist!");

        interaction.reply({ embeds: [Embed], ephemeral: true });
      }
    } catch (err) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  Player does not exist!");
      console.log(err);
      interaction.reply({ embeds: [Embed], ephemeral: true });
    }
  }
};
