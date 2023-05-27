const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Role = "1046503404769382532"; // ADMINISTRATION
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns the ping of thy Timothy bot"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (Eligible(Role, interaction) == false) return;
    Log(interaction);

    console.log(Result);
    interaction.reply({
      content: `🏓  Ping latency is **${
        Date.now() - interaction.createdTimestamp
      }** ms. API Latency is **${Math.round(client.ws.ping)}** ms`,
      ephemeral: false,
    });
  },
};
