const { ServerDataStore } = require("./DataStores");

const { EmbedBuilder } = require("discord.js");

module.exports.GetServerData = async function GetServerData(Input) {
  return await ServerDataStore.GetAsync(Input).then(([data]) => {
    let ServerData;
    if (!data || data === null) return;
    ServerData = data;

    return ServerData;
  });
};
