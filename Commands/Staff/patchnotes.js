const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("patchnotes")
    .setDescription("Send an embed for the latest patch notes!")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription(
          "This should already be formatted from a raw discord message, with ; breaking lines."
        )
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("forum")
        .setDescription(
          "Select the forum post that you want to send this message to."
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Category of patch note")
        .addChoices(
          { name: "Intro", value: "intro" },
          { name: "Systems", value: "systems" },
          { name: "Map", value: "map" },
          { name: "Gameplay", value: "gameplay" },
          { name: "Vehicle", value: "vehicle" },
          { name: "Quality of Life", value: "quality" },
          { name: "Bug Fixes", value: "bugfixes" },
          { name: "Everything", value: "everything" }
        )
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    if (
      interaction.member.id !== "287805833692053513" &&
      !interaction.member.roles.cache.has("1046499539764396113")
    ) {
      if (!interaction.member.id === "343875291665399818") {
        const Embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription(
            "❌  You do not have permission to run this command!"
          );

        interaction.reply({ embeds: [Embed], ephemeral: true });
        return;
      }
    }

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

    const Text = interaction.options.getString("text");
    const SendText = Text.replace(/;/g, "\n");
    const Channel = interaction.options.getChannel("forum");
    const Category = interaction.options.getString("category");

    if (Category === "everything") {
      const Embed = new EmbedBuilder()
        .setTitle("Patch Notes")
        .setDescription(SendText)
        .setColor("#ffffff")
        .setTimestamp();

      interaction.client.channels.cache
        .get(Channel.id)
        .send({ embeds: [Embed] });
      interaction.reply({ content: "Sent!", ephemeral: true });
    } else {
      const Embed = new EmbedBuilder().setDescription(SendText);
      if (Category === "intro") {
        Embed.setTitle("Patch Notes");
        Embed.setColor("#ffffff");
        Embed.setThumbnail("https://i.imgur.com/FBCBDdG.png");
      } else if (Category === "systems") {
        Embed.setTitle("System Changes");
        Embed.setColor("#6f00ff");
        Embed.setThumbnail("https://i.imgur.com/prTfRgH.png");
      } else if (Category === "map") {
        Embed.setTitle("Map Changes");
        Embed.setColor("#21cf4c");
        Embed.setThumbnail("https://i.imgur.com/uZT7ykl.png");
      } else if (Category === "gameplay") {
        Embed.setTitle("Gameplay Changes");
        Embed.setColor("#15e637");
        Embed.setThumbnail("https://i.imgur.com/piuwdTG.png");
      } else if (Category === "vehicle") {
        Embed.setTitle("Vehicle Changes");
        Embed.setColor("#8a8a8a");
        Embed.setThumbnail("https://i.imgur.com/C4yy0Bo.png");
      } else if (Category === "quality") {
        Embed.setTitle("Quality of Life");
        Embed.setColor("#985be3");
        Embed.setThumbnail("https://i.imgur.com/bkkIOql.png");
      } else if (Category === "bugfixes") {
        Embed.setTitle("Bug Fixes");
        Embed.setColor("#2b2b2b");
        Embed.setThumbnail("https://i.imgur.com/cgZNKsY.png");
      }

      interaction.client.channels.cache
        .get(Channel.id)
        .send({ embeds: [Embed] });
      interaction.reply({ content: "Sent!", ephemeral: true });
    }
  },
};
