const { PlayerDataStore } = require("./DataStores");

module.exports.SetPlayerData = function SetPlayerData(UserId, Data) {
  PlayerDataStore.SetAsync(UserId.toString(), Data).then((Result) => {
    return true;
  });
};