const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
} = require("discord.js");

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
    if (
      !interaction.member.roles.cache.has("800513206006054962") && // Head Admin
      !interaction.member.roles.cache.has("837979573522137091") && // BoD
      !interaction.member.roles.cache.has("1046499539764396113") && // Senior Dev
      !interaction.member.roles.cache.has("796650693825658891") // Publisher
    ) {
      const Embed = new EmbedBuilder()
        .setColor("#e0392d")
        .setDescription("❌ You do not have permission to use this command.");

      interaction.reply({ embeds: [Embed] });
      return;
    }

    const User = interaction.options.getUser("user");
    const Action = interaction.options.getString("action");

    const Value = interaction.options.getNumber("value");
    if (!Value) {
      const Embed = new EmbedBuilder()
        .setColor("#e0392d")
        .setDescription("❌ Please enter a number value in the command!");

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }

    if (
      User.roles.cache.has("1046499539764396113") ||
      User.roles.cache.has("837979573522137091")
    ) {
      const Embed = new EmbedBuilder()
        .setColor("#e0392d")
        .setDescription(
          "❌ Unable to add points to user as they are a HR member"
        );

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }

    let userData = await Database.findOne({
      Guild: msg.guild.id,
      User: User.id,
    });

    if (!userData) {
      userData = await Database.create({
        Guild: msg.guild.id,
        User: User.id,
        Points: 0,
      });
    }

    var addition = "";
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
      if (userData > 1) {
        addition = "s";
      }
      const Embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(
          `${User.username} has ${userData.Points} point${addition}`
        );

      interaction.reply({ embeds: [Embed] });
    }

    // TODO: ADD POINT THRESHOLD CHECK HERE

    await userData.save();

    if (Action === "add") {
      if (userData > 1) {
        addition = "s";
      }
      const Embed = new EmbedBuilder().setColor("#ffffff").setDescription(
        `✅ Successfully added ${Value} point${addition} to ${User.username}.
          \n${User.username} now has ${userData.Points}`
      );

      interaction.reply({ embeds: [Embed] });
    } else if (Action === "set") {
      const Embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(
          `✅ Successfully set ${User.username}'s points to ${userData.Points}`
        );

      interaction.reply({ embeds: [Embed] });
    } else if (Action === "subtract") {
      if (userData > 1) {
        addition = "s";
      }
      const Embed = new EmbedBuilder().setColor("#ffffff").setDescription(
        `✅ Successfully subtracted ${Value} point${addition} to ${User.username}.
          \n${User.username} now has ${userData.Points}`
      );
    }
  },
};
