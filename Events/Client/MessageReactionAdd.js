var { GetServerData } = require("../../Modules/GetServerData");
var { GetLiveryData } = require("../../Modules/GetLiveryData");
var { ServerDataStore } = require("../../Modules/DataStores");
var { SetLiveryData } = require("../../Modules/SetLiveryData");
var { SetServerData } = require("../../Modules/SetServerData");
var { MessageSend } = require("../../Modules/MessageSend");

module.exports = {
  name: "messageReactionAdd",
  Refresh: function Refresh() {
    GetServerData = require("../../Modules/GetServerData").GetServerData;
    GetLiveryData = require("../../Modules/GetLiveryData").GetLiveryData;
    ServerDataStore = require("../../Modules/DataStores").ServerDataStore;
    SetLiveryData = require("../../Modules/SetLiveryData").SetLiveryData;
    SetServerData = require("../../Modules/SetServerData").SetServerData;
    MessageSend = require("../../Modules/MessageSend").MessageSend;
  },
  async execute(reaction, user) {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
      // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Something went wrong when fetching the message:", error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }

    if (
      reaction.message.webhookId === "1126113581985960007" &&
      !user.bot === true
    ) {
      const Embed = reaction.message.embeds[0];
      const ServerCode = Embed.data.footer.text;
      let LiveryName;
      let Team;

      Embed.data.fields.forEach(function (Object) {
        if (Object.name === "Livery Name") {
          LiveryName = Object.value;
        } else if (Object.name === "Team") {
          Team = Object.value;
        }
      });

      var ServerData = await GetServerData(ServerCode);
      var LiveryStorage = await GetLiveryData(ServerCode);

      if (!ServerData) {
        console.log("No server data found!");
        return;
      }

      if (!LiveryStorage) {
        console.log("No livery storage found!");
        return;
      }

      const PendingLiveryData = LiveryStorage[LiveryName];
      if (!PendingLiveryData) {
        console.log("No pending livery data found!");
        return;
      }

      if (!Team) {
        console.log("No Team found!");
        return;
      }
      if (!LiveryName) {
        console.log("No LiveryName found!");
        return;
      }

      if (reaction.emoji.name === "✅") {
        console.log("Approved!");
        delete LiveryStorage[LiveryName];

        ServerData["Expansions"]["Settings"]["Customization"]["Liveries"][Team][
          LiveryName
        ] = PendingLiveryData;

        SetServerData(ServerCode, Object.assign({}, ServerData));
        SetLiveryData(ServerCode, LiveryStorage);

        await MessageSend("Update", ServerCode);

        reaction.message.reactions
          .removeAll()
          .catch((error) => console.log("Failed to clear reactions:", error));
        reaction.message.edit({
          embeds: [Embed],
          content: `✅ APPROVED BY ${user.username}`,
        });
      } else if (reaction.emoji.name === "❌") {
        console.log("Denied");
        delete LiveryStorage[LiveryName];

        SetLiveryData(ServerCode, LiveryStorage);
        reaction.message.reactions
          .removeAll()
          .catch((error) => console.log("Failed to clear reactions:", error));

        reaction.message.edit({
          embeds: [Embed],
          content: `❌ DENIED BY ${user.username}`,
        });
      }
    }
  },
};
