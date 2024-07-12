const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

const Database = require("../../Schemas/Points");
const Role = "797710521578684467"; // ADMIN
const { Eligible } = require("../../Modules/Eligible");
const { Log } = require("../../Modules/Log");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("managepoints")
    .setDescription("Manage user points through Timothy")
    .addUserOption((option) =>
      option

        .setName("user")
        .setDescription("Select the user you want to manage points for")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option

        .setName("action")
        .setDescription("Action you want to do with points")
        .setRequired(true)

        .addChoices(
          { name: "Add", value: "add" },
          { name: "Get", value: "get" },
          { name: "Set", value: "set" },
          { name: "Subtract", value: "subtract" }
        )
    )
    .addNumberOption((option) =>
      option
        .setName("value")
        .setDescription("Value for modifying the integer of points a user has")
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    if (Eligible(Role, interaction) == false) return;
    Log(interaction);

    const User = interaction.options.getUser("user");
    const Member = interaction.guild.members.cache.get(User.id);

    if (!Member) {
      const Embed = new EmbedBuilder()
        .setColor("#e0392d")
        .setDescription("❌ No member found in this server. Please try again.");

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }
    const Action = interaction.options.getString("action");
    const Value = interaction.options.getNumber("value");
    if (!Value && Value !== 0) {
      if (Action === "add" || Action === "subtract" || Action === "set") {
        const Embed = new EmbedBuilder()
          .setColor("#e0392d")
          .setDescription("❌ Please enter a number value in the command!");

        interaction.reply({ embeds: [Embed], ephemeral: true });
        return;
      }
    }

    if (
      Member.roles.highest.comparePositionTo(interaction.member.roles.highest) >
      0
    ) {
      const Embed = new EmbedBuilder()
        .setColor("#e0392d")
        .setDescription(
          "❌ Unable to manage points to user as they above your rank"
        );

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }

    let userData = await Database.findOne({
      Guild: interaction.guild.id,
      User: Member.id,
    });

    if (!userData) {
      userData = await Database.create({
        Guild: interaction.guild.id,
        User: Member.id,
        Points: 0,
      });
    }

    const CurrentPoints = userData.Points;
    if (Action === "add") {
      userData.Points = CurrentPoints + Value;
    } else if (Action === "set") {
      userData.Points = Value;
    } else if (Action === "subtract") {
      userData.Points = CurrentPoints - Value;
      if (userData.Points < 0) {
        userData.Points = 0;
      }
    } else if (Action === "get") {
      let addition = userData.Points > 1 || userData.Points === 0 ? "s" : "";
      const Embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(
          `*${Member.user.username}* has **${userData.Points}** point${addition}`
        );
      interaction.reply({ embeds: [Embed] });
    }

    await userData.save();

    let addition = userData.Points > 1 || userData.Points === 0 ? "s" : "";
    if (Action === "add") {
      const Embed = new EmbedBuilder().setColor("#ffffff").setDescription(
        `✅ Successfully added **${Value}** point${addition} to ${Member.user.username}.
          \n*${Member.user.username}* now has **${userData.Points}** point${addition}`
      );

      interaction.reply({ embeds: [Embed] });
    } else if (Action === "set") {
      const Embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(
          `✅ Successfully set *${Member.user.username}*'s points to **${userData.Points}**`
        );

      interaction.reply({ embeds: [Embed] });
    } else if (Action === "subtract") {
      const Embed = new EmbedBuilder().setColor("#ffffff").setDescription(
        `✅ Successfully subtracted **${Value}** point${addition} to *${Member.user.username}*.
          \n*${Member.user.username}* now has **${userData.Points}** point${addition}`
      );
      interaction.reply({ embeds: [Embed] });
    }
  },
};
