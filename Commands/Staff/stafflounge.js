const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  EmbedBuilder,
} = require("discord.js");

const Role = "800513206006054962";
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stafflounge")
    .setDescription("Sets staff lounge voice chat to visible/invisible")
    .addStringOption((option) =>
      option

        .setName("value")
        .setDescription("Visible/invisible")
        .setRequired(true)
        .addChoices(
          { name: "Visible", value: "visible" },
          { name: "Invisible", value: "invisible" }
        )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    if (Eligible(Role, interaction) == false) return;

    Log(interaction);

    const Option = interaction.options.getString("value");
    if (Option == null) return;

    let Value;
    if (Option == "visible") {
      Value = true;
    } else if (Option == "invisible") {
      Value = false;
    }

    const Channel = interaction.client.channels.cache.get(
      "1056941663441916015"
    );

    Channel.permissionOverwrites.create(
      Channel.guild.roles.cache.get("822824831937413130"),
      { ViewChannel: Value, Stream: true, Connect: false, Speak: true }
    );

    const Embed = new EmbedBuilder()
      .setColor("#ffffff")
      .setDescription(
        `Successfully set Staff Lounge Visibility as **${Value}** ✅`
      );

    interaction.reply({ embeds: [Embed] });
  },
};
