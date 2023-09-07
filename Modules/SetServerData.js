var { ServerDataStore } = require("./DataStores");

module.exports.SetServerData = function SetServerData(Key, Data) {
  ServerDataStore.SetAsync(Key, Data).then((Result) => {
    return true;
  });
};

module.exports.Refresh = function Refresh() {
  ServerDataStore = require("./DataStores").ServerDataStore;
};
