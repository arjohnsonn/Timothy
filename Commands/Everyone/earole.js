const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Role = "822824831937413130"; // VERIFIED
const Role2 = "1046503404769382532"; // ADMIN+
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");
const { GetPlayer } = require("../../Modules/GetPlayer");
const { GetPlayerData } = require("../../Modules/GetPlayerData");
const Database = require("../../Schemas/Points");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("earole")
    .setDescription("Obtain your EA role in Discord"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (Eligible(Role, interaction) == false) return;
    if (
      Eligible(Role2, interaction, true) == false &&
      interaction.channel.id != "1056926544066510888"
    ) {
      const Embed = new EmbedBuilder()
        .setColor("#e0392d")
        .setDescription("❌ Please use this command in <#1056926544066510888>");

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }

    const { UserId, User } = await GetPlayer(
      interaction.member.nickname,
      interaction
    );

    if (UserId) {
      const PlayerData = await GetPlayerData(UserId, interaction);
      if (!PlayerData) {
        /*
        const Embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription(
            "❌  Please join and leave the game once with Early Access before doing this command!"
          );

        interaction.reply({ embeds: [Embed] });*/
        return;
      }

      var EARole;
      try {
        EARole = interaction.guild.roles.cache.get("871389346748592128");
      } catch {
        const Embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription("❌  An error has occurred. Please try again later.");

        interaction.reply({ embeds: [Embed] });
        return;
      }

      interaction.member.roles.add(EARole);

      const Embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setDescription("✅  You have been given the Early Access role.");

      interaction.reply({ embeds: [Embed] });
      return;
    }
  },
};
