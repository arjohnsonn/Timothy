const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
} = require("discord.js");

const Database = require("../../Schemas/Points");
const Role = "1046503404769382532"; // ADMINISTRATION
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");

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
    if (Eligible(Role, interaction) == false) return;

    const Member = interaction.options.getUser("user");

    let userData = await Database.findOne({
      Guild: interaction.guild.id,
      User: Member.id,
    });
    if (!userData || userData === null) {
      const Embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(`${Member.username} has 0 points.`);

      interaction.reply({ embeds: [Embed] });
      return;
    } else {
      const CurrentPoints = userData.Points;
      let addition = "";
      if (CurrentPoints > 1 || CurrentPoints === 0) {
        addition = "s";
      }
      const Embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(
          `${Member.username} has ${CurrentPoints} point${addition}.`
        );

      interaction.reply({ embeds: [Embed] });
      return;
    }
  },
};
