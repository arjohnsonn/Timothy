const dotenv = require("dotenv");
dotenv.config();

const fetch = require("node-fetch");
const { UNIVERSE_ID, API_KEY, BANSTORE_KEY, CLIENT_ID, PLAYERDATA_KEY } =
  process.env;
const { OpenCloud, MessagingService } = require("rbxcloud");
const noblox = require("noblox.js");

OpenCloud.Configure({
  MessagingService: API_KEY,
  UniverseId: UNIVERSE_ID, // You can get the UniverseId from the Asset explorer
});

const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const SeniorAdminRole = "1016704731076378744";
const HeadAdminRole = "800513206006054962";
const BoDRole = "837979573522137091";

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
            MessagingService.PublishAsync("Kick", Name + "_{" + Reason + "}");

            getJSON(
              "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                Id +
                "&size=420x420&format=Png&isCircular=false"
            )
              .then((data) => {
                const Embed = new EmbedBuilder()
                  .setTitle("Kick")
                  .setColor("#00ff00")
                  .setDescription(`✅ Kicked ${Name} (ID: ${Id})`)
                  .addFields({ name: "Reason", value: Reason })
                  .setThumbnail(data.data[0].imageUrl);
                interaction.reply({ embeds: [Embed] });
              })
              .catch((error) => {
                console.log(error);
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
            MessagingService.PublishAsync("Kick", Name + "_{" + Reason + "}");

            getJSON(
              "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
                Id +
                "&size=420x420&format=Png&isCircular=false"
            )
              .then((data) => {
                const Embed = new EmbedBuilder()
                  .setTitle("Kick")
                  .setColor("#00ff00")
                  .setDescription(`✅ Kicked ${Username} (ID: ${Id})`)
                  .addFields({ name: "Reason", value: Reason })
                  .setThumbnail(data.data[0].imageUrl);

                interaction.reply({ embeds: [Embed] });
              })
              .catch((error) => {
                console.log(error);
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
