const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    Client,
  } = require("discord.js");
  
  const { loadCommands } = require("../../Handlers/commandHandler");
  const { loadEvents } = require("../../Handlers/eventHandler");
  
  module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
      .setName("apikey")
      .setDescription("Switches the API key and the Universe ID for the bot.")
      .addSubcommand((options) =>
        options.setName("main").setDescription("Main game")
      )
      .addSubcommand((options) =>
        options.setName("commands").setDescription("Reload commands")
      ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
  
    execute(interaction, client) {
      const subCommand = interaction.options.getSubcommand();
  
      switch (subCommand) {
        case "events":
          {
            for (const [key, value] of client.events)
              client.removeListener(`${key}`, value, true);
            loadEvents(client);
            interaction.reply({ content: "Reloaded Events ✅", ephemeral: true });
          }
          break;
        case "commands":
          {
            loadCommands(client);
            interaction.reply({
              content: "Reloaded Commands ✅",
              ephemeral: true,
            });
          }
          break;
      }
    },
  };
  