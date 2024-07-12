const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { GUILD_ID, TESTGUILD_ID } = process.env;

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  You can not run commands here!");

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }
    if (!interaction.guild) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  You can not run commands here!");

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }

    if (
      interaction.guild.id !== GUILD_ID &&
      interaction.guild.id !== TESTGUILD_ID
    ) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  You can not run commands here!");

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: "This command is outdated.",
        ephemeral: true,
      });

    if (command.developer && interaction.user.id !== "343875291665399818")
      return interaction.reply({
        content: "This command is exclusive to Rapid currently",
        ephemeral: true,
      });

    command.execute(interaction, client);
  },
};
