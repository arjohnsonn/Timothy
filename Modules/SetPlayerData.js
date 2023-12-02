var { PlayerDataStore } = require("./DataStores");

module.exports.SetPlayerData = function SetPlayerData(UserId, Data) {
  for (let value of Data.Data.Logs.Chat) {
    if (value.Chat.includes("#")) {
      const Index = Data.Data.Logs.Chat.indexOf(value);
      delete Data.Data.Logs.Chat[Index];
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
