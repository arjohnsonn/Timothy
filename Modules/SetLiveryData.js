var { LiveryDataStore } = require("./DataStores");

module.exports.SetLiveryData = function SetLiveryData(Key, Data) {
  LiveryDataStore.SetAsync(Key, Data).then((Result) => {
    return true;
  });
};

module.exports.Refresh = function Refresh() {
  LiveryDataStore = require("./DataStores").LiveryDataStore;
};
