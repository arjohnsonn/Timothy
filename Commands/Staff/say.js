const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
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
    const String = interaction.options.getString("input");
    interaction.channel.send(String);
    interaction.reply({ content: "Sent!", ephemeral: true });
  },
};
