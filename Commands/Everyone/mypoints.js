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
    if (
      !interaction.member.roles.cache.has("1046503404769382532") && // Administration
      !interaction.member.roles.cache.has("837979573522137091") && // BoD
      !interaction.member.roles.cache.has("817669388337152060") // Development
    ) {
      if (interaction.channelId === "739912817431412768") {
        const Embed = new EmbedBuilder()
          .setColor("#e0392d")
          .setDescription(
            "❌ Please use this command in <#739912817431412768>"
          );

        interaction.reply({ embeds: [Embed], ephemeral: true });
        return;
      }
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
