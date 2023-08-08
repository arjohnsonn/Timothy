const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Role = "800513206006054962";
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");
const { GetPlayer } = require("../../Modules/GetPlayer");
const { GetPlayerData } = require("../../Modules/GetPlayerData");
const { MessageSend } = require("../../Modules/MessageSend");
const { GET } = require("../../Modules/GET");
const { BanDataStore } = require("../../Modules/DataStores");
const { multiGetLatestMessages } = require("noblox.js");

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
      BanDataStore.GetAsync(UserId.toString()).then(async ([BanData]) => {
        if (BanData) {
          if (typeof BanData === "object") {
            BanReason = BanData.Reason;
          } else if (typeof BanData === "string") {
            const Args = BanData.split(";;;"); // OLD METHOD
            BanReason = Args[0];
          }

          const Data = await GET(
            "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
              UserId.toString() +
              "&size=420x420&format=Png&isCircular=false"
          );

          const Embed = new EmbedBuilder()
            .setTitle("Ban Reason")
            .setColor("#00ff00")
            .setDescription(`${User} (ID: ${UserId})`)
            .addFields({
              name: "Ban Reason",
              value: BanReason || "unknown",
              inline: true,
            })
            .setThumbnail(Data.data[0].imageUrl);
          interaction.reply({ embeds: [Embed] });
        }
      });
    }
  },
};
