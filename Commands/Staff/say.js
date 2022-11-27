const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Express your thoughts with Timothy!")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("What do you want to say?")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
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

    const String = interaction.options.getString("input");
    interaction.channel.send(String);
    interaction.reply({ content: "Sent!", ephemeral: true });
  },
};
