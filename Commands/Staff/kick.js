const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Role = "797710521578684467"; // ADMIN
const { Eligible } = require("../../Modules/Eligible");
const { GetPlayer } = require("../../Modules/GetPlayer");
var { MessageSend } = require("../../Modules/MessageSend");
const { GET } = require("../../Modules/GET");
const { Log } = require("../../Modules/Log");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick players from the game")
    .addStringOption((option) =>
      option.setName("username").setDescription("Username of Player")
    )
    .addIntegerOption((option) =>
      option.setName("id").setDescription("User ID of player")
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for kick, valid reasons only.")
    )
    .addBooleanOption((option) =>
      option
        .setName("anonymous")
        .setDescription(
          "Show your username in the kick message, defaults to false"
        )
    ),

  Refresh: function Refresh() {
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
    let Reason = interaction.options.getString("reason") || "unspecified";
    let Mod = interaction.options.getBoolean("anonymous");

    if (Id) {
      Id = Id.toString();
    }

    if (Mod == false) {
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

    const { UserId, User } = await GetPlayer(Id || Username);
    if (UserId) {
      let messageData = {
        Moderator: Mod,
        Reason: Reason,
        Player: UserId,
        Type: "Kick",
      };

      const Result = await MessageSend(messageData, "Admin", interaction);
      if (Result == true) {
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
          .setTitle("Kick")
          .setColor("#00ff00")
          .setDescription(`✅  Kicked ${User} (ID: ${UserId})`)
          .addFields({ name: "Reason", value: Reason, inline: true })
          .setThumbnail(Data);
        interaction.reply({ embeds: [Embed] });
      }
    }
  },
};
