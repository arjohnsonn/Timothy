var { PlayerDataStore } = require("./DataStores");

module.exports.SetPlayerData = function SetPlayerData(UserId, Data) {
  for (let value of Data.Data.Logs.Chat) {
    if (value == null) {
      continue;
    }

    value.Chat = value.Chat.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF])/g,
      ""
    ); // Replace emojis with nothing
  }

  return PlayerDataStore.SetAsync(UserId.toString(), Data)
    .then((Result) => {
      return true;
    })
    .catch((error) => {
      return (
        error + ": " + error.response.data.errorDetails[0].datastoreErrorCode
      );
    });
};

module.exports.Refresh = function Refresh() {
  PlayerDataStore = require("./DataStores").PlayerDataStore;
};
