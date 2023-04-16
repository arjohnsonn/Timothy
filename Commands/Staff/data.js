const dotenv = require("dotenv");
dotenv.config();

const { MessageSend } = require("../../Modules/MessageSend");
const fetch = require("node-fetch");
const { API_KEY, UNIVERSE_ID, PLAYERDATA_KEY } = process.env;
const { OpenCloud, DataStoreService } = require("rbxcloud");
const noblox = require("noblox.js");

OpenCloud.Configure({
  MessagingService: API_KEY,
  DataStoreService: API_KEY, // This is an API key for DataStoreService
  UniverseId: UNIVERSE_ID, // You can get the UniverseId from the Asset explorer
});
const PlayerDataStore = DataStoreService.GetDataStore(PLAYERDATA_KEY);

const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  EmbedBuilder,
} = require("discord.js");

const SeniorAdminRole = "1016704731076378744";
const HeadAdminRole = "800513206006054962";
const BoDRole = "1057031499544793138";

const GuestPass = [
  "707632091168374866",
  "529310576803840031",
  "588255514878672907",
];

const TimothyAdmin = [HeadAdminRole, BoDRole];

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
    .filter(Boolean)
    .join(":");
}

const getJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok)
    // check if response worked (no 404 errors etc...)
    throw new Error(response.statusText);

  const data = response.json(); // get JSON from the response
  return data; // returns a promise, which resolves to this data value
};

const formatter = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "USD",
});

function ReplySuccess(interaction, Success, Data, Edit) {
  if (Success === true) {
    const Embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(
        `✅  Successfully set ${Data.Username}'s cash to ${Data.Amount}`
      );

    interaction.reply({ embeds: [Embed] });
  } else {
    const Embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setDescription("❌  Error setting cash");

    interaction.reply({ embeds: [Embed], ephemeral: true });
  }
}

