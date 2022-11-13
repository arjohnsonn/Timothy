const dotenv = require("dotenv");
dotenv.config();

const { MessageSend } = require("../../Modules/MessageSend");
const fetch = require("node-fetch");
const { TESTAPI_KEY, TESTUNIVERSE_ID, PLAYERDATA_KEY, PLACE_ID } = process.env;
const { OpenCloud, DataStoreService, MessagingService } = require("rbxcloud");
const noblox = require("noblox.js");

OpenCloud.Configure({
  MessagingService: TESTAPI_KEY,
  DataStoreService: TESTAPI_KEY, // This is an API key for DataStoreService
  UniverseId: TESTUNIVERSE_ID, // You can get the UniverseId from the Asset explorer
});
const PlayerDataStore = DataStoreService.GetDataStore(PLAYERDATA_KEY);

const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  EmbedBuilder,
  Embed,
} = require("discord.js");

const SeniorAdminRole = "1016704731076378744";
const HeadAdminRole = "800513206006054962";
const BoDRole = "837979573522137091";

const TimothyAdmin = [HeadAdminRole, BoDRole];

const getJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok)
    // check if response worked (no 404 errors etc...)
    throw new Error(response.statusText);

  const data = response.json(); // get JSON from the response
  return data; // returns a promise, which resolves to this data value
};

function ReplySuccess(interaction, Success, Data, Edit) {
  if (Success === true) {
    const Embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(
        `✅  Successfully set ${Data.Username}'s cash to ${Data.Amount}`
      );

    if (Edit === false) {
      interaction.reply({ embeds: [Embed] });
    }
  } else {
    const Embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setDescription("❌  Error setting cash");

    interaction.reply({ embeds: [Embed], ephemeral: true });
  }
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
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
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
                          { Username: Name, Amount: Amount }
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
                              ReplySuccess(interaction, true, {
                                Username: Name,
                                Amount: Amount,
                              });
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
                              Amount: Amount,
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
              }
            })
            .catch((err) => {
              console.log(err);
              ReplySuccess(interaction, false);
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
                          { Username: Name, Amount: Amount }
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
                              ReplySuccess(interaction, true, {
                                Username: Name,
                                Amount: Amount,
                              });
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
                              Amount: Amount,
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
