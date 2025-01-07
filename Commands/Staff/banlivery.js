const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Role = "797710521578684467"; // ADMIN
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");
var { LiveryBanDataStore } = require("../../Modules/DataStores");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banlivery")
    .setDescription("Ban livery IDs from the game")
    .addIntegerOption((option) =>
      option.setName("id").setDescription("User ID of player").setRequired(true)
    ),

  Refresh: function Refresh() {
    BanDataStore = require("../../Modules/DataStores").BanDataStore;
    MessageSend = require("../../Modules/MessageSend").MessageSend;
  },

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    if (Eligible(Role, interaction) == false) return;

    Log(interaction);

    let Id = interaction.options.getInteger("id");

    if (!Id) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  Please specify livery ID!");

      interaction.reply({ embeds: [Embed] });
      return;
    }

    LiveryBanDataStore.SetAsync(Id.toString(), false);

    const Embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setDescription("✅  Successfully banned the livery ID: " + Id);

    interaction.reply({ embeds: [Embed] });
  },
};
