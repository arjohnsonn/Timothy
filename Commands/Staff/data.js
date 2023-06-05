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
const { POST } = require("../../Modules/POST");
const { SetPlayerData } = require("../../Modules/SetPlayerData");

const formatter = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "USD",
});

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
    .filter(Boolean)
    .join(":");
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

    var DataAction = interaction.options.getSubcommandGroup();
    var Type = interaction.options.getSubcommand();

    if (!Id && !Username) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  Please specify type of player identification!");

      interaction.reply({ embeds: [Embed] });
      return;
    }

    const { UserId, User } = await GetPlayer(Id || Username);
    if (UserId) {
      const PlayerData = await GetPlayerData(UserId, interaction);
      if (!PlayerData) {
        const Embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription("❌  Player data does not exist!");

        interaction.reply({ embeds: [Embed] });
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

              delete PlayerData.MetaData.ActiveSession;
              delete PlayerData.MetaData.ForceLoadSession;

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
          const DateJoined = new Date(
            Number(PlayerData.Data["Misc"]["FirstJoin"]) * 1000
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
                value: GetTime(PlayerData.Data["Wanted"]["Wanted"]).toString(),
                inline: true,
              },
              {
                name: "First Joined",
                value:
                  (DateJoined.getMonth() + 1).toString() +
                  "/" +
                  DateJoined.getDate().toString() +
                  "/" +
                  DateJoined.getFullYear().toString().slice(2),
                inline: true,
              },
              {
                name: "Last Joined",
                value: `<t:${Number(PlayerData.Data["Logs"]["LastJoined"])}:F>`,

                inline: true,
              }
            )
            .setThumbnail(Data.data[0].imageUrl);
          interaction.reply({ embeds: [Embed] });
        }
      } else if (DataAction == "add") {
        if (Type == "money") {
          const PlayerData = await GetPlayerData(UserId, interaction);
          if (!PlayerData) {
            const Embed = new EmbedBuilder()
              .setColor("#ff0000")
              .setDescription("❌  Player data does not exist!");

            interaction.reply({ embeds: [Embed] });
            return;
          }

          const PresenceData = await POST(
            "https://presence.roblox.com/v1/presence/users",
            {
              userIds: [UserId],
            }
          );

          const Amount = interaction.options.getInteger("amount") || 0;
          PlayerData.Data.General.Cash = PlayerData.Data.General.Cash + Amount;

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

              delete PlayerData.MetaData.ActiveSession;
              delete PlayerData.MetaData.ForceLoadSession;

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
  },
};
