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
    .setName("unban")
    .setDescription("Ban players from the Lawcountry game")
    .addStringOption((option) =>
      option.setName("username").setDescription("Username of Player")
    )
    .addIntegerOption((option) =>
      option.setName("id").setDescription("User ID of player")
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for ban, valid reasons only.")
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
      var BanReason;
      BanDataStore.GetAsync(UserId.toString()).then(([Data]) => {
        if (Data) {
          if (typeof Data === "object") {
            BanReason = Data.Reason;
          } else if (typeof Data === "string") {
            const Args = Data.split(";;;"); // OLD METHOD
            BanReason = Args[0];
          }
        }
      });

      BanDataStore.RemoveAsync(UserId.toString())
        .then(async (Result) => {
          let Data = "";
          try {
            Data = await GET(
              "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                UserId.toString() +
                "&size=420x420&format=Png&isCircular=false"
            );
            Data = Data.data[0].imageUrl;
          } catch (e) {
            console.log(e);
            Data = "";
          }

          const Embed = new EmbedBuilder()
            .setTitle("Unban")
            .setColor("#00ff00")
            .setDescription(`✅  Unbanned ${User} (ID: ${UserId})`)
            .addFields({
              name: "Ban Reason",
              value: BanReason || "unknown",
              inline: true,
            })
            .setThumbnail(Data);
          interaction.reply({ embeds: [Embed] });
        })
        .catch((err) => {
          const Embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(`❌ ${User} is not currently banned!`);
          interaction.reply({ embeds: [Embed] });
        });
    }
  },
};
