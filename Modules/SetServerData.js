const { ServerDataStore } = require("./DataStores");

module.exports.SetServerData = function SetServerData(Key, Data) {
  ServerDataStore.SetAsync(Key, Data).then((Result) => {
    return true;
  });
};
