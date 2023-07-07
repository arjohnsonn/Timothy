const { GetServerData } = require("../../Modules/GetServerData");
const { GetLiveryData } = require("../../Modules/GetLiveryData");
const { ServerDataStore } = require("../../Modules/DataStores");
const { SetLiveryData } = require("../../Modules/SetLiveryData");
const { MessageSend } = require("../../Modules/MessageSend");
const { type } = require("express/lib/response");

module.exports = {
  name: "messageReactionAdd",
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
        console.log(
          ServerData["Expansions"]["Settings"]["Customization"]["Liveries"]
        );
        console.log(
          ServerData["Expansions"]["Settings"]["Customization"]["Liveries"][
            Team
          ]
        );
        console.log(
          ServerData["Expansions"]["Settings"]["Customization"]["Liveries"][
            Team
          ][LiveryName]
        );
        console.log(PendingLiveryData);

        SetLiveryData(ServerCode, ServerData);
        SetLiveryData(ServerCode, LiveryStorage);

        await MessageSend("Update", ServerCode);

        reaction.message.delete();
      } else if (reaction.emoji.name === "❌") {
        console.log("Denied");
        delete LiveryStorage[LiveryName];

        SetLiveryData(ServerCode, LiveryStorage);
        reaction.message.delete();
      }
    }
  },
};