function formatNum(str) {
  if (str.length == 1) {
    return "0" + str;
  } else return str;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("data")
    .setDescription("Manage data for players")
    .addSubcommandGroup(
      (group) =>
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
      /* .addSubcommand((subcommand) =>
          subcommand
            .setName("level")
            .setDescription("Set level for team to player")
            .addStringOption((option) =>
              option
                .setName("team")
                .setDescription("Select team to set level to")
                .setRequired(true)
                .addChoices(
                  { name: "SLFD", value: "slfd" },
                  { name: "LCSO", value: "slfd" }
                )
            )
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription("Sets level for team to player")
                .setRequired(true)
            )
            .addStringOption((option) =>
              option.setName("username").setDescription("Username of Player")
            )
            .addIntegerOption((option) =>
              option.setName("id").setDescription("User ID of player")
            )
        )*/
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
    const LogEmbed = new EmbedBuilder()
      .setColor("#ffffff")
      .setTitle(interaction.user.username)
      .setThumbnail(
        interaction.user.displayAvatarURL({ size: 1024, dynamic: true })
      )
      .setDescription("/" + interaction.commandName);

    interaction.client.channels.cache
      .get("1019434063653765201")
      .send({ embeds: [LogEmbed] });

    var HasTimothyAdmin = false;
    TimothyAdmin.forEach((role) => {
      if (interaction.member.roles.cache.has(role)) {
        HasTimothyAdmin = true;
      }
    });

    var Bypass = false;
    if (interaction.user.id === "343875291665399818") {
      Bypass = true;
      HasTimothyAdmin = true;
    }

    if (Bypass === false) {
      if (HasTimothyAdmin === false) {
        if (!GuestPass.includes(interaction.user.id)) {
          const Embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(
              "❌  You do not have permission to run this command!"
            );

          interaction.reply({ embeds: [Embed], ephemeral: true });
          return;
        }
      }
    }

    if (HasTimothyAdmin === false) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  You do not have permission to run this command!");

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }

    // Command

    const Username = interaction.options.getString("username");
    let Id = interaction.options.getInteger("id");

    var DataAction = interaction.options.getSubcommandGroup();
    var Type = interaction.options.getSubcommand();

    if (Id) {
      Id = Id.toString();
    }

    if (!Id && !Username) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  Please specify type of player identification!");

      interaction.reply({ embeds: [Embed] });
    }

    if (Id) {
      try {
        const Name = await noblox.getUsernameFromId(Id);
        if (Name !== null) {
          PlayerDataStore.GetAsync(Id)
            .then(([data]) => {
              let PlrData;
              if (!data || data === null) {
                const Embed = new EmbedBuilder()
                  .setColor("#ff0000")
                  .setDescription("❌  Player data does not exist!");

                interaction.reply({ embeds: [Embed] });
                return;
              } else {
                PlrData = data.Data;
              }

              if (DataAction === "set") {
                if (Type === "money") {
                  getJSON(`https://api.roblox.com/users/${Id}/onlinestatus/`)
                    .then((status) => {
                      const Amount = interaction.options.getInteger("amount");
                      data["General"]["Cash"] = Amount;

                      const Online = status["IsOnline"];

                      if (Online) {
                        MessageSend(
                          `${interaction.user.name}_ChangedData_${Id}_{SetMoney-${Amount}}`,
                          "T",
                          interaction,
                          {
                            Username: Name,
                            Amount: formatter.format(Amount).slice(0, -3),
                          },
                          "setmoney"
                        )
                          .then(() => {
                            console.log("Published MessagingService");
                            setTimeout(function () {
                              PlayerDataStore.SetAsync(Id, data)
                                .then(() => {
                                  console.log(
                                    `Saved ${Name}'s Data Successfully`
                                  );
                                  console.log("Player is online");
                                })
                                .catch((err) => {
                                  console.log(err);
                                  ReplySuccess(interaction, false);
                                });
                            }, 4000);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      } else {
                        PlayerDataStore.SetAsync(Id, data)
                          .then(() => {
                            console.log(`Saved ${Name}'s Data Successfully`);
                            console.log("Player is offline");
                            ReplySuccess(interaction, true, {
                              Username: Name,
                              Amount: formatter.format(Amount).slice(0, -3),
                            });
                          })
                          .catch((err) => {
                            console.log(err);
                            ReplySuccess(interaction, false);
                          });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      ReplySuccess(interaction, false);
                    });
                }
              } else if (DataAction === "get") {
                if (Type === "general") {
                  function GetTime(WantedTime) {
                    if (WantedTime.toString() === "0") {
                      return "N/A";
                    } else {
                      return formatTime(Number(WantedTime)).toString();
                    }
                  }

                  getJSON(
                    "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                      Id +
                      "&size=420x420&format=Png&isCircular=false"
                  )
                    .then((data) => {
                      const DateJoined = new Date(
                        Number(PlrData["Misc"]["FirstJoin"]) * 1000
                      );

                      const Embed = new EmbedBuilder()
                        .setTitle(`Player Data: ${Name} (${Id.toString()})`)
                        .setColor("#ffffff")
                        .setDescription("> *General Data*")
                        .addFields(
                          {
                            name: "Money",
                            value: formatter
                              .format(Number(PlrData["General"]["Cash"]))
                              .slice(0, -3),
                            inline: true,
                          },
                          {
                            name: "Wanted Time",
                            value: GetTime(
                              PlrData["Wanted"]["Wanted"]
                            ).toString(),
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
                            value: `<t:${Number(
                              PlrData["Logs"]["LastJoined"]
                            )}:F>`,

                            inline: true,
                          }
                        )
                        .setThumbnail(data.data[0].imageUrl);
                      interaction.reply({ embeds: [Embed] });
                    })
                    .catch((err) => {
                      console.log(err);
                      const Embed = new EmbedBuilder()
                        .setColor("#ff0000")
                        .setDescription(
                          "❌ An error has occured! Please try again"
                        );

                      interaction.reply({ embeds: [Embed], ephemeral: true });
                    });
                }
              }
            })
            .catch((err) => {
              console.log(err);
              const Embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setDescription("❌ An error has occured! Check logs");

              interaction.reply({ embeds: [Embed], ephemeral: true });
            });
        } else {
          const Embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription("❌ Player data does not exist!");

          interaction.reply({ embeds: [Embed], ephemeral: true });
        }
      } catch {
        const Embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription("❌  Player does not exist!");

        interaction.reply({ embeds: [Embed], ephemeral: true });
      }
    } else if (Username) {
      try {
        const PlrId = await noblox.getIdFromUsername(Username);
        if (PlrId !== null) {
          const Id = Number(PlrId);
          const Name = Username;
          PlayerDataStore.GetAsync(PlrId)
            .then(([data]) => {
              let PlrData;
              if (!data || data === null) {
                const Embed = new EmbedBuilder()
                  .setColor("#ff0000")
                  .setDescription("❌  Player data does not exist!");

                interaction.reply({ embeds: [Embed] });
                return;
              } else {
                PlrData = data.Data;
              }

              if (DataAction === "set") {
                if (Type === "money") {
                  getJSON(`https://api.roblox.com/users/${Id}/onlinestatus/`)
                    .then((status) => {
                      const Amount = interaction.options.getInteger("amount");
                      data["General"]["Cash"] = Amount;

                      const Online = status["IsOnline"];

                      if (Online) {
                        MessageSend(
                          `${interaction.user.name}_ChangedData_${Id}_{SetMoney-${Amount}}`,
                          "T",
                          interaction,
                          {
                            Username: Name,
                            Amount: formatter.format(Amount).slice(0, -3),
                          },
                          "setmoney"
                        )
                          .then(() => {
                            console.log("Published MessagingService");
                          })
                          .catch((err) => {
                            console.log(err);
                          });

                        setTimeout(function () {
                          PlayerDataStore.SetAsync(Id, data)
                            .then(() => {
                              console.log(`Saved ${Name}'s Data Successfully`);
                              console.log("Player is online");
                            })
                            .catch((err) => {
                              console.log(err);
                              ReplySuccess(interaction, false);
                            });
                        }, 4000);
                      } else {
                        PlayerDataStore.SetAsync(Id, data)
                          .then(() => {
                            console.log(`Saved ${Name}'s Data Successfully`);
                            console.log("Player is offline");
                            ReplySuccess(interaction, true, {
                              Username: Name,
                              Amount: formatter.format(Amount).slice(0, -3),
                            });
                          })
                          .catch((err) => {
                            console.log(err);
                            ReplySuccess(interaction, false);
                          });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      ReplySuccess(interaction, false);
                    });
                }
              } else if (DataAction === "get") {
                if (Type === "general") {
                  function GetTime(WantedTime) {
                    if (WantedTime.toString() === "0") {
                      return "N/A";
                    } else {
                      return formatTime(Number(WantedTime)).toString();
                    }
                  }

                  getJSON(
                    "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                      Id +
                      "&size=420x420&format=Png&isCircular=false"
                  )
                    .then((data) => {
                      const DateJoined = new Date(
                        Number(PlrData["Misc"]["FirstJoin"]) * 1000
                      );
                      const LastJoined = new Date(
                        Number(PlrData["Logs"]["LastJoined"]) * 1000
                      );
                      const Embed = new EmbedBuilder()
                        .setTitle(`Player Data: ${Name} (${Id.toString()})`)
                        .setColor("#ffffff")
                        .setDescription("> *General Data*")
                        .addFields(
                          {
                            name: "Money",
                            value: formatter
                              .format(Number(PlrData["General"]["Cash"]))
                              .slice(0, -3),
                            inline: true,
                          },
                          {
                            name: "Wanted Time",
                            value: GetTime(
                              PlrData["Wanted"]["Wanted"]
                            ).toString(),
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
                            value:
                              (LastJoined.getMonth() + 1).toString() +
                              "/" +
                              LastJoined.getDate().toString() +
                              "/" +
                              LastJoined.getFullYear().toString().slice(2) +
                              ", " +
                              formatNum(LastJoined.getHours().toString()) +
                              ":" +
                              LastJoined.getMinutes().toString() +
                              ":" +
                              formatNum(LastJoined.getSeconds().toString()),

                            inline: true,
                          }
                        )
                        .setThumbnail(data.data[0].imageUrl);
                      interaction.reply({ embeds: [Embed] });
                    })
                    .catch((err) => {
                      console.log(err);
                      const Embed = new EmbedBuilder()
                        .setColor("#ff0000")
                        .setDescription(
                          "❌ An error has occured! Please try again"
                        );

                      interaction.reply({ embeds: [Embed], ephemeral: true });
                    });
                }
              }
            })
            .catch((err) => {
              console.log(err);
              ReplySuccess(interaction, false);
            });
        } else {
          const Embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription("❌  Player does not exist!");

          interaction.reply({ embeds: [Embed], ephemeral: true });
        }
      } catch {
        const Embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription("❌  Player does not exist!");

        interaction.reply({ embeds: [Embed], ephemeral: true });
      }
    }
  },
};
