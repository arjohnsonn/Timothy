const { PlayerDataStore } = require("./DataStores");
const { EmbedBuilder } = require("discord.js");
module.exports.GetPlayerData = async function GetPlayerData(
  UserId,
  interaction
) {
  return await PlayerDataStore.GetAsync(UserId.toString()).then(([data]) => {
    let PlrData;
    if (!data || data === null) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  Player data does not exist!");

      interaction.reply({ embeds: [Embed], ephemeral: true });
      return;
    }
    PlrData = data;

    return PlrData;
  });
};
