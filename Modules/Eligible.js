const { EmbedBuilder } = require("discord.js");

module.exports.Eligible = function Eligible(Role, interaction) {
    console.log(interaction.guild.roles.cache.get(Role).position)
    console.log(interaction.member.roles.highest.position)
  if (
    (interaction.guild.roles.cache.get(Role).position <=
      interaction.member.roles.highest.position) /* ||
    interaction.member.id == "343875291665399818"*/
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
