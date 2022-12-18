const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
} = require("discord.js");

const Database = require("../../Schemas/Points");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mypoints")
    .setDescription("View your moderation points through Timothy"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    let userData = await Database.findOne({
      Guild: interaction.guild.id,
      User: interaction.user.id,
    });
    if (!userData || userData === null) {
      const Embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(`${interaction.user.username}, you have 0 points.`);

      interaction.reply({ embeds: [Embed] });
      return;
    } else {
      const CurrentPoints = userData.Points;
      const Embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(
          `${interaction.user.username}, you have ${CurrentPoints} points.`
        );

      interaction.reply({ embeds: [Embed] });
      return;
    }
  },
};
