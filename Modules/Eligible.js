const { EmbedBuilder } = require("discord.js");

module.exports.Eligible = function Eligible(Role, interaction, Bypass) {
  if (
    interaction.member.roles.highest.position >=
      interaction.guild.roles.cache.get(Role).position ||
    interaction.member.id == "343875291665399818"
  ) {
    return true;
  } else {
    if (!Bypass) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  You do not have permission to run this command!");

      interaction.reply({ embeds: [Embed], ephemeral: true });
    }
    return false;
  }
};
