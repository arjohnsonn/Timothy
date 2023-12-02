var { PlayerDataStore } = require("./DataStores");

module.exports.SetPlayerData = function SetPlayerData(UserId, Data) {
  if (Data && Data.Data && Data.Data.Logs && Data.Data.logs.Chat) {
    for (const [key, value] of Data.Data.Logs.Chat) {
      if (value.Chat.contains("#")) {
        delete Data.Logs.Chat[key];
      }
    }
  }

  PlayerDataStore.SetAsync(UserId.toString(), Data)
    .then((Result) => {
      return true;
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports.Refresh = function Refresh() {
  PlayerDataStore = require("./DataStores").PlayerDataStore;
};
