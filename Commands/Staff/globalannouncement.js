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

const HeadAdminRole = "800513206006054962";

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
    .setName("globalannouncement")
    .setDescription("Create a global announcement for all active servers")
    .addStringOption((option) =>
      option.setName("message").setDescription("Message")
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
    let Reason = interaction.options.getString("message");

    if (Id) {
      Id = Id.toString();
    }

    if (!Reason) return;

    var T = {
      Type: "Announcement",
      Message: Reason,
      Moderator: interaction.user.username,
      AnnType: "Global",
    };
    T = JSON.stringify(T);

    MessagingService.PublishAsync("Admin", T);

    getJSON(
      "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" +
        Id +
        "&size=420x420&format=Png&isCircular=false"
    )
      .then((data) => {
        const Embed = new EmbedBuilder()
          .setTitle("Global Announcement")
          .setColor("#00ff00")
          .setDescription(`✅ Sent Global Announcement`)
          .addFields({ name: "Message", value: Reason })
          .setThumbnail(data.data[0].imageUrl);
        interaction.reply({ embeds: [Embed] });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
