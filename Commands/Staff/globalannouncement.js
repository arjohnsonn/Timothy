const { MessageSend } = require("../../Modules/MessageSend");

const Role = "1057031499544793138";
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");

const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("globalannouncement")
    .setDescription("Create a global announcement for all active servers")
    .addStringOption((option) =>
      option.setName("message").setDescription("Message").setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    if (Eligible(Role, interaction) == false) return;

    Log(interaction);

    let Reason = interaction.options.getString("message");

    if (!Reason) return;

    var T = {
      Type: "Announcement",
      Message: Reason,
      Moderator: `By ${interaction.user.username} (${interaction.member.roles.highest.name})`,
      AnnType: "Global",
    };

    const Result = await MessageSend(T, "Admin", interaction);
    if (Result === true) {
      const Embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("Money")
        .setDescription(
          `✅ Successfully set ${Data.Username}'s cash to ${Data.Amount}.\nTo prevent data loss, this may take a few seconds...`
        )
        .addFields();
      return interaction.reply({
        embeds: [Embed],
      });
    }
  },
};
