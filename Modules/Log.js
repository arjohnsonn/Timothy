const { EmbedBuilder } = require("discord.js");

module.exports.Log = function Log(interaction) {
  const LogEmbed = new EmbedBuilder()
    .setColor("#ffffff")
    .setTitle(interaction.user.username)
    .setThumbnail(
      interaction.user.displayAvatarURL({ size: 1024, dynamic: true })
    )
    .setDescription("/" + interaction.commandName);

  interaction.client.channels.cache
    .get("1019434063653765201")
    .send({ embeds: [LogEmbed] });
};
