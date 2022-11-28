const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
  Embed,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("patchnotes")
    .setDescription("Send an embed for the latest patch notes!")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription(
          "This should already be formatted from a raw discord message, with ; breaking lines."
        )
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("forum")
        .setDescription(
          "Select the forum post that you want to send this message to."
        )
        .setRequired(true)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    if (
      interaction.member.id !== "287805833692053513" &&
      !interaction.member.roles.cache.has("1046499539764396113")
    ) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  You do not have permission to run this command!");

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }

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

    const Text = interaction.options.getString("text");
    const SendText = Text.replace(/;/g, "\n");
    const Channel = interaction.options.getChannel("forum");

    const Embed = new EmbedBuilder()
      .setTitle("Patch Notes")
      .setDescription(SendText)
      .setColor("#ffffff")
      .setTimestamp();

    interaction.client.channels.cache.get(Channel.id).send({ embeds: [Embed] });
    interaction.reply({ content: "Sent!", ephemeral: true });
  },
};
