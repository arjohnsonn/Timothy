const dotenv = require("dotenv");
dotenv.config();

const fetch = require("node-fetch");
const {
  UNIVERSE_ID,
  API_KEY,
  BANSTORE_KEY,
  CLIENT_ID,
  PLAYERDATA_KEY,
  TESTAPI_KEY,
  TESTUNIVERSE_ID,
} = process.env;
const { OpenCloud, MessagingService } = require("rbxcloud");
const noblox = require("noblox.js");

const { MessageSend } = require("../../Modules/MessageSend");

OpenCloud.Configure({
  MessagingService: TESTAPI_KEY,
  UniverseId: TESTUNIVERSE_ID, // You can get the UniverseId from the Asset explorer
});

const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const TimothyAdmin = ["1057031499544793138"];

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
      option.setName("message").setDescription("Message").setRequired(true)
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

    if (!Reason) return;

    var T = {
      Type: "Announcement",
      Message: Reason,
      Moderator: `By ${interaction.user.username} (${interaction.member.roles.highest.name})`,
      AnnType: "Global",
    };

    const Result = await MessageSend(
      T,
      "Admin",
      interaction,
      Reason,
      "Global Announcement"
    );
    if (Result === true) {
      const Embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("Money")
        .setDescription(
          `✅ Successfully set ${Data.Username}'s cash to ${Data.Amount}.\nTo prevent data loss, this may take a few seconds...`
        )
        .addFields();
      return interaction.reply({
        embeds: [Embed],
      });
    }
  },
};
