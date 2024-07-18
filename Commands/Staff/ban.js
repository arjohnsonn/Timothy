const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Role = "797710521578684467"; // ADMIN
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");
const { GetPlayer } = require("../../Modules/GetPlayer");
var { MessageSend } = require("../../Modules/MessageSend");
const { GET } = require("../../Modules/GET");
var { BanDataStore } = require("../../Modules/DataStores");
const RobloxBan = require("../../Modules/RobloxBan");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban players from the game")
    .addStringOption((option) =>
      option
        .setName("displayreason")
        .setDescription("Reason for ban, will be showed to the player")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("privatereason")
        .setDescription(
          "Reason for ban, only seen by staff so it can be more specifc"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("username").setDescription("Username of Player")
    )
    .addIntegerOption((option) =>
      option.setName("id").setDescription("User ID of player")
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
        .setName("excludealtaccounts")
        .setDescription(
          "Should this ban exclude alt account detection? Defaults to false"
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("showusername")
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
    let displayReason = interaction.options.getString("displayreason");
    let privateReason = interaction.options.getString("privatereason");
    const Length = interaction.options.getInteger("length");
    let Mod = interaction.options.getBoolean("showusername");
    let excludeAlts = interaction.options.getBoolean("excludealtaccounts");

    if (Id) {
      Id = Id.toString();
    }

    if (!displayReason) {
      Reason = "unspecified";
    }
    if (!privateReason) {
      privateReason = "unspecified";
    }
    if (!excludeAlts) {
      excludeAlts = false;
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

    const { UserId, User } = await GetPlayer(Id || Username, interaction);
    if (UserId) {
      let T = {
        Reason: displayReason,
        Moderator: Mod,
        Length: banTime,
        Player: UserId,
        Type: "Ban",
      };
      const Result = await MessageSend(T, "Admin", interaction);
      if (Result == true) {
        let Success = false;
        try {
          const { data: banData } = await RobloxBan(
            UserId,
            Length ? `${Length * 86400}s` : null,
            privateReason,
            displayReason,
            excludeAlts
          ); // ROBLOX API
          console.log(banData);
          if (banData != null) {
            Success = true;
          }
        } catch (e) {
          console.log(e);
        }

        let Success2 = false;
        BanDataStore.SetAsync(UserId.toString(), {
          Reason: displayReason,
          Length: banTime,
          Moderator: Mod,
        }).then(async (Result) => {
          Success2 = true;
        });

        let Data = await GET(
          "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
            UserId +
            "&size=420x420&format=Png&isCircular=false"
        );

        const data = Data.data[0].state;

        if (data.state == "Blocked") {
          Data = "https://i.imgur.com/91vsV4d.png";
        } else {
          Data = data.imageUrl;
        }

        const Embed = new EmbedBuilder()
          .setTitle("Ban")
          .setColor("#00ff00")
          .setDescription(`✅  Banned ${User} (ID: ${UserId})`)
          .addFields({
            name: "Reason",
            value: `${displayReason} (Staff Reason: ${privateReason})`,
            inline: true,
          })
          .setThumbnail(Data)
          .setFooter({
            text: Success
              ? "User has been Roblox API banned"
              : "Error Occurred: User has NOT been Roblox API banned" +
                " | " +
                Success2
              ? "User has been Roblox DS banned"
              : "Error Occurred: User has NOT been Roblox DS banned" +
                  " | " +
                  excludeAlts ==
                false
              ? `Alt Detection: ON`
              : "Alt Detection: OFF",
          });
        interaction.reply({ embeds: [Embed] });
      }
    }
  },
};
