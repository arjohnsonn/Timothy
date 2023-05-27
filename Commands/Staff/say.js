const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Role = "1046503404769382532";
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");

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
    if (Eligible(Role, interaction) == false) return;

    Log(interaction);

    const String = interaction.options.getString("input");
    interaction.channel.send(String);
    interaction.reply({ content: "Sent!", ephemeral: true });
  },
};
