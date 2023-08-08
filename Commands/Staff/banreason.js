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
  },
};
