var { LiveryDataStore } = require("./DataStores");

module.exports.GetLiveryData = async function GetLiveryData(Input) {
  return await LiveryDataStore.GetAsync(Input).then(([data]) => {
    let LiveryData;
    if (!data || data === null) return;

    LiveryData = data;

    return LiveryData;
  });
};

module.exports.Refresh = function Refresh() {
  LiveryDataStore = require("./DataStores").LiveryDataStore;
};
