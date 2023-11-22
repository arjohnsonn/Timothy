const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ThreadChannel,
} = require("discord.js");

const Role = "800513206006054962";
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");
const { GetPlayer } = require("../../Modules/GetPlayer");
var { GetPlayerData } = require("../../Modules/GetPlayerData");
var { MessageSend } = require("../../Modules/MessageSend");
const { GET } = require("../../Modules/GET");
const { POST } = require("../../Modules/POST");
var { SetPlayerData } = require("../../Modules/SetPlayerData");
var { GetServerData } = require("../../Modules/GetServerData");
var { SetServerData } = require("../../Modules/SetServerData");

const NonPlayerCmd = ["add expansion"];

const formatter = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "USD",
});

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);

  if (!(h <= 0)) {
    return `${h}h ${m}m ${s}s`;
  } else if (!(m <= 0)) {
    return `${m}m ${s}s`;
  } else {
    return `${s}s`;
  }
  /*return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
    .filter(Boolean)
    .join(":");*/
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("data")
    .setDescription("Manage data for players")
    .addSubcommandGroup((group) =>
      group
        .setName("set")
        .setDescription("Sets data to player")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("money")
            .setDescription("Set money to player")
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription("Set amount of cash to player")
                .setRequired(true)
            )
            .addStringOption((option) =>
              option.setName("username").setDescription("Username of Player")
            )
            .addIntegerOption((option) =>
              option.setName("id").setDescription("User ID of player")
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("add")
        .setDescription("Adds data to player")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("money")
            .setDescription("Set money to player")
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription("Set amount of cash to player")
                .setRequired(true)
            )
            .addStringOption((option) =>
              option.setName("username").setDescription("Username of Player")
            )
            .addIntegerOption((option) =>
              option.setName("id").setDescription("User ID of player")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("expansion")
            .setDescription("Grant an expansion to a players' server")
            .addStringOption((option) =>
              option
                .setName("code")
                .setDescription("Server Code for the server")
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("expansion")
                .setDescription("The expansion")
                .setRequired(true)
                .addChoices(
                  { name: "EnhancedServer", value: "enhancedserver" },
                  { name: "Roleplay+", value: "roleplayplus" },
                  { name: "Customization", value: "customization" }
                )
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("get")
        .setDescription("Gets data of player")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("general")
            .setDescription("Retrives general player data")
            .addStringOption((option) =>
              option.setName("username").setDescription("Username of Player")
            )
            .addIntegerOption((option) =>
              option.setName("id").setDescription("User ID of player")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("xp")
            .setDescription("Retrives XP player data")
            .addStringOption((option) =>
              option.setName("username").setDescription("Username of Player")
            )
            .addIntegerOption((option) =>
              option.setName("id").setDescription("User ID of player")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("playtime")
            .setDescription("Retrives playtime player data")
            .addStringOption((option) =>
              option.setName("username").setDescription("Username of Player")
            )
            .addIntegerOption((option) =>
              option.setName("id").setDescription("User ID of player")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("servers")
            .setDescription("Retrives servers")
            .addStringOption((option) =>
              option.setName("username").setDescription("Username of Player")
            )
            .addIntegerOption((option) =>
              option.setName("id").setDescription("User ID of player")
            )
        )
    ),

  Refresh: function Refresh() {
    GetPlayerData = require("../../Modules/GetPlayerData").GetPlayerData;
    MessageSend = require("../../Modules/MessageSend").MessageSend;
    SetPlayerData = require("../../Modules/SetPlayerData").SetPlayerData;
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

    var DataAction = interaction.options.getSubcommandGroup();
    var Type = interaction.options.getSubcommand();

    if (NonPlayerCmd.includes(`${DataAction} ${Type}`)) {
      if (DataAction == "add") {
        if (Type == "expansion") {
          const Code = interaction.options.getString("code");
          var RawExpansion = interaction.options.getString("expansion");
          var Expansion;

          switch (RawExpansion) {
            case "enhancedserver":
              Expansion = "EnhancedServer";
              break;
            case "roleplayplus":
              Expansion = "RoleplayPlus";
              break;
            case "customization":
              Expansion = "Customization";
              break;
          }

          const ServerData = await GetServerData(Code);
          if (ServerData) {
            if (
              ServerData.Expansions &&
              ServerData.Expansions.Purchased[Expansion] != null
            ) {
              ServerData.Expansions.Purchased[Expansion] = true;

              SetServerData(Code, Object.assign({}, ServerData));

              await MessageSend(
                {
                  Type: "Expansion",
                  Expansion: Expansion,
                },
                Code
              );

              const Embed = new EmbedBuilder()
                .setColor("#00ff00")
                .setTitle("Expansion Grant")
                .setDescription(
                  `✅ Successfully granted ${Code} with the ${Expansion} expansion`
                )
                .addFields();
              interaction.reply({
                embeds: [Embed],
              });
            }
          }
        }
      }
    } else {
      if (!Id && !Username) {
        const Embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription("❌  Please specify type of player identification!");

        interaction.reply({ embeds: [Embed] });
        return;
      }

      const { UserId, User } = await GetPlayer(Id || Username, interaction);

      if (UserId) {
        const PlayerData = await GetPlayerData(UserId, interaction);
        if (!PlayerData) {
          return;
        }

        if (DataAction == "set") {
          if (Type == "money") {
            const PresenceData = await POST(
              "https://presence.roblox.com/v1/presence/users",
              {
                userIds: [UserId],
              }
            );

            const Amount = interaction.options.getInteger("amount");
            PlayerData.Data.General.Cash = Amount;

            if (PresenceData.userPresences[0].userPresenceType == 0) {
              // OFFLINE
              SetPlayerData(UserId, PlayerData);

              const UserData = await GET(
                "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                  UserId.toString() +
                  "&size=420x420&format=Png&isCircular=false"
              );

              const Embed = new EmbedBuilder()
                .setTitle("Set Money")
                .setColor("#00ff00")
                .setDescription(
                  `✅  Successfully set ${User}'s money to ${formatter
                    .format(Amount)
                    .slice(0, -3)}`
                )
                .setThumbnail(UserData.data[0].imageUrl);
              interaction.reply({ embeds: [Embed] });
            } else {
              var T = {
                Type: "Money",
                Player: UserId,
                Amount: Amount,
              };

              const Result = await MessageSend(T, "Admin", interaction);
              if (Result == true) {
                const UserData = await GET(
                  "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                    UserId.toString() +
                    "&size=420x420&format=Png&isCircular=false"
                );

                if (PlayerData.MetaData) {
                  delete PlayerData.MetaData;
                }

                const Embed = new EmbedBuilder()
                  .setTitle("Set Money")
                  .setColor("#00ff00")
                  .setDescription(
                    `✅  Successfully set ${User}'s money to ${formatter
                      .format(Amount)
                      .slice(0, -3)}`
                  )
                  .setThumbnail(UserData.data[0].imageUrl);

                SetPlayerData(UserId, PlayerData);

                interaction.reply({ embeds: [Embed] });
              }
            }
          }
        } else if (DataAction == "get") {
          if (Type == "general") {
            function GetTime(WantedTime) {
              if (WantedTime.toString() === "0") {
                return "N/A";
              } else {
                return formatTime(Number(WantedTime)).toString();
              }
            }

            const Data = await GET(
              "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                UserId +
                "&size=420x420&format=Png&isCircular=false"
            );

            const Embed = new EmbedBuilder()
              .setTitle(`Player Data: ${User} (${UserId.toString()})`)
              .setColor("#ffffff")
              .setDescription("> *General Data*")
              .addFields(
                {
                  name: "Money",
                  value: formatter
                    .format(Number(PlayerData.Data["General"]["Cash"]))
                    .slice(0, -3),
                  inline: true,
                },
                {
                  name: "Wanted Time",
                  value: GetTime(
                    PlayerData.Data["Wanted"]["Wanted"]
                  ).toString(),
                  inline: true,
                },
                {
                  name: "First Joined",
                  value: `<t:${Number(PlayerData.Data.Misc["FirstJoin"])}:F>`,
                  inline: true,
                },
                {
                  name: "Last Joined",
                  value: `<t:${Number(
                    PlayerData.Data["Logs"]["LastJoined"]
                  )}:F>`,

                  inline: true,
                }
              )
              .setThumbnail(Data.data[0].imageUrl);
            interaction.reply({ embeds: [Embed] });
          } else if (Type == "xp") {
            const Data = await GET(
              "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                UserId +
                "&size=420x420&format=Png&isCircular=false"
            );
            const Embed = new EmbedBuilder()
              .setTitle(`Player Data: ${User} (${UserId.toString()})`)
              .setColor("#ffffff")
              .setDescription("> *XP Data*")
              .addFields(
                {
                  name: "SLPD",
                  value: PlayerData.Data.XP.SLPD.toString(),
                  inline: true,
                },
                {
                  name: "SLFD",
                  value: PlayerData.Data.XP.SLFD.toString(),
                  inline: true,
                },
                {
                  name: "LCDOT",
                  value: PlayerData.Data.XP.LCDOT.toString(),
                  inline: true,
                },

                {
                  name: "LCSO",
                  value: PlayerData.Data.XP.LCSO.toString(),
                  inline: true,
                },
                {
                  name: "LCEMS",
                  value: PlayerData.Data.XP.LCEMS.toString(),
                  inline: true,
                }
              )
              .setThumbnail(Data.data[0].imageUrl);
            console.log("here");
            interaction.reply({ embeds: [Embed] });
          } else if (Type == "playtime") {
            const Data = await GET(
              "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                UserId +
                "&size=420x420&format=Png&isCircular=false"
            );

            const AllTime =
              PlayerData.Data.General.Playtime.CIVILIAN +
              PlayerData.Data.General.Playtime.SLPD +
              PlayerData.Data.General.Playtime.LCDOT;
            const Embed = new EmbedBuilder()
              .setTitle(`Player Data: ${User} (${UserId.toString()})`)
              .setColor("#ffffff")
              .setDescription(
                "> *Playtime Data*\n\n**ALL TIME:** " +
                  formatTime(AllTime).toString()
              )
              .addFields(
                {
                  name: "CIVILIAN",
                  value: formatTime(
                    PlayerData.Data.General.Playtime.CIVILIAN
                  ).toString(),
                  inline: true,
                },
                {
                  name: "SLPD",
                  value: formatTime(
                    PlayerData.Data.General.Playtime.SLPD
                  ).toString(),
                  inline: true,
                },
                {
                  name: "SLFD",
                  value: formatTime(
                    PlayerData.Data.General.Playtime.SLFD
                  ).toString(),
                  inline: true,
                },
                {
                  name: "LCDOT",
                  value: formatTime(
                    PlayerData.Data.General.Playtime.LCDOT
                  ).toString(),
                  inline: true,
                },
                {
                  name: "LCEMS",
                  value: formatTime(
                    PlayerData.Data.General.Playtime.LCEMS
                  ).toString(),
                  inline: true,
                }
              )
              .setThumbnail(Data.data[0].imageUrl);
            interaction.reply({ embeds: [Embed] });
          } else if (Type == "servers") {
            const Data = await GET(
              "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                UserId +
                "&size=420x420&format=Png&isCircular=false"
            );
            const Embed = new EmbedBuilder()
              .setTitle(`Player Data: ${User} (${UserId.toString()})`)
              .setColor("#ffffff")
              .addFields({
                name: "Server Codes",
                value: PlayerData.Data.Servers.toString(),
                inline: true,
              })
              .setThumbnail(Data.data[0].imageUrl);
            interaction.reply({ embeds: [Embed] });
          }
        } else if (DataAction == "add") {
          if (Type == "money") {
            const PresenceData = await POST(
              "https://presence.roblox.com/v1/presence/users",
              {
                userIds: [UserId],
              }
            );

            const Amount = interaction.options.getInteger("amount") || 0;
            PlayerData.Data.General.Cash =
              PlayerData.Data.General.Cash + Amount;

            if (PresenceData.userPresences[0].userPresenceType == 0) {
              // OFFLINE
              SetPlayerData(UserId, PlayerData);

              const UserData = await GET(
                "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                  UserId.toString() +
                  "&size=420x420&format=Png&isCircular=false"
              );

              const Embed = new EmbedBuilder()
                .setTitle("Add Money")
                .setColor("#00ff00")
                .setDescription(
                  `✅  Successfully added ${formatter
                    .format(Amount)
                    .slice(0, -3)} for ${User}`
                )
                .setThumbnail(UserData.data[0].imageUrl);
              interaction.reply({ embeds: [Embed] });
            } else {
              var T = {
                Type: "AddMoney",
                Player: UserId,
                Amount: Amount,
              };

              const Result = await MessageSend(T, "Admin", interaction);
              if (Result == true) {
                const UserData = await GET(
                  "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                    UserId.toString() +
                    "&size=420x420&format=Png&isCircular=false"
                );

                if (PlayerData.MetaData) {
                  delete PlayerData.MetaData;
                }

                const Embed = new EmbedBuilder()
                  .setTitle("Add Money")
                  .setColor("#00ff00")
                  .setDescription(
                    `✅  Successfully added ${formatter
                      .format(Amount)
                      .slice(0, -3)} for ${User}`
                  )
                  .setThumbnail(UserData.data[0].imageUrl);
                interaction.reply({ embeds: [Embed] });
              }
            }
          }
        }
      }
    }
  },
};
