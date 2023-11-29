var { MessageSend } = require("../../Modules/MessageSend");

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
    .setName("updategame")
    .setDescription("Updates the game with the Updater module")
    .addStringOption((option) =>
      option
        .setName("confirm")
        .setDescription("Are you sure? Type 'Confirm' to update the game.")
        .setRequired(true)
    ),

  Refresh: function Refresh() {
    MessageSend = require("../../Modules/MessageSend").MessageSend;
  },
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    if (Eligible(Role, interaction) == false) return;

    Log(interaction);

    let Text = interaction.options.getString("message");

    if (!Text) return;
    if (Text != "Confirm") {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Updater")
        .setDescription(`You did not enter the correct confirmation code!`);
      interaction.reply({
        embeds: [Embed],
      });
      return;
    }

    var T = {
      Type: "Update",
    };

    const Result = await MessageSend(T, "Admin", interaction);
    if (Result === true) {
      const Embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("Updater")
        .setDescription(
          `✅ Successfully sent out an update via Updater ${Reason}`
        );
      interaction.reply({
        embeds: [Embed],
      });
    }
  },
};
