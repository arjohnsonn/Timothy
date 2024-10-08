const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Role = "1046503404769382532";
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");
const { GetPlayer } = require("../../Modules/GetPlayer");
const GetRobloxBan = require("../../Modules/GetRobloxBan");
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
    )
    .addBooleanOption((option) =>
      option.setName("hideprivatereason").setDescription("Hide private reason?")
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
    const hidePrivateReason =
      interaction.options.getBoolean("hideprivatereason");

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

      const RobloxBanData = await GetRobloxBan(UserId);

      await BanDataStore.GetAsync(UserId.toString()).then(async ([BanData]) => {
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

          const RobloxBanData = await GetRobloxBan(UserId);

          const Embed = new EmbedBuilder()
            .setTitle("Ban Reason")
            .setColor("#00ff00")
            .setDescription(`${User} (ID: ${UserId})`)
            .addFields({
              name: "Ban Reason",
              value: BanReason ?? "unknown",
              inline: true,
            })
            .addFields({
              name: "Private Reason",
              value: hidePrivateReason
                ? "*Hidden via command*"
                : RobloxBanData.privateReason || "unknown",
              inline: true,
            })
            .addFields({
              name: "Length",
              value: Length,
              inline: true,
            })
            .addFields({
              name: "Time of Ban",
              value: `<t:${RobloxBanData.startTimeUnix}:F>`,
              inline: true,
            })
            .setThumbnail(Data);
          interaction.reply({ embeds: [Embed] });
        }
      });
    }
  },
};
