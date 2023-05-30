const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Role = "822824831937413130"; // VERIFIED
const Role2 = "1046503404769382532"; // ADMIN+
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");

const Database = require("../../Schemas/Points");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mypoints")
    .setDescription("View your moderation points through Timothy"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (Eligible(Role, interaction) == false) return;
    if (
      Eligible(Role2, interaction) == false &&
      interaction.channel.id != "1056926544066510888"
    ) {
      const Embed = new EmbedBuilder()
        .setColor("#e0392d")
        .setDescription("❌ Please use this command in <#1056926544066510888>");

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }

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
