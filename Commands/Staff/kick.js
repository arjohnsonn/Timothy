const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Role = "800513206006054962";
const { Eligible } = require("../../Modules/Eligible");
const { GetPlayer } = require("../../Modules/GetPlayer");
const { MessageSend } = require("../../Modules/MessageSend");
const { GET } = require("../../Modules/GET");
const { Log } = require("../../Modules/Log");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick players from the Lawcountry game")
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
    let Mod = interaction.options.getBoolean("anonymous");

    if (Id) {
      Id = Id.toString();
    }

    if (!Reason) {
      Reason = "unspecified";
    }

    if (!Mod) {
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
      var T = {
        Moderator: Mod,
        Reason: Reason,
        Player: UserId,
        Type: "Kick",
      };

      const Result = await MessageSend(T, "Admin", interaction);
      if (Result == true) {
        const Data = await GET(
          "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
            UserId.toString() +
            "&size=420x420&format=Png&isCircular=false"
        );

        const Embed = new EmbedBuilder()
          .setTitle("Kick")
          .setColor("#00ff00")
          .setDescription(`✅  Kicked ${User} (ID: ${UserId})`)
          .addFields({ name: "Reason", value: Reason, inline: true })
          .setThumbnail(Data.data[0].imageUrl);
        interaction.reply({ embeds: [Embed] });
      }
    }
  },
};
