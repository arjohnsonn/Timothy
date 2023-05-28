const { EmbedBuilder } = require("discord.js");

module.exports.Eligible = function Eligible(Role, interaction) {
  if (
    (interaction.guild.roles.fetch(Role).position <=
      interaction.member.roles.highest.position) ||
    interaction.member.id == "343875291665399818"
  ) {
    return true;
  } else {
    const Embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setDescription("❌  You do not have permission to run this command!");

    interaction.reply({ embeds: [Embed], ephemeral: true });
    return false;
  }
};
