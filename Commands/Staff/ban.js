const dotenv = require("dotenv");
dotenv.config();

const fetch = require("node-fetch");
const { UNIVERSE_ID, API_KEY, BANSTORE_KEY, CLIENT_ID, PLAYERDATA_KEY } =
  process.env;
const { OpenCloud, DataStoreService, MessagingService } = require("rbxcloud");
const noblox = require("noblox.js");

const { MessageSend } = require("../../Modules/MessageSend");

OpenCloud.Configure({
  MessagingService: API_KEY,
  DataStoreService: API_KEY, // This is an API key for DataStoreService
  UniverseId: UNIVERSE_ID, // You can get the UniverseId from the Asset explorer
});
const BanDatastore = DataStoreService.GetDataStore(BANSTORE_KEY);

const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const SeniorAdminRole = "1016704731076378744";
const HeadAdminRole = "800513206006054962";
const BoDRole = "1057031499544793138";

const TimothyAdmin = [SeniorAdminRole, HeadAdminRole, BoDRole];

const getJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok)
    // check if response worked (no 404 errors etc...)
    throw new Error(response.statusText);

  const data = response.json(); // get JSON from the response
  return data; // returns a promise, which resolves to this data value
};

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
    const Username = interaction.options.getString("username");
    let Id = interaction.options.getInteger("id");
    let Reason = interaction.options.getString("reason");
    const Length = interaction.options.getInteger("length");

    let banTime;
    if (Length) {
      banTime = Number(Date.now().toString().slice(0, -3)) + 86400 * Length;
    } else {
      banTime = "Infinite";
    }

    if (Id) {
      Id = Id.toString();
    }

    if (!Reason) {
      Reason = "unspecified";
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
          if (Reason) {
            BanDatastore.SetAsync(Id, Reason + ";;;" + banTime)
              .then((Result) => {
                MessageSend(
                  Username + "_BAN_" + Id + "_{" + Reason + "-" + banTime + "}",
                  "T",
                  interaction
                ).then(() => {
                  getJSON(
                    "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                      Id +
                      "&size=420x420&format=Png&isCircular=false"
                  )
                    .then((data) => {
                      var Duration;
                      if (banTime === "Infinite") {
                        Duration = "Infinite";
                      } else {
                        Duration = Length.toString() + " days";
                      }
                      const Embed = new EmbedBuilder()
                        .setTitle("Ban")
                        .setColor("#00ff00")
                        .setDescription(`✅  Banned ${Name} (ID: ${Id})`)
                        .addFields(
                          { name: "Reason", value: Reason, inline: true },
                          {
                            name: "Length",
                            value: Duration,
                            inline: true,
                          }
                        )
                        .setThumbnail(data.data[0].imageUrl);
                      interaction.reply({ embeds: [Embed] });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
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
    } else if (Username) {
      try {
        const PlrId = await noblox.getIdFromUsername(Username);
        if (PlrId !== null) {
          if (Reason) {
            BanDatastore.SetAsync(PlrId.toString(), Reason + ";;;" + banTime)
              .then((Result) => {
                MessageSend(
                  Username +
                    "_BAN_" +
                    PlrId.toString() +
                    "_{" +
                    Reason +
                    "-" +
                    banTime +
                    "}",
                  "T",
                  interaction
                ).then(() => {
                  getJSON(
                    "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                      PlrId.toString() +
                      "&size=420x420&format=Png&isCircular=false"
                  )
                    .then((data) => {
                      var Duration;
                      if (banTime === "Infinite") {
                        Duration = "Infinite";
                      } else {
                        Duration = Length.toString() + " days";
                      }
                      const Embed = new EmbedBuilder()
                        .setTitle("Ban")
                        .setColor("#00ff00")
                        .setDescription(`✅  Banned ${Username} (ID: ${PlrId})`)
                        .addFields(
                          { name: "Reason", value: Reason, inline: true },
                          {
                            name: "Length",
                            value: Duration,
                            inline: true,
                          }
                        )
                        .setThumbnail(data.data[0].imageUrl);
                      interaction.reply({ embeds: [Embed] });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
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
