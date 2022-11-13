const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: "This command is outdated.",
        ephemeral: true,
      });

    if (interaction.guild === null) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  You can not run commands here!");

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }

    if (command.developer && interaction.user.id !== "343875291665399818")
      return interaction.reply({
        content: "This command is exclusive to Rapid currently",
        ephemeral: true,
      });

    command.execute(interaction, client);
  },
};
