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

    const String = interaction.options.getString("input");
    if (String.match("@everyone")) {
      interaction.reply({
        content: "You can not ping everyone using Timothy!",
      });
      return;
    } else if (String.match("@here")) {
      interaction.reply({
        content: "You can not ping here using Timothy!",
      });
      return;
    } else if (String.match("<@&")) {
      interaction.reply({
        content: "You can not ping roles using Timothy!",
      });
      return;
    }

    Log(interaction);

    interaction.channel.send(String);
    interaction.reply({ content: "Sent!", ephemeral: true });
  },
};
