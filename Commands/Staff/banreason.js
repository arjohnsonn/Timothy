const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Role = "800513206006054962";
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");
const { GetPlayer } = require("../../Modules/GetPlayer");
var { GetPlayerData } = require("../../Modules/GetPlayerData");
var { MessageSend } = require("../../Modules/MessageSend");
const { GET } = require("../../Modules/GET");
var { BanDataStore } = require("../../Modules/DataStores");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banreason")
    .setDescription("View ban reason of a player")
    .addStringOption((option) =>
      option.setName("username").setDescription("Username of Player")
    )
    .addIntegerOption((option) =>
      option.setName("id").setDescription("User ID of player")
    ),

  Refresh: function Refresh() {
    BanDataStore = require("../../Modules/DataStores").BanDataStore;
    MessageSend = require("../../Modules/MessageSend").MessageSend;
    GetPlayerData = require("../../Modules/GetPlayerData").GetPlayerData;
  },

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    if (Eligible(Role, interaction) == false) return;

    Log(interaction);

    const Username = interaction.options.getString("username");
    let Id = interaction.options.getInteger("id");

    if (!Id && !Username) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  Please specify type of player identification!");

      interaction.reply({ embeds: [Embed] });
    }

    const { UserId, User } = await GetPlayer(Id || Username);
    if (UserId) {
      let BanReason;
      let Length;
      BanDataStore.GetAsync(UserId.toString()).then(async ([BanData]) => {
        if (BanData) {
          if (typeof BanData === "object") {
            BanReason = BanData.Reason;
            Length = BanData.Length;
          } else if (typeof BanData === "string") {
            const Args = BanData.split(";;;"); // OLD METHOD
            BanReason = Args[0];
            Length = Args[1];
          }

          if (!Length) {
            Length = "Permanent";
          } else {
            Length = `Until <t:${Number(Length)}:F>`;
          }

          let Data = await GET(
            "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
              UserId +
              "&size=420x420&format=Png&isCircular=false"
          );
          if (Data.data[0].state == "Blocked") {
            Data = "https://i.imgur.com/91vsV4d.png";
          } else {
            Data = Data.data[0].imageUrl;
          }

          const Embed = new EmbedBuilder()
            .setTitle("Ban Reason")
            .setColor("#00ff00")
            .setDescription(`${User} (ID: ${UserId})`)
            .addFields({
              name: "Ban Reason",
              value: BanReason || "unknown",
              inline: true,
            })
            .addFields({
              name: "Length",
              value: Length,
              inline: true,
            })
            .setThumbnail(Data);
          interaction.reply({ embeds: [Embed] });
        }
      });
    }
  },
};
