const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Role = "1046503404769382532"; // ADMINISTRATION
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("closebug")
    .setDescription("Closes bug report")
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for closing the bug")
    )
    .addBooleanOption((option) =>
      option.setName("live").setDescription("Is this bug live?")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (Eligible(Role, interaction) == false) return;
    Log(interaction);

    const reason = interaction.options.getString("reason");
    const live = interaction.options.getBoolean("live");
    let isNormal = interaction.channelId == "1046864664203636908";
    let id;

    const thread = interaction.channel;
    if (!thread.isThread()) {
      return interaction.reply({
        content: "This command can only be used in a thread.",
        ephemeral: true,
      });
    } else if (thread.locked) {
      return interaction.reply({
        content: "This thread is already closed.",
        ephemeral: true,
      });
    }

    if (isNormal && live != null) {
      id = live ? "1292219360219365416" : "1292219407224803439";
    } else if (live != null) {
      id = live ? "1046873292520296530" : "1046873780477235280";
    }

    try {
      const Embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(
          "<:Developer:1067282725742051368> **This bug report has been closed for the following:**\n\n" +
            (reason != null ? reason : "Bug has been fixed")
        );

      interaction.reply({ embeds: [Embed] });

      setTimeout(async () => {
        const currentTags = thread.appliedTags;
        const filteredTags = currentTags.filter(
          (tag) =>
            tag !== "1347757288483721216" && tag !== "1149483448126419034"
        );
        if (id != null) {
          await thread.setAppliedTags([...filteredTags, id]);
        } else {
          await thread.setAppliedTags(filteredTags);
        }
        await thread.setLocked(true);
        await thread.setArchived(true);
      }, 1000);
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "There was an error while closing the bug.",
        ephemeral: true,
      });
    }
  },
};
