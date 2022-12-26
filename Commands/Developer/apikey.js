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
        options.setName("qa").setDescription("QA testing plate")
      )
      .addSubcommand((options) => 
         options.setName("scripting").setDescription("Lawcountry: Scripting"))
      ,
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
  
    execute(interaction, client) {
      const subCommand = interaction.options.getSubcommand();
      
      
    },
  };
  