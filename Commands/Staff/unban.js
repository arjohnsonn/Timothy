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
const RobloxBan = require("../../Modules/RobloxBan");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Ban players from the game")
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
      return;
    }

    const { UserId, User } = await GetPlayer(Id || Username, interaction);
    if (UserId) {
      let Success = false;
      try {
        const { data: banData } = await RobloxBan(
          UserId,
          "1s",
          "",
          "",
          true,
          false
        ); // ROBLOX API
        Success = true;
      } catch (e) {
        console.log(e);
      }

      let BanReason;
      await BanDataStore.GetAsync(UserId.toString()).then(([Data]) => {
        if (Data) {
          if (typeof Data == "object") {
            BanReason = Data.Reason;
          } else if (typeof Data == "string") {
            const Args = Data.split(";;;"); // OLD METHOD
            BanReason = Args[0];
          }
        }
      });

      let Success2 = false;
      let notExist = false;
      try {
        await BanDataStore.RemoveAsync(UserId.toString());
        Success2 = true;
      } catch (e) {
        console.log(e);
        notExist = true;
        if (e != "Key does not exist") {
          return;
        }
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

      let footerText =
        (Success
          ? `User has been Roblox API unbanned`
          : "Error Occurred: User has NOT been Roblox API unbanned") + " - ";

      if (Success2 && !notExist) {
        footerText += `User has been DataStore unbanned`;
      } else if (!Success2 && notExist) {
        footerText += `User is already DataStore unbanned (Key did not exist)`;
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
        .setThumbnail(Data)
        .setFooter({
          text: footerText,
        });

      interaction.reply({ embeds: [Embed] });
    }
  },
};
