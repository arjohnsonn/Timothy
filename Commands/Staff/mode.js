const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  EmbedBuilder,
} = require("discord.js");

const Role = "800513206006054962";

const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");

const DataStores = require("../../Modules/DataStores");
const GetLiveryData = require("../../Modules/GetLiveryData");
const GetPlayerData = require("../../Modules/GetPlayerData");
const GetServerData = require("../../Modules/GetServerData");
const MessageSend = require("../../Modules/MessageSend");
const SetLiveryData = require("../../Modules/SetLiveryData");
const SetPlayerData = require("../../Modules/SetPlayerData");
const SetServerData = require("../../Modules/SetServerData");

const ban = require("./ban");
const banreason = require("./banreason");
const data = require("./data");
const globalannouncement = require("./globalannouncement");
const kick = require("./kick");
const unban = require("./unban");
const MessageReactionAdd = require("../../Events/Client/MessageReactionAdd");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mode")
    .setDescription("Sets bot to normal, QA, scripting plate mode")
    .addStringOption((option) =>
      option

        .setName("value")
        .setDescription("The type of plate you want to set the bot to")
        .setRequired(true)

        .addChoices(
          { name: "Normal", value: "normal" },
          { name: "QA", value: "qa" },
          { name: "Scripting", value: "scripting" }
        )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    if (Eligible(Role, interaction) == false) return;

    Log(interaction);

    const Option = interaction.options.getString("value");
    if (Option == null) return;

    await interaction.deferReply();

    let Integer;
    switch (Option) {
      case "normal":
        Integer = 1;
      case "qa":
        Integer = 2;
      default:
        Integer = 3;
    }

    DataStores.SetQA(Integer);
    MessageSend.Refresh(Integer);

    setTimeout(() => {}, 500);

    GetLiveryData.Refresh();
    GetPlayerData.Refresh();
    GetServerData.Refresh();

    SetLiveryData.Refresh();
    SetPlayerData.Refresh();
    SetServerData.Refresh();

    setTimeout(() => {}, 500);

    // command refresh

    ban.Refresh();
    banreason.Refresh();
    data.Refresh();
    globalannouncement.Refresh();
    kick.Refresh();
    unban.Refresh();

    MessageReactionAdd.Refresh();

    setTimeout(() => {}, 500);

    //

    // loadCommands(client);

    const Embed = new EmbedBuilder()
      .setColor("#ffffff")
      .setDescription(`Successfully set bot mode to **${Option}** ✅`);

    interaction.editReply({ embeds: [Embed] });
  },
};
