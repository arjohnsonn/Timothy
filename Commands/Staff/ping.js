const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns the ping of thy Timothy bot"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    interaction.reply({
      content: `🏓  Ping latency is **${
        interaction.createdTimestamp - Date.now()
      }** ms. API Latency is **${Math.round(client.ws.ping)}** ms`,
      ephemeral: false,
    });
  },
};
