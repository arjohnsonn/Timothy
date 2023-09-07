const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  enableValidators,
} = require("discord.js");

const Role = "797710521578684467"; // ADMIN
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");
const { GetPlayer } = require("../../Modules/GetPlayer");
var { MessageSend } = require("../../Modules/MessageSend");
const { GET } = require("../../Modules/GET");
var { BanDataStore } = require("../../Modules/DataStores");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
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
    )
    .addIntegerOption((option) =>
      option
        .setName("length")
        .setDescription(
          "Leave blank/do not use this argument if permanent, sets length of ban IN DAYS"
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("anonymous")
        .setDescription(
          "Show your username in the ban message, defaults to false"
        )
    ),

  Refresh: function Refresh() {
    BanDataStore = require("../../Modules/DataStores").BanDataStore;
    MessageSend = require("../../Modules/MessageSend").MessageSend;
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
    let Reason = interaction.options.getString("reason");
    const Length = interaction.options.getInteger("length");
    let Mod = interaction.options.getBoolean("anonymous");

    if (Id) {
      Id = Id.toString();
    }

    if (!Reason) {
      Reason = "unspecified";
    }

    if (Mod == false || !Mod) {
      Mod = "";
    } else {
      Mod = `By ${interaction.member.user.username} (${interaction.member.roles.highest.name})`;
    }

    if (!Id && !Username) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  Please specify type of player identification!");

      interaction.reply({ embeds: [Embed] });
    }

    let banTime;
    if (Length) {
      banTime = Number(Date.now().toString().slice(0, -3)) + 86400 * Length;
    }

    const { UserId, User } = await GetPlayer(Id || Username);
    if (UserId) {
      var T = {
        Reason: Reason,
        Moderator: Mod,
        Length: banTime,
        Player: UserId,
        Type: "Ban",
      };
      const Result = await MessageSend(T, "Admin", interaction);
      if (Result == true) {
        BanDataStore.SetAsync(UserId.toString(), {
          Reason: Reason,
          Length: banTime,
          Moderator: Mod,
        }).then(async (Result) => {
          const Data = await GET(
            "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
              UserId.toString() +
              "&size=420x420&format=Png&isCircular=false"
          );
          const Embed = new EmbedBuilder()
            .setTitle("Ban")
            .setColor("#00ff00")
            .setDescription(`✅  Banned ${User} (ID: ${UserId})`)
            .addFields({ name: "Reason", value: Reason, inline: true })
            .setThumbnail(Data.data[0].imageUrl);
          interaction.reply({ embeds: [Embed] });
        });
      }
    }
  },
};
