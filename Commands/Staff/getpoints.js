const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
} = require("discord.js");

const Database = require("../../Schemas/Points");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getpoints")
    .setDescription("View your moderation points through Timothy")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select the user you want to view points for.")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      if (
        !interaction.member.roles.cache.has("1046503404769382532") && // Administration
        !interaction.member.roles.cache.has("837979573522137091") && // BoD
        !interaction.member.roles.cache.has("817669388337152060") // Development
      ) {
        const Embed = new EmbedBuilder()
          .setColor("#e0392d")
          .setDescription("❌ You do not have permission to use this command.");

        interaction.reply({ embeds: [Embed] });
        return;
      }
    } catch {
      const Embed = new EmbedBuilder()
        .setColor("#e0392d")
        .setDescription(
          "❌ An error has occurred. Please try this command again."
        );

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }

    const Member = interaction.options.getUser("user");

    let userData = await Database.findOne({
      Guild: interaction.guild.id,
      User: Member.id,
    });
    if (!userData || userData === null) {
      const Embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(`${interaction.user.username} has 0 points.`);

      interaction.reply({ embeds: [Embed] });
      return;
    } else {
      const CurrentPoints = userData.Points;
      let addition = "";
      if (CurrentPoints > 1) {
        addition = "s";
      }
      const Embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(
          `${interaction.user.username} has ${CurrentPoints} point${addition}.`
        );

      interaction.reply({ embeds: [Embed] });
      return;
    }
  },
};
