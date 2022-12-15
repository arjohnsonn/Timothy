const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const fetch = require("node-fetch");
const {
  UNIVERSE_ID,
  API_KEY,
  BANSTORE_KEY,
  TESTAPI_KEY,
  TESTUNIVERSE_ID,
  SERVERDATA_KEY,
} = process.env;
const { OpenCloud, DataStoreService } = require("rbxcloud");
const noblox = require("noblox.js");

OpenCloud.Configure({
  DataStoreService: TESTAPI_KEY, // This is an API key for DataStoreService
  UniverseId: TESTUNIVERSE_ID, // You can get the UniverseId from the Asset explorer
});

const ServerDataStore = DataStoreService.GetDataStore(SERVERDATA_KEY);

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
    .setName("serverurl")
    .setDescription("Retrieve your direct private server URL here!")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription(
          "Input your private server's code (custom or generated, either way works) here."
        )
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const ServerCode = interaction.options.getString("code");
    if (!ServerCode) {
      const Embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("❌  Please enter a server code!");

      interaction.reply({ embeds: [Embed] });
      return;
    }

    if (interaction.channelId !== "739912817431412768") {
      if (
        !interaction.member.roles.cache.some(
          (role) =>
            role.id === "817669388337152060" &&
            !interaction.member.roles.cache.some(
              (role) => role.id === "817669388337152060"
            )
        )
      ) {
        const Embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription(
            "❌  Please run this command in <#739912817431412768>"
          );

        interaction.reply({ embeds: [Embed] });
        return;
      }
    }

    ServerDataStore.GetAsync(ServerCode)
      .then(([data]) => {
        let ServerData;

        if (!data || data === null) {
          const Embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription("❌  Server does not exist!");

          interaction.reply({ embeds: [Embed] });
          return;
        } else {
          ServerData = data;
        }

        const ServerIcon =
          ServerData.Expansions.Settings.EnhancedServer.ServerIcon;
        let IconURL;
        if (ServerIcon === "" || ServerIcon === null) {
          const Embed = new EmbedBuilder()
            .setColor("#ffffff")
            .setTitle("Server URL: " + ServerData.ServerName)
            .setDescription(
              `https://www.roblox.com/games/start?placeId=9320549541&launchData=${ServerCode}`
            );
          interaction.reply({ embeds: [Embed] });
        } else {
          getJSON(
            `https://thumbnails.roblox.com/v1/assets?assetIds=${ServerIcon}&returnPolicy=0&size=512x512&format=Png&isCircular=false`
          )
            .then((JSONData) => {
              IconURL = JSONData.data[0].imageUrl;
              const Embed = new EmbedBuilder()
                .setColor("#ffffff")
                .setTitle("Server URL: " + ServerData.ServerName)
                .setThumbnail(IconURL)
                .setDescription(
                  `https://www.roblox.com/games/start?placeId=9320549541&launchData=${ServerCode}`
                );
              interaction.reply({ embeds: [Embed] });
            })
            .catch((err) => {
              const Embed = new EmbedBuilder()
                .setColor("#ffffff")
                .setDescription(
                  "❌  A JSON request error has occurred. Please try again."
                );

              console.log(err);
              interaction.reply({ embeds: [Embed] });
            });
        }
      })
      .catch((err) => {});
  },
};
